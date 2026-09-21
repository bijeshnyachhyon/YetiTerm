/**
 * Update Service
 *
 * Update checks and triggers disabled.
 */

export interface ReleaseInfo {
  version: string;       // e.g. "1.0.0" (without 'v' prefix)
  tagName: string;       // e.g. "v1.0.0"
  name: string;          // Release title
  body: string;          // Release notes (markdown)
  htmlUrl: string;       // URL to the release page
  publishedAt: string;   // ISO date string
  assets: ReleaseAsset[];
}

export interface ReleaseAsset {
  name: string;
  browserDownloadUrl: string;
  size: number;
}

export interface UpdateCheckResult {
  hasUpdate: boolean;
  currentVersion: string;
  latestRelease: ReleaseInfo | null;
  error?: string;
}

export function compareVersions(_a: string, _b: string): number {
  return 0;
}

export async function checkForUpdates(currentVersion: string): Promise<UpdateCheckResult> {
  return {
    hasUpdate: false,
    currentVersion,
    latestRelease: null,
  };
}

export function getReleaseUrl(_version?: string): string {
  return '';
}

export function getDownloadUrlForPlatform(
  _release: ReleaseInfo,
  _platform: string
): string | null {
  return null;
}

export interface ElectronUpdateCheckResult {
  available: boolean;
  supported?: boolean;
  version?: string;
  releaseNotes?: string;
  releaseDate?: string | null;
  error?: string;
}

export interface UpdateDownloadProgress {
  percent: number;
  bytesPerSecond: number;
  transferred: number;
  total: number;
}

export async function checkForUpdate(): Promise<ElectronUpdateCheckResult> {
  return { available: false, supported: false };
}

export async function downloadUpdate(): Promise<{ success: boolean; error?: string }> {
  return { success: false, error: "Updates disabled" };
}

export function installUpdate(): void {}

export function onDownloadProgress(
  _cb: (progress: UpdateDownloadProgress) => void,
): (() => void) | undefined {
  return undefined;
}

export function onDownloaded(_cb: () => void): (() => void) | undefined {
  return undefined;
}

export function onError(
  _cb: (payload: { error: string }) => void,
): (() => void) | undefined {
  return undefined;
}

export function getReleasesUrl(_version?: string): string {
  return '';
}
