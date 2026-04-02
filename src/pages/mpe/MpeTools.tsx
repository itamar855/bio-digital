import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, ExternalLink, Calendar, Calculator, Mail } from "lucide-react";

export function MpeTools() {
  const tools = [
    { title: "Gestão Financeira Simplificada", icon: Calculator, desc: "Acesse nossa planilha interativa para controle de fluxo de caixa." },
    { title: "Calendário de Marketing", icon: Calendar, desc: "Planeje suas postagens nas redes sociais para os próximos 30 dias." },
    { title: "Gerador de Assinaturas", icon: Mail, desc: "Crie uma assinatura de email profissional com a sua marca." },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <Settings className="text-primary" /> Minhas Ferramentas
        </h1>
        <p className="text-slate-500 mt-1">Recursos gratuitos disponibilizados pelo ecossistema para acelerar seu negócio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, i) => (
          <Card key={i} className="border-slate-200">
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <tool.icon className="text-primary" size={24} />
              </div>
              <CardTitle className="text-xl">{tool.title}</CardTitle>
              <CardDescription>{tool.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full gap-2">Acessar Ferramenta <ExternalLink size={16} /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
