import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, Lock } from "lucide-react";

export function MpeAcademy() {
  const modules = [
    { title: "Fundamentos do E-commerce", aulas: 5, progress: 100, locked: false },
    { title: "Dominando as Redes Sociais", aulas: 8, progress: 30, locked: false },
    { title: "Tráfego Pago para MPEs", aulas: 12, progress: 0, locked: true },
    { title: "Gestão Empreendedora", aulas: 6, progress: 0, locked: true },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <BookOpen className="text-primary" /> Minha Academia
        </h1>
        <p className="text-slate-500 mt-1">Materiais exclusivos e trilhas de capacitação para você evoluir.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <PlayCircle size={120} />
          </div>
          <CardHeader>
            <CardDescription className="text-slate-400">Continue de onde parou</CardDescription>
            <CardTitle className="text-2xl">Módulo 2: Como montar um planejamento de conteúdo</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2 border-0">
              <PlayCircle size={20} /> Assistir Aula 3
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Trilhas Disponíveis</h3>
          {modules.map((mod, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${mod.locked ? "bg-slate-50 dark:bg-slate-900 border-slate-100 opacity-70" : "bg-white dark:bg-slate-800 border-slate-200 shadow-sm"}`}>
              <div className="flex items-center gap-3">
                {mod.locked ? (
                  <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-full"><Lock size={16} className="text-slate-500" /></div>
                ) : (
                  <div className="bg-primary/10 p-2 rounded-full"><PlayCircle size={16} className="text-primary" /></div>
                )}
                <div>
                  <h4 className={`font-semibold ${mod.locked ? "text-slate-500" : "text-slate-900 dark:text-slate-100"}`}>{mod.title}</h4>
                  <p className="text-xs text-slate-500">{mod.aulas} aulas</p>
                </div>
              </div>
              {!mod.locked && (
                <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {mod.progress}% Concluído
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
