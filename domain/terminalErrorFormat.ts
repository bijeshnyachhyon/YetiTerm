/**
 * Formats and sanitizes terminal connection error messages.
 * Strips internal Electron IPC wrappers (e.g. "Error invoking remote method '...': Error: ...")
 * and replaces residual legacy app names with YetiTerm.
 */
const ELECTRON_INVOKE_PREFIX = /^error invoking remote method '[^']+':\s*(?:error:\s*)?/i;

export function formatTerminalConnectionErrorMessage(err: unknown): string {
  if (err == null) return "";
  let message = err instanceof Error ? err.message : String(err);
  message = message.trim();

  // Strip nested or repeated Electron IPC wrappers
  while (ELECTRON_INVOKE_PREFIX.test(message)) {
    message = message.replace(ELECTRON_INVOKE_PREFIX, "").trim();
  }

  // Replace residual legacy name "netcatty" with "YetiTerm" (case-preserving)
  message = message.replace(/netcatty/gi, (match) => {
    if (match === "NETCATTY") return "YETITERM";
    if (match === "netcatty") return "yetiterm";
    return "YetiTerm";
  });

  return message.trim();
}
