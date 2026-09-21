let pendingAiOpenTabId: string | null = null;

export function setPendingAiOpenTab(tabId: string | null): void {
  pendingAiOpenTabId = tabId;
}

export function getPendingAiOpenTab(): string | null {
  return pendingAiOpenTabId;
}

export function consumePendingAiOpenTab(tabId?: string): boolean {
  if (!pendingAiOpenTabId) return false;
  if (!tabId || pendingAiOpenTabId === tabId) {
    pendingAiOpenTabId = null;
    return true;
  }
  return false;
}
