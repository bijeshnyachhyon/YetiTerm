import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReleaseInfo, UpdateCheckResult } from '../../infrastructure/services/updateService';
import { netcattyBridge } from '../../infrastructure/services/netcattyBridge';

export type AutoDownloadStatus = 'idle' | 'downloading' | 'ready' | 'error';
export type ManualCheckStatus = 'idle' | 'checking' | 'available' | 'up-to-date' | 'error';

export interface UpdateState {
  isChecking: boolean;
  hasUpdate: boolean;
  currentVersion: string;
  latestRelease: ReleaseInfo | null;
  error: string | null;
  lastCheckedAt: number | null;
  autoDownloadStatus: AutoDownloadStatus;
  downloadPercent: number;
  downloadError: string | null;
  manualCheckStatus: ManualCheckStatus;
}

export interface UseUpdateCheckResult {
  updateState: UpdateState;
  checkNow: () => Promise<UpdateCheckResult | null>;
  dismissUpdate: () => void;
  openReleasePage: () => void;
  installUpdate: () => void;
  startDownload: () => void;
  isUpdateDemoMode: boolean;
}

/**
 * Hook for update checks (updates and background triggers disabled).
 */
export function useUpdateCheck(options?: { autoUpdateEnabled?: boolean; enabled?: boolean; onNeedsSave?: () => void }): UseUpdateCheckResult {
  const enabled = options?.enabled !== false;
  const hasCheckedOnStartupRef = useRef(false);
  const startupCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [updateState, setUpdateState] = useState<UpdateState>({
    isChecking: false,
    hasUpdate: false,
    currentVersion: '1.0.0',
    latestRelease: null,
    error: null,
    lastCheckedAt: null,
    autoDownloadStatus: 'idle',
    downloadPercent: 0,
    downloadError: null,
    manualCheckStatus: 'idle',
  });

  useEffect(() => {
    if (!enabled) return;
    const loadVersion = async () => {
      try {
        const bridge = netcattyBridge.get();
        const info = await bridge?.getAppInfo?.();
        if (info?.version) {
          setUpdateState((prev) => ({ ...prev, currentVersion: info.version }));
        }
      } catch {
        // Ignore - running without Electron bridge
      }
    };
    void loadVersion();
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let checkArmed = true;
    startupCheckTimeoutRef.current = setTimeout(async () => {
      checkArmed = false;
    }, 0);

    return () => {
      if (startupCheckTimeoutRef.current) {
        clearTimeout(startupCheckTimeoutRef.current);
        startupCheckTimeoutRef.current = null;
      }
      if (checkArmed) {
        hasCheckedOnStartupRef.current = false;
      }
    };
  }, [enabled]);

  const checkNow = useCallback(async (): Promise<UpdateCheckResult | null> => {
    return {
      hasUpdate: false,
      currentVersion: updateState.currentVersion || '1.0.0',
      latestRelease: null,
    };
  }, [updateState.currentVersion]);

  const dismissUpdate = useCallback(() => {}, []);
  const openReleasePage = useCallback(() => {}, []);
  const installUpdate = useCallback(() => {}, []);
  const startDownload = useCallback(() => {}, []);

  return {
    updateState,
    checkNow,
    dismissUpdate,
    openReleasePage,
    installUpdate,
    startDownload,
    isUpdateDemoMode: false,
  };
}
