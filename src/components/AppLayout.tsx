import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function AppLayout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border bg-card/50 backdrop-blur px-4 sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="h-5 w-px bg-border" />
            <h1 className="font-display text-lg font-semibold tracking-wide">
              {title || "Painel"}
            </h1>
          </header>
          <main className="flex-1 p-4 md:p-6 animate-fade-in">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
