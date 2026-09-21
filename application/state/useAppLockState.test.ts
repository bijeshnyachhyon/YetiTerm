import assert from "node:assert/strict";
import test from "node:test";
import type { AppLockPasswordVerifier, AppLockSettings } from "../../domain/appLock.ts";
import {
  createOptimisticUnlockedRuntimeState,
  DEFAULT_APP_LOCK_SYSTEM_UNLOCK_STATUS,
  getIdleLockDelayMs,
  normalizeAppLockSystemUnlockStatus,
  normalizeAppLockSystemUnlockResult,
  resolveEffectiveAppLockRuntimeState,
  resolveUnlockAttempt,
  shouldLockAfterIdle,
  shouldLockOnStartup,
} from "./useAppLockState.ts";
import { selectPreferredRuntimeAppLockState } from "./useAppLockRuntime.ts";

const verifier: AppLockPasswordVerifier = {
  version: 1,
  algorithm: "PBKDF2-SHA256",
  iterations: 210000,
  salt: Buffer.alloc(16, 1).toString("base64"),
  hash: Buffer.alloc(32, 2).toString("base64"),
};

test("shouldLockOnStartup locks only when enabled with a verifier", () => {
  const enabled: AppLockSettings = {
    enabled: true,
    timeoutMinutes: 15,
    systemUnlockEnabled: false,
    systemUnlockAutoPromptEnabled: false,
    passwordVerifier: verifier,
  };

  assert.equal(shouldLockOnStartup(enabled), true);
  assert.equal(shouldLockOnStartup({ ...enabled, enabled: false }), false);
  assert.equal(shouldLockOnStartup({ ...enabled, passwordVerifier: null }), false);
});

test("shouldLockAfterIdle honors the configured timeout", () => {
  const settings: AppLockSettings = {
    enabled: true,
    timeoutMinutes: 5,
    systemUnlockEnabled: false,
    systemUnlockAutoPromptEnabled: false,
    passwordVerifier: verifier,
  };

  assert.equal(shouldLockAfterIdle(settings, 1_000, 1_000 + 5 * 60_000 - 1), false);
  assert.equal(shouldLockAfterIdle(settings, 1_000, 1_000 + 5 * 60_000), true);
  assert.equal(shouldLockAfterIdle({ ...settings, timeoutMinutes: 0 }, 1_000, 1_000 + 60 * 60_000), false);
  assert.equal(shouldLockAfterIdle({ ...settings, enabled: false }, 1_000, 1_000 + 60 * 60_000), false);
  assert.equal(shouldLockAfterIdle({ ...settings, passwordVerifier: null }, 1_000, 1_000 + 60 * 60_000), false);
});

test("getIdleLockDelayMs schedules the next check after remaining idle time", () => {
  const settings: AppLockSettings = {
    enabled: true,
    timeoutMinutes: 5,
    systemUnlockEnabled: false,
    systemUnlockAutoPromptEnabled: false,
    passwordVerifier: verifier,
  };

  assert.equal(getIdleLockDelayMs(settings, 1_000, 1_000), 5 * 60_000);
  assert.equal(getIdleLockDelayMs(settings, 1_000, 1_000 + 4 * 60_000), 60_000);
  assert.equal(getIdleLockDelayMs(settings, 1_000, 1_000 + 5 * 60_000), 0);
  assert.equal(getIdleLockDelayMs({ ...settings, timeoutMinutes: 0 }, 1_000, 1_000), null);
  assert.equal(getIdleLockDelayMs({ ...settings, enabled: false }, 1_000, 1_000), null);
  assert.equal(getIdleLockDelayMs({ ...settings, passwordVerifier: null }, 1_000, 1_000), null);
});

test("createOptimisticUnlockedRuntimeState clears stale locked state after successful unlock", () => {
  const nextState = createOptimisticUnlockedRuntimeState(
    {
      initialized: false,
      locked: true,
      reason: "startup",
      version: 7,
      lastLockedAt: 2_000,
      lastUnlockedAt: null,
      lastActivityAt: 1_000,
    },
    5_000,
  );

  assert.deepEqual(nextState, {
    initialized: true,
    locked: false,
    reason: null,
    // Optimistic unlock must not invent a higher version than main has sent.
    version: 7,
    lastLockedAt: 2_000,
    lastUnlockedAt: 5_000,
    lastActivityAt: 5_000,
  });
});

