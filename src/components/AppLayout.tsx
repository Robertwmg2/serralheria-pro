import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useStore } from "@/lib/store";
import { t } from "@/lib/i18n";

export function AppLayout({ children, title }: { children: ReactNode; title?: string }) {
  const locale = useStore((state) => state.locale);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border bg-card/50 backdrop-blur px-4 sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="h-5 w-px bg-border" />
            <h1 className="font-display text-lg font-semibold tracking-wide">
              {title || t(locale, "app.dashboard")}
            </h1>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
