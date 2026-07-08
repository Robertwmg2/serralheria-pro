import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, FileText, Boxes, Wrench, Calendar,
  ListChecks, Image, PencilRuler, Scissors, Calculator, Wallet, Sparkles, Settings, Flame
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarHeader,
} from "@/components/ui/sidebar";

const grupos = [
  {
    label: "Operação",
    items: [
      { title: "Painel", url: "/", icon: LayoutDashboard },
      { title: "Clientes", url: "/clientes", icon: Users },
      { title: "Orçamentos", url: "/orcamentos", icon: FileText },
      { title: "Agenda", url: "/agenda", icon: Calendar },
      { title: "Projetos", url: "/projetos", icon: ListChecks },
    ],
  },
  {
    label: "Oficina",
    items: [
      { title: "Materiais", url: "/materiais", icon: Boxes },
      { title: "Ferramentas", url: "/ferramentas", icon: Wrench },
      { title: "Cortes", url: "/cortes", icon: Scissors },
      { title: "Croqui CAD", url: "/cad", icon: PencilRuler },
      { title: "Portfólio", url: "/portfolio", icon: Image },
    ],
  },
  {
    label: "Gestão",
    items: [
      { title: "Financeiro", url: "/financeiro", icon: Wallet },
      { title: "Simulador", url: "/simulador", icon: Calculator },
      { title: "Mestre IA", url: "/ia", icon: Sparkles },
      { title: "Configurações", url: "/configuracoes", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
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