test("createOptimisticUnlockedRuntimeState keeps observed version so concurrent re-lock can win", () => {
  const optimistic = createOptimisticUnlockedRuntimeState(
    {
      initialized: true,
      locked: true,
      reason: "startup",
      version: 7,
      lastLockedAt: 2_000,
      lastUnlockedAt: null,
      lastActivityAt: 1_000,
    },
    5_000,
  );

  assert.equal(optimistic.version, 7);
  assert.equal(optimistic.locked, false);
  // A concurrent main re-lock at version 8 must outrank the optimistic unlock.
  const preferred = selectPreferredRuntimeAppLockState(optimistic, {
    ...optimistic,
    locked: true,
    reason: "manual",
    version: 8,
    lastLockedAt: 6_000,
  });
  assert.equal(preferred.locked, true);
  assert.equal(preferred.version, 8);
});

test("normalizes app lock system unlock bridge status and results", () => {
  assert.deepEqual(DEFAULT_APP_LOCK_SYSTEM_UNLOCK_STATUS, {
    supported: false,
    available: false,
    enabled: false,
    platform: "unsupported",
    label: null,
    reason: null,
  });
  assert.deepEqual(
    normalizeAppLockSystemUnlockStatus({
      supported: true,
      available: true,
      enabled: true,
      platform: "win32",
      label: "Windows Hello",
      reason: "",
    }),
    {
      supported: true,
      available: true,
      enabled: true,
      platform: "win32",
      label: "Windows Hello",
      reason: null,
    },
  );
  assert.deepEqual(normalizeAppLockSystemUnlockResult({ ok: true }), { ok: true });
  assert.deepEqual(normalizeAppLockSystemUnlockResult({ ok: false, error: "cancelled" }), {
    ok: false,
    error: "cancelled",
  });
  assert.deepEqual(normalizeAppLockSystemUnlockResult({ ok: false, error: "unknown" }), {
    ok: false,
    error: "failed",
  });
});


test("resolveUnlockAttempt validates empty, incorrect, and correct passwords", async () => {
  const originalWindow = globalThis.window;
  globalThis.window = {
    netcatty: {
      requestAppLockUnlock: async (password: string) =>
        password === "secret"
          ? { ok: true as const }
          : { ok: false as const, error: "incorrect" as const },
    },
  } as typeof window;

  try {
    assert.deepEqual(await resolveUnlockAttempt(""), { ok: false, error: "empty" });
    assert.deepEqual(await resolveUnlockAttempt("wrong"), { ok: false, error: "incorrect" });
    assert.deepEqual(await resolveUnlockAttempt("secret"), { ok: true });
  } finally {
    globalThis.window = originalWindow;
  }
});

test("resolveEffectiveAppLockRuntimeState ensures app is NEVER locked without a password", () => {
  const disabledSettings: AppLockSettings = {
    enabled: false,
    timeoutMinutes: 15,
    systemUnlockEnabled: false,
    systemUnlockAutoPromptEnabled: false,
    passwordVerifier: null,
  };

  // Even if backend runtime reported locked: true, disabled settings must force locked: false
  const resultFromLocked = resolveEffectiveAppLockRuntimeState(
    {
      initialized: true,
      locked: true,
      reason: "startup",
      version: 1,
      lastLockedAt: 1000,
      lastUnlockedAt: null,
      lastActivityAt: 1000,
    },
    disabledSettings,
  );
  assert.equal(resultFromLocked.locked, false);
  assert.equal(resultFromLocked.reason, null);

  // Uninitialized state with disabled settings must also remain unlocked
  const resultFromUninit = resolveEffectiveAppLockRuntimeState(
    {
      initialized: false,
      locked: false,
      reason: null,
      version: 0,
      lastLockedAt: null,
      lastUnlockedAt: null,
      lastActivityAt: null,
    },
    disabledSettings,
  );
  assert.equal(resultFromUninit.locked, false);
  assert.equal(resultFromUninit.reason, null);

  // Enabled settings with valid verifier locks when uninitialized
  const enabledSettings: AppLockSettings = {
    ...disabledSettings,
    enabled: true,
    passwordVerifier: verifier,
  };
  const resultEnabledUninit = resolveEffectiveAppLockRuntimeState(
    {
      initialized: false,
      locked: false,
      reason: null,
      version: 0,
      lastLockedAt: null,
      lastUnlockedAt: null,
      lastActivityAt: null,
    },
    enabledSettings,
  );
  assert.equal(resultEnabledUninit.locked, true);
  assert.equal(resultEnabledUninit.reason, "startup");

  // Enabled settings with initialized unlocked runtime stays unlocked
  const resultEnabledUnlocked = resolveEffectiveAppLockRuntimeState(
    {
      initialized: true,
      locked: false,
      reason: null,
      version: 2,
      lastLockedAt: null,
      lastUnlockedAt: 2000,
      lastActivityAt: 2000,
    },
    enabledSettings,
  );
  assert.equal(resultEnabledUnlocked.locked, false);
});

