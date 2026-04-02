import { useEffect, useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, UserCheck, ShoppingBag, Banknote, BrainCircuit, MessageSquare, ShieldCheck, LogOut, Loader2 } from "lucide-react";
import { Link, useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
import { toast } from "sonner";
import { AdminMpe } from "./admin/AdminMpe";
import { AdminPartners } from "./admin/AdminPartners";
import { AdminMarketplace } from "./admin/AdminMarketplace";
import { AdminFinanceiro } from "./admin/AdminFinanceiro";
import { AdminSuporte } from "./admin/AdminSuporte";

type GlobalMetrics = Database['public']['Tables']['global_metrics']['Row'];

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
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
    toast.success("Saiu com sucesso.");
  };

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
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-destructive hover:bg-destructive/5 py-4 px-4 rounded-lg w-full flex items-center gap-3"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
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

// ========== Painel Geral (Home) ==========
function AdminHome() {
  const [metrics, setMetrics] = useState<GlobalMetrics | null>(null);
  const [pendingPartners, setPendingPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchMetrics(), fetchPendingPartners()]).finally(() => setLoading(false));
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase.from('global_metrics').select('*').eq('id', 1).single();
      if (error && error.code !== 'PGRST116') throw error;
      setMetrics(data);
    } catch (error) { console.error('Error fetching metrics:', error); }
  };

  const fetchPendingPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_details')
        .select('user_id, profiles(full_name, role)')
        .eq('approval_status', 'pending')
        .limit(3);
      if (error) throw error;
      setPendingPartners(data || []);
    } catch (error) { console.error('Error fetching partners:', error); }
  };

  const handleApprove = async (userId: string) => {
    const { error } = await supabase.from('partner_details').update({ approval_status: 'approved' }).eq('user_id', userId);
    if (error) { toast.error("Erro ao aprovar parceiro."); return; }
    toast.success("Parceiro aprovado!");
    fetchPendingPartners();
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-destructive" /></div>;

  const adminStats = [
    { label: "Total MPEs", value: metrics?.total_mpes || 0, sub: "+12 este mês" },
    { label: "Total Parceiros", value: metrics?.total_partners || 0, sub: "+5 este mês" },
    { label: "Receita Mensal", value: `R$ ${metrics?.monthly_revenue?.toLocaleString() || 0}`, sub: "+8% este mês" },
    { label: "Tickets Suporte", value: metrics?.support_tickets_count || 0, sub: `${metrics?.urgent_tickets_count || 0} urgentes` },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Métricas Globais do Ecossistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat, i) => (
          <Card key={i} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
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
              {pendingPartners.length > 0 ? pendingPartners.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 h-10 w-10 rounded-full flex items-center justify-center font-bold text-slate-500 uppercase">
                      {item.profiles?.full_name?.charAt(0) || "P"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.profiles?.full_name || "Parceiro"}</p>
                      <p className="text-xs text-slate-500 capitalize">{item.profiles?.role || "Parceiro"}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-8">Ver Perfil</Button>
                    <Button size="sm" className="bg-green-600 text-xs h-8" onClick={() => handleApprove(item.user_id)}>Aprovar</Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-400 text-sm">Nenhuma aprovação pendente.</div>
              )}
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
                <span className="font-bold">R$ 0,00</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-slate-50">
                <span className="text-sm text-slate-600">Comissões Retidas (15%)</span>
                <span className="font-bold text-green-600">R$ 0,00</span>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-slate-50">
                <span className="text-sm text-slate-600">Payouts Processados</span>
                <span className="font-bold text-slate-900">R$ 0,00</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ========== Conteúdo & IA placeholder ==========
function AdminConteudo() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-3xl font-extrabold text-slate-900">Conteúdo & IA</h1>
      <Card className="border-slate-200">
        <CardContent className="py-20 text-center">
          <BrainCircuit className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-400 font-medium text-lg">Em Desenvolvimento</p>
          <p className="text-slate-300 mt-1">Este módulo será implementado em breve.</p>
        </CardContent>
      </Card>
    </div>
  );
}

// ========== Router principal ==========
export function AdminDashboard() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="mpe" element={<AdminMpe />} />
        <Route path="partners" element={<AdminPartners />} />
        <Route path="marketplace" element={<AdminMarketplace />} />
        <Route path="financial" element={<AdminFinanceiro />} />
        <Route path="content" element={<AdminConteudo />} />
        <Route path="support" element={<AdminSuporte />} />
      </Routes>
    </AdminLayout>
  );
}
