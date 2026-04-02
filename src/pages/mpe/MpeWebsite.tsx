import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, MessageSquare, Smartphone, Zap } from "lucide-react";

export function MpeWebsite() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Presença Digital</h1>
        <p className="text-slate-500 mt-1">Gerencie seu website, domínio e integrações.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe className="text-primary" /> Seu Website Principal</CardTitle>
            <CardDescription>O cartão de visitas do seu negócio online.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary" className="bg-white/90 hover:bg-white text-black font-semibold">Editar no Construtor</Button>
              </div>
              <Globe size={48} className="text-slate-300 dark:text-slate-600" />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Dominio Personalizado</Button>
              <Button variant="outline" className="flex-1">SEO Config</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><MessageSquare className="text-green-500" /> WhatsApp Business</CardTitle>
              <CardDescription>Atendimento automatizado integrado ao site.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 rounded-lg">
                <span className="text-green-700 dark:text-green-400 font-medium text-sm">Status: Conectado</span>
                <Button size="sm" variant="outline" className="h-8 border-green-200 text-green-700">Configurar Bot</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2"><Zap className="text-amber-500" /> Landing Pages de Alta Conversão</CardTitle>
              <CardDescription>Crie páginas de vendas rápidas com IA.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white gap-2">Nova Landing Page</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
