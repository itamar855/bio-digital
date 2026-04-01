import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Globe, ShoppingBag, Settings, BookOpen, CreditCard, LogOut, User, MessageCircle, Info } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { title: "Painel Geral", icon: LayoutDashboard, url: "/mpe" },
  { title: "Presença Digital", icon: Globe, url: "/mpe/website" },
  { title: "Marketplace", icon: ShoppingBag, url: "/mpe/marketplace" },
  { title: "Minhas Ferramentas", icon: Settings, url: "/mpe/tools" },
  { title: "Minha Academia", icon: BookOpen, url: "/mpe/academy" },
  { title: "Faturamento", icon: CreditCard, url: "/mpe/billing" },
];

export function MpeLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="p-4 flex items-center gap-2 border-b border-slate-100">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Globe size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">Ecossistema</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location.pathname === item.url}
                        className={`transition-colors py-5 px-4 rounded-lg flex items-center gap-3 ${
                          location.pathname === item.url 
                            ? "bg-primary/10 text-primary font-medium border border-primary/20" 
                            : "hover:bg-slate-100 text-slate-600 border border-transparent"
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
            <div className="flex items-center gap-3 mb-6 p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
              <div className="bg-slate-200 h-10 w-10 rounded-full flex items-center justify-center text-slate-600">
                <User size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">José da Silva</p>
                <p className="text-xs text-slate-500 truncate">Café Central MPE</p>
              </div>
            </div>
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
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6 shadow-sm">
            <SidebarTrigger className="md:hidden" />
            <div className="flex flex-1 items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                {menuItems.find(item => item.url === location.pathname)?.title || "Dashboard"}
              </h2>
              <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
                  <MessageCircle size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full">
                  <Info size={20} />
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