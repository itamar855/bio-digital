import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, UserCircle, Search, FolderKanban, Banknote, PenTool, LogOut, MessageSquare, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

const partnerMenuItems = [
  { title: "Painel do Parceiro", icon: LayoutDashboard, url: "/partner" },
  { title: "Oportunidades", icon: Search, url: "/partner/opportunities" },
  { title: "Meus Projetos", icon: FolderKanban, url: "/partner/projects" },
  { title: "Financeiro", icon: Banknote, url: "/partner/financial" },
  { title: "Minhas Ferramentas", icon: PenTool, url: "/partner/tools" },
  { title: "Meu Perfil", icon: UserCircle, url: "/partner/profile" },
];

export function PartnerLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="p-4 flex items-center gap-2 border-b border-slate-100">
            <div className="bg-slate-900 p-2 rounded-lg text-white">
              <UserCircle size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">Hub de Parceiros</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Painel de Gestão</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {partnerMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location.pathname === item.url}
                        className={`transition-colors py-5 px-4 rounded-lg flex items-center gap-3 ${
                          location.pathname === item.url 
                            ? "bg-slate-900 text-white font-medium shadow-lg" 
                            : "hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Link to={item.url}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <div className="mt-auto p-4 border-t border-slate-100">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-slate-500 hover:text-destructive hover:bg-destructive/5 py-4 px-4 rounded-lg">
                  <Link to="/">
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
          <SidebarRail />
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-6 shadow-sm">
            <SidebarTrigger className="md:hidden" />
            <div className="flex flex-1 items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {partnerMenuItems.find(item => item.url === location.pathname)?.title || "Dashboard"}
              </h2>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <button className="relative p-2 text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>
          </header>
          <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}