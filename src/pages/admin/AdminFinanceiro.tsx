import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Banknote, TrendingUp, ArrowDownRight, ArrowUpRight, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/lib/database.types";

type Transaction = Database['public']['Tables']['transactions']['Row'] & {
  profiles?: { full_name: string } | null;
};

export function AdminFinanceiro() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, commissions: 0, payouts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;

      const txs = (data as Transaction[]) || [];
      setTransactions(txs);

      const total = txs.reduce((acc, t) => acc + (t.amount || 0), 0);
      const commissions = txs.reduce((acc, t) => acc + (t.commission || 0), 0);
      const payouts = txs.filter(t => t.type === "payout").reduce((acc, t) => acc + (t.amount || 0), 0);
      setMetrics({ total, commissions, payouts });
    } catch { toast.error("Erro ao carregar transações"); }
    finally { setLoading(false); }
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-200",
    completed: "bg-green-50 text-green-600 border-green-200",
    failed: "bg-red-50 text-red-600 border-red-200",
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Financeiro</h1>
          <p className="text-slate-500 mt-1">Fluxo de caixa, comissões e payouts do ecossistema.</p>
        </div>
        <Button variant="outline" onClick={fetchData} className="gap-2">
          <RefreshCw size={14} /> Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardContent className="p-6">
            <p className="text-slate-400 text-sm mb-1">Total Transacionado</p>
            <p className="text-3xl font-bold">{formatCurrency(metrics.total)}</p>
            <div className="flex items-center gap-1 mt-2 text-green-400 text-xs font-semibold">
              <TrendingUp size={12} /> Mês vigente
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-50 p-2 rounded-lg"><ArrowDownRight className="text-green-500" size={18} /></div>
              <p className="text-sm text-slate-500">Comissões Retidas (15%)</p>
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics.commissions)}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-50 p-2 rounded-lg"><ArrowUpRight className="text-blue-500" size={18} /></div>
              <p className="text-sm text-slate-500">Payouts Processados</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(metrics.payouts)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {transactions.length === 0 ? (
            <div className="py-12 text-center">
              <Banknote className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-400">Nenhuma transação registrada ainda.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              <div className="grid grid-cols-5 px-6 py-3 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>Usuário</span>
                <span>Tipo</span>
                <span>Valor</span>
                <span>Comissão</span>
                <span>Status</span>
              </div>
              {transactions.map(tx => (
                <div key={tx.id} className="grid grid-cols-5 px-6 py-4 hover:bg-slate-50 transition-colors items-center text-sm">
                  <span className="font-medium text-slate-900">{tx.profiles?.full_name || "—"}</span>
                  <span className="capitalize text-slate-600">{tx.type === "payment" ? "Pagamento" : "Saque"}</span>
                  <span className="font-semibold">{formatCurrency(tx.amount)}</span>
                  <span className="text-green-600 font-medium">{formatCurrency(tx.commission)}</span>
                  <span>
                    <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold capitalize ${statusColors[tx.status || "pending"]}`}>
                      {tx.status === "pending" ? "Pendente" : tx.status === "completed" ? "Concluído" : "Falhou"}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
