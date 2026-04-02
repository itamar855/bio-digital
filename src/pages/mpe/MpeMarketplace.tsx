import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2, Target, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function MpeMarketplace() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_opportunities')
        .select('*')
        .eq('status', 'active');
      
      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      toast.error("Erro ao carregar serviços do marketplace.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="h-40 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <ShoppingBag className="text-primary" /> Marketplace de Serviços
        </h1>
        <p className="text-slate-500 mt-1">Conecte-se com especialistas e contrate serviços aprovados para alavancar sua MPE.</p>
      </div>

      {opportunities.length === 0 ? (
        <Card className="bg-slate-50 dark:bg-slate-900 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Target className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold">Nenhuma oportunidade disponível</h3>
            <p className="text-slate-500 text-sm">No momento não há serviços cadastrados no marketplace.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <Card key={opp.id} className="border-slate-200 hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{opp.category || "Serviço"}</Badge>
                  <span className="font-bold text-lg text-slate-900 dark:text-white">
                    {opp.price ? `R$ ${opp.price}` : "Sob Consulta"}
                  </span>
                </div>
                <CardTitle className="text-xl">{opp.title}</CardTitle>
                <CardDescription className="line-clamp-2">{opp.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                <ul className="space-y-2 mt-2">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Profissional Homologado</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Negociação Segura</li>
                </ul>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full">Tenho Interesse</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
