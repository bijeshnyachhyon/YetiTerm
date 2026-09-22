import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import AppLogo from "./AppLogo";
import AppWordmark from "./AppWordmark";
import { useApplicationBackend } from "../application/state/useApplicationBackend";
import type { UpdateState, UseUpdateCheckResult } from "../application/state/useUpdateCheck";
import { SettingsAnchor, SettingsTabContent } from "./settings/settings-ui";

type AppInfo = {
  name: string;
  version: string;
  platform?: string;
};

interface SettingsApplicationTabProps {
  updateState?: UpdateState;
  checkNow?: UseUpdateCheckResult['checkNow'];
  openReleasePage?: UseUpdateCheckResult['openReleasePage'];
  installUpdate?: UseUpdateCheckResult['installUpdate'];
  startDownload?: UseUpdateCheckResult['startDownload'];
  isUpdateDemoMode?: boolean;
}

export default function SettingsApplicationTab(_props: SettingsApplicationTabProps) {
  const { getApplicationInfo, openExternal } = useApplicationBackend();
  const [appInfo, setAppInfo] = useState<AppInfo>({ name: "YetiTerm", version: "1.0.0" });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const info = await getApplicationInfo();
        if (!cancelled && info) {
          setAppInfo({
            name: info.name || "YetiTerm",
            version: info.version || "1.0.0",
            platform: info.platform,
          });
        }
      } catch {
        // use fallback
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [getApplicationInfo]);

  return (
    <SettingsTabContent value="about">
      <div className="space-y-6">
        {/* Application Overview & Identity */}
        <SettingsAnchor anchorId="application-about">
          <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-5">
              <AppLogo className="w-16 h-16 rounded-xl shrink-0 shadow-sm" />
              <div className="min-w-0">
                <AppWordmark accessibleLabel="YetiTerm" className="h-8 w-auto text-foreground" />
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    v{appInfo.version || "1.0.0"}
                  </span>
                  <span className="text-xs text-muted-foreground">Production Release</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              YetiTerm is a modern, high-performance SSH client and terminal workspace. It provides unified infrastructure management across SSH, Mosh, and Serial sessions with built-in SFTP, port forwarding tunnels, credential keychain, and command automation.
            </p>
          </div>
        </SettingsAnchor>

        {/* Developer Attribution */}
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <User size={16} className="text-primary" />
            Developer Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 rounded-lg bg-muted/40 border border-border/40">
              <div className="text-xs font-medium text-muted-foreground">Developed by</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">Bijesh Lal Nyachhyon</div>
            </div>
            <div className="p-3.5 rounded-lg bg-muted/40 border border-border/40">
              <div className="text-xs font-medium text-muted-foreground">Email</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">
                <a
                  href="mailto:bijesh.nyachhyon@gmail.com"
                  onClick={(e) => {
                    e.preventDefault();
                    void openExternal?.("mailto:bijesh.nyachhyon@gmail.com");
                  }}
                  className="hover:underline text-foreground hover:text-primary transition-colors cursor-pointer select-text"
                >
                  bijesh.nyachhyon@gmail.com
                </a>
              </div>
            </div>
            <div className="p-3.5 rounded-lg bg-muted/40 border border-border/40 sm:col-span-2">
              <div className="text-xs font-medium text-muted-foreground">Country</div>
              <div className="text-sm font-semibold text-foreground mt-0.5">
                Nepal
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsTabContent>
  );
}
