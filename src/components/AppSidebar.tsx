import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Boxes,
  Wrench,
  Calendar,
  ListChecks,
  Image,
  PencilRuler,
  Scissors,
  Calculator,
  Wallet,
  Sparkles,
  Settings,
  Flame,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useStore } from "@/lib/store";
import { t, type Locale } from "@/lib/i18n";

const buildGroups = (locale: Locale) => [
  {
    label: t(locale, "sidebar.operation"),
    items: [
      { title: t(locale, "sidebar.dashboard"), url: "/", icon: LayoutDashboard },
      { title: t(locale, "sidebar.clients"), url: "/clientes", icon: Users },
      { title: t(locale, "sidebar.budgets"), url: "/orcamentos", icon: FileText },
      { title: t(locale, "sidebar.agenda"), url: "/agenda", icon: Calendar },
      { title: t(locale, "sidebar.projects"), url: "/projetos", icon: ListChecks },
    ],
  },
  {
    label: t(locale, "sidebar.workshop"),
    items: [
      { title: t(locale, "sidebar.materials"), url: "/materiais", icon: Boxes },
      { title: t(locale, "sidebar.tools"), url: "/ferramentas", icon: Wrench },
      { title: t(locale, "sidebar.cuts"), url: "/cortes", icon: Scissors },
      { title: t(locale, "sidebar.cad"), url: "/cad", icon: PencilRuler },
      { title: t(locale, "sidebar.portfolio"), url: "/portfolio", icon: Image },
    ],
  },
  {
    label: t(locale, "sidebar.management"),
    items: [
      { title: t(locale, "sidebar.finance"), url: "/financeiro", icon: Wallet },
      { title: t(locale, "sidebar.simulator"), url: "/simulador", icon: Calculator },
      { title: t(locale, "sidebar.ai"), url: "/ia", icon: Sparkles },
      { title: t(locale, "sidebar.settings"), url: "/configuracoes", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const locale = useStore((s) => s.locale);
  const grupos = buildGroups(locale);
  const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname.startsWith(path));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-md bg-ember shadow-ember">
            <Flame className="h-5 w-5 text-primary-foreground animate-spark" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display text-lg font-bold tracking-wide">GERIX</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary">PRO</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {grupos.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {g.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className={({ isActive }) =>
                          `flex items-center gap-3 ${
                            isActive
                              ? "!bg-sidebar-accent !text-primary font-medium border-l-2 border-primary"
                              : "hover:bg-sidebar-accent/60"
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
