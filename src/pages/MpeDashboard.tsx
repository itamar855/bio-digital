import { useEffect, useState } from "react";
import { MpeLayout } from "@/components/MpeLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Globe, ShoppingBag, CheckCircle2, Circle, TrendingUp, Users, ArrowRight, Zap, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

type MpeDetails = Database['public']['Tables']['mpe_details']['Row'];

export function MpeDashboard() {
  const { user, profile } = useAuth();
  const [details, setDetails] = useState<MpeDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMpeDetails();
    }
  }, [user]);

  const fetchMpeDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('mpe_details')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // If no details exist, create them
          const { data: newData, error: insertError } = await supabase
            .from('mpe_details')
            .insert({
              user_id: user!.id,
              company_name: 'Minha Empresa', // Default
            })
            .select()
            .single();
          if (insertError) throw insertError;
          setDetails(newData);
        } else {
          throw error;
        }
      } else {
        setDetails(data);
      }
    } catch (error) {
      console.error('Error fetching MPE details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MpeLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MpeLayout>
    );
  }

  return (
    <MpeLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Olá, {profile?.full_name || 'Usuário'}! 👋
          </h1>
          <p className="text-slate-500 mt-2">
            Veja como está o progresso digital da <span className="font-semibold text-primary">{details?.company_name || 'sua empresa'}</span> hoje.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-primary/10 group-hover:scale-110 transition-transform">
              <TrendingUp size={80} />
            </div>
            <CardHeader>
              <CardDescription className="text-primary font-medium">Visitas ao Site</CardDescription>
              <CardTitle className="text-4xl font-bold">{details?.site_visits?.toLocaleString() || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 w-fit px-2 py-1 rounded-full border border-green-100">
                <TrendingUp size={12} /> +12.5% este mês
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-slate-100 group-hover:scale-110 transition-transform">
              <Users size={80} />
            </div>
            <CardHeader>
              <CardDescription className="text-slate-500 font-medium">Novos Leads</CardDescription>
              <CardTitle className="text-4xl font-bold">{details?.new_leads || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 w-fit px-2 py-1 rounded-full border border-green-100">
                <TrendingUp size={12} /> +5 este mês
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-slate-100 group-hover:scale-110 transition-transform">
              <ShoppingBag size={80} />
            </div>
            <CardHeader>
              <CardDescription className="text-slate-500 font-medium">Serviços Ativos</CardDescription>
              <CardTitle className="text-4xl font-bold">{details?.active_services_count || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold bg-slate-50 w-fit px-2 py-1 rounded-full border border-slate-200">
                Contabilidade, Social Media...
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="text-amber-500" /> Sua Jornada Digital
                </CardTitle>
                <CardDescription>Complete os passos para o sucesso do seu negócio.</CardDescription>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{details?.journey_progress || 0}%</span>
                <p className="text-[10px] uppercase font-bold text-slate-400">Progresso</p>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Progress value={details?.journey_progress || 0} className="h-2 mb-8 bg-slate-100" />
              <div className="space-y-4">
                {[
                  { title: "Publicar Website", done: (details?.journey_progress || 0) >= 20, points: "20 pts" },
                  { title: "Conectar WhatsApp Business", done: (details?.journey_progress || 0) >= 35, points: "15 pts" },
                  { title: "Contratar Contador Especializado", done: (details?.journey_progress || 0) >= 65, points: "30 pts" },
                  { title: "Criar Primeira Campanha de Ads", done: (details?.journey_progress || 0) >= 90, points: "25 pts" },
                  { title: "Configurar Delivery/E-commerce", done: (details?.journey_progress || 0) >= 100, points: "40 pts" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${item.done ? "bg-slate-50 border-slate-100 opacity-60" : "bg-white border-slate-200 shadow-sm hover:border-primary/50 cursor-pointer"}`}>
                    <div className="flex items-center gap-3">
                      {item.done ? <CheckCircle2 className="text-green-500" /> : <Circle className="text-slate-300" />}
                      <span className={`font-medium ${item.done ? "line-through text-slate-500" : "text-slate-700"}`}>{item.title}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${item.done ? "bg-slate-200 text-slate-500" : "bg-primary/10 text-primary"}`}>
                      {item.points}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-lg flex flex-col overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-8">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-primary/20 p-2 rounded-lg backdrop-blur-sm">
                  <Globe className="text-primary-foreground" size={24} />
                </div>
                <div className="bg-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded-full border border-green-500/30 uppercase font-bold tracking-widest">
                  Online
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Minha Presença Digital</CardTitle>
              <CardDescription className="text-slate-400">Website IA Profissional ativo</CardDescription>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative bg-slate-100 group">
              <div className="aspect-video bg-white m-6 rounded-lg border border-slate-200 shadow-2xl overflow-hidden relative">
                {/* Mock Website Preview */}
                <div className="h-6 bg-slate-100 border-b flex items-center px-3 gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  <div className="ml-2 w-32 h-2.5 bg-white rounded-sm border"></div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-100 w-1/3 rounded"></div>
                  {details?.site_preview_url ? (
                    <img src={details.site_preview_url} alt="Preview" className="w-full h-20 object-cover rounded-lg" />
                  ) : (
                    <div className="h-20 bg-primary/5 border border-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="text-primary/20" size={32} />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-50 w-full rounded"></div>
                    <div className="h-2 bg-slate-50 w-3/4 rounded"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <Button variant="secondary" size="sm">Editar Website</Button>
                  <Button variant="default" size="sm" className="bg-primary">Gerar Conteúdo IA</Button>
                </div>
              </div>
              
              <div className="px-8 pb-8 space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-lg"><TrendingUp className="text-blue-500" size={16} /></div>
                    <span className="text-sm font-semibold">Ver Analytics Detalhado</span>
                  </div>
                  <ArrowRight size={16} className="text-slate-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MpeLayout>
  );
}