import { useEffect, useState } from "react";
import { PartnerLayout } from "@/components/PartnerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, FolderKanban, Banknote, Briefcase, Star, Clock, MapPin, ArrowUpRight, Filter, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

type PartnerDetails = Database['public']['Tables']['partner_details']['Row'];
type Opportunity = Database['public']['Tables']['opportunities']['Row'];

export function PartnerDashboard() {
  const { user, profile } = useAuth();
  const [details, setDetails] = useState<PartnerDetails | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([fetchPartnerDetails(), fetchOpportunities()]).finally(() => setLoading(false));
    }
  }, [user]);

  const fetchPartnerDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_details')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: newData, error: insertError } = await supabase
            .from('partner_details')
            .insert({ user_id: user!.id })
            .select()
            .single();
          if (insertError) throw insertError;
          setDetails(newData);
        } else throw error;
      } else {
        setDetails(data);
      }
    } catch (error) {
      console.error('Error fetching partner details:', error);
    }
  };

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };

  if (loading) {
    return (
      <PartnerLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PartnerLayout>
    );
  }

  const stats = [
    { label: "Projetos Ativos", value: details?.active_projects || 0, icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Oportunidades", value: details?.opportunities_count || 0, icon: Search, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Ganhos Mensais", value: `R$ ${details?.monthly_earnings?.toLocaleString() || 0}`, icon: Banknote, color: "text-green-500", bg: "bg-green-50" },
    { label: "Avaliação", value: details?.rating || "N/A", icon: Star, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <PartnerLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Painel do Parceiro</h1>
            <p className="text-slate-500">Olá, {profile?.full_name}! Acompanhe seu desempenho e novas oportunidades.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Filter size={16} /> Filtrar
            </Button>
            <Button className="bg-slate-900 text-white gap-2">
              Meu Perfil Profissional
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                    <stat.icon size={24} />
                  </div>
                  <div className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+4%</div>
                </div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Briefcase size={20} className="text-slate-400" /> Novas Oportunidades
              </h2>
              <Button variant="link" className="text-primary font-semibold">Ver todas</Button>
            </div>
            
            <div className="space-y-4">
              {opportunities.length > 0 ? opportunities.map((opp) => (
                <Card key={opp.id} className="border-slate-200 hover:border-primary/50 transition-all cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{opp.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-slate-700">{opp.company_name}</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {opp.location}</span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none">R$ {opp.price.toLocaleString()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1"><Clock size={12} /> Prazo: {opp.duration}</div>
                      <div className="flex items-center gap-1"><Star size={12} className="text-amber-500" /> Requisito: {opp.requirement}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-end">
                    <Button size="sm" className="gap-2 bg-slate-100 text-slate-900 hover:bg-primary hover:text-white transition-all">
                      Tenho Interesse <ArrowUpRight size={14} />
                    </Button>
                  </CardFooter>
                </Card>
              )) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed text-slate-400">
                  Nenhuma oportunidade encontrada no momento.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Briefcase size={20} className="text-slate-400" /> Resumo Financeiro
            </h2>
            <Card className="border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <p className="text-slate-400 text-sm mb-1">Saldo Disponível</p>
                <h3 className="text-3xl font-bold">R$ {details?.available_balance?.toLocaleString() || "0,00"}</h3>
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-bold border-none shadow-lg">
                  Solicitar Saque
                </Button>
              </div>
              <CardContent className="p-6 bg-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <div className="text-sm">
                      <p className="font-semibold">Próximo Payout</p>
                      <p className="text-xs text-slate-400">Calculado automaticamente</p>
                    </div>
                    <div className="text-right font-bold">R$ 0,00</div>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <div className="text-sm">
                      <p className="font-semibold">Comissão Plataforma</p>
                      <p className="text-xs text-slate-400">Mês vigente</p>
                    </div>
                    <div className="text-right font-bold text-red-500">- R$ 0,00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}