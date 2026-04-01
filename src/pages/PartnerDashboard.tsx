import { PartnerLayout } from "@/components/PartnerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, FolderKanban, Banknote, Briefcase, Star, Clock, MapPin, ArrowUpRight, Filter } from "lucide-react";

export function PartnerDashboard() {
  const stats = [
    { label: "Projetos Ativos", value: "8", icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Oportunidades", value: "12", icon: Search, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Ganhos Mensais", value: "R$ 4.250", icon: Banknote, color: "text-green-500", bg: "bg-green-50" },
    { label: "Avaliação", value: "4.9", icon: Star, color: "text-primary", bg: "bg-primary/10" },
  ];

  const opportunities = [
    { id: 1, title: "Gestão de Tráfego - Loja de Roupas", client: "Moda Fashion", budget: "R$ 800/mês", deadline: "3 meses", location: "Remoto" },
    { id: 2, title: "Criação de Identidade Visual", client: "Tech Solutions", budget: "R$ 2.500", deadline: "20 dias", location: "Remoto" },
    { id: 3, title: "Contabilidade Mensal MPE", client: "Café Central", budget: "R$ 450/mês", deadline: "Indeterminado", location: "São Paulo, SP" },
  ];

  return (
    <PartnerLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Painel do Parceiro</h1>
            <p className="text-slate-500">Acompanhe seu desempenho e novas oportunidades de negócio.</p>
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
              {opportunities.map((opp) => (
                <Card key={opp.id} className="border-slate-200 hover:border-primary/50 transition-all cursor-pointer group">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{opp.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span className="font-semibold text-slate-700">{opp.client}</span>
                          <span className="text-slate-300">•</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {opp.location}</span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{opp.budget}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1"><Clock size={12} /> Prazo: {opp.deadline}</div>
                      <div className="flex items-center gap-1"><Star size={12} className="text-amber-500" /> Requisito: Top Partner</div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-end">
                    <Button size="sm" className="gap-2 bg-slate-100 text-slate-900 hover:bg-primary hover:text-white transition-all">
                      Tenho Interesse <ArrowUpRight size={14} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Banknote size={20} className="text-slate-400" /> Resumo Financeiro
            </h2>
            <Card className="border-slate-200 shadow-xl overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <p className="text-slate-400 text-sm mb-1">Saldo Disponível</p>
                <h3 className="text-3xl font-bold">R$ 1.842,50</h3>
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-bold border-none shadow-lg">
                  Solicitar Saque
                </Button>
              </div>
              <CardContent className="p-6 bg-white">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <div className="text-sm">
                      <p className="font-semibold">Próximo Payout</p>
                      <p className="text-xs text-slate-400">15 Set 2023</p>
                    </div>
                    <div className="text-right font-bold">R$ 450,00</div>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <div className="text-sm">
                      <p className="font-semibold">Comissão Plataforma</p>
                      <p className="text-xs text-slate-400">Agosto 2023</p>
                    </div>
                    <div className="text-right font-bold text-red-500">- R$ 125,00</div>
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