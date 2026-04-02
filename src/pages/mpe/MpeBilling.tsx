import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, FileText, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MpeBilling() {
  const invoices = [
    { id: "FAT-0042", date: "01/Abr/2026", amount: "R$ 149,90", status: "Pago" },
    { id: "FAT-0038", date: "01/Mar/2026", amount: "R$ 149,90", status: "Pago" },
    { id: "FAT-0021", date: "01/Fev/2026", amount: "R$ 149,90", status: "Pago" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <CreditCard className="text-primary" /> Faturamento e Assinatura
        </h1>
        <p className="text-slate-500 mt-1">Gerencie seu plano, métodos de pagamento e visualize faturas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <CardTitle className="text-xl">Histórico de Faturas</CardTitle>
                <CardDescription>Suas últimas cobranças do ecossistema.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2"><Download size={14} /> Baixar Relatório</Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg"><FileText size={20} className="text-slate-500" /></div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{inv.id}</p>
                        <p className="text-sm text-slate-500">{inv.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-bold">{inv.amount}</span>
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        {inv.status}
                      </Badge>
                      <Button variant="ghost" size="icon"><Download size={16} className="text-slate-400" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-slate-200 bg-slate-50 dark:bg-slate-900 shadow-inner">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BadgeCheck className="text-primary" /> Plano Atual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Pro Business</h3>
                <p className="text-slate-500 text-sm mt-1">Renova em 01/Mai/2026</p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="text-sm text-slate-500 block mb-2">Método Principal</span>
                <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200">
                  <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold px-2 py-1 rounded">VISA</div>
                  <span className="font-medium text-sm">•••• 4242</span>
                </div>
              </div>
              <Button className="w-full" variant="outline">Alterar Plano</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
