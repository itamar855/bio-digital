import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, UserCheck, ShoppingBag, Banknote, BrainCircuit, MessageSquare, ShieldCheck, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const adminMenuItems = [
  { title: "Painel Geral", icon: LayoutDashboard, url: "/admin" },
  { title: "Gestão de MPEs", icon: Users, url: "/admin/mpe" },
  { title: "Gestão de Parceiros", icon: UserCheck, url: "/admin/partners" },
  { title: "Marketplace & Serviços", icon: ShoppingBag, url: "/admin/marketplace" },
  { title: "Financeiro", icon: Banknote, url: "/admin/financial" },
  { title: "Conteúdo & IA", icon: BrainCircuit, url: "/admin/content" },
  { title: "Suporte", icon: MessageSquare, url: "/admin/support" },
];

function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="p-4 flex items-center gap-2 border-b border-slate-100">
            <div className="bg-destructive p-2 rounded-lg text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">Admin Hub</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Painel de Controle</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location.pathname === item.url}
                        className={`transition-colors py-5 px-4 rounded-lg flex items-center gap-3 ${
                          location.pathname === item.url 
                            ? "bg-destructive/10 text-destructive font-bold border border-destructive/20" 
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
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6 shadow-sm">
            <SidebarTrigger className="md:hidden" />
            <div className="flex flex-1 items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Administração Geral</h2>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/5 font-bold">Admin</Badge>
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

export function AdminDashboard() {
  const adminStats = [
    { label: "Total MPEs", value: "245", sub: "+12 este mês" },
    { label: "Total Parceiros", value: "84", sub: "+5 este mês" },
    { label: "Receita Mensal", value: "R$ 15.240", sub: "+8% este mês" },
    { label: "Tickets Suporte", value: "14", sub: "8 urgentes" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Métricas Globais do Ecossistema</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminStats.map((stat, i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="p-6">
                <div className="text-sm font-medium text-slate-500 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs font-semibold text-green-500 mt-2">{stat.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Aprovações Pendentes</CardTitle>
              <CardDescription>Parceiros e conteúdos aguardando verificação.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "João Designer", role: "Designer", time: "2h atrás" },
                  { name: "Ana Contábil", role: "Contadora", time: "5h atrás" },
                  { name: "Marcos Ads", role: "Gestor de Tráfego", time: "1 dia atrás" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 h-10 w-10 rounded-full flex items-center justify-center font-bold text-slate-500">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs h-8">Ver Perfil</Button>
                      <Button size="sm" className="bg-green-600 text-xs h-8">Aprovar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Resumo de Transações</CardTitle>
              <CardDescription>Fluxo financeiro e comissões.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border-b border-slate-50">
                  <span className="text-sm text-slate-600">Total Transacionado</span>
                  <span className="font-bold">R$ 48.500,00</span>
                </div>
                <div className="flex justify-between items-center p-3 border-b border-slate-50">
                  <span className="text-sm text-slate-600">Comissões Retidas (15%)</span>
                  <span className="font-bold text-green-600">R$ 7.275,00</span>
                </div>
                <div className="flex justify-between items-center p-3 border-b border-slate-50">
                  <span className="text-sm text-slate-600">Payouts Processados</span>
                  <span className="font-bold text-slate-900">R$ 41.225,00</span>
                </div>
                <Button variant="link" className="w-full text-destructive font-bold text-sm">Ver Relatório Financeiro Completo</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}