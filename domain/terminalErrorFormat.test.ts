import test from "node:test";
import assert from "node:assert/strict";
import { formatTerminalConnectionErrorMessage } from "./terminalErrorFormat.ts";

test("formatTerminalConnectionErrorMessage unwrap Electron IPC error prefixes", () => {
  const raw = "Error invoking remote method 'netcatty:start': Error: Connection timeout to 10.60.1.58";
  assert.equal(
    formatTerminalConnectionErrorMessage(raw),
    "Connection timeout to 10.60.1.58",
  );
});

test("formatTerminalConnectionErrorMessage handles Error instances", () => {
  const err = new Error("Error invoking remote method 'yetiterm:start': Error: Connection timeout to 10.60.1.58");
  assert.equal(
    formatTerminalConnectionErrorMessage(err),
    "Connection timeout to 10.60.1.58",
  );
});

test("formatTerminalConnectionErrorMessage replaces legacy netcatty casing", () => {
  assert.equal(
    formatTerminalConnectionErrorMessage("netcatty connection failed"),
    "yetiterm connection failed",
  );
  assert.equal(
    formatTerminalConnectionErrorMessage("NETCATTY connection failed"),
    "YETITERM connection failed",
  );
  assert.equal(
    formatTerminalConnectionErrorMessage("Netcatty connection failed"),
    "YetiTerm connection failed",
  );
});

test("formatTerminalConnectionErrorMessage passes through plain errors", () => {
  assert.equal(
    formatTerminalConnectionErrorMessage("Connection refused"),
    "Connection refused",
  );
  assert.equal(
    formatTerminalConnectionErrorMessage(null),
    "",
  );
});
