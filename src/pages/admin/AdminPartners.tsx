import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCheck, Star, Banknote, Loader2, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

type Partner = {
  id: string;
  full_name: string;
  created_at: string;
  partner_details: {
    active_projects: number;
    monthly_earnings: number;
    rating: number;
    available_balance: number;
    approval_status: string;
  } | null;
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pendente", color: "bg-amber-50 text-amber-600 border-amber-200", icon: Clock },
  approved: { label: "Aprovado", color: "bg-green-50 text-green-600 border-green-200", icon: CheckCircle },
  rejected: { label: "Rejeitado", color: "bg-red-50 text-red-600 border-red-200", icon: XCircle },
};

export function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => { fetchPartners(); }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, created_at, partner_details(active_projects, monthly_earnings, rating, available_balance, approval_status)")
        .eq("role", "partner")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPartners((data as any) || []);
    } catch {
      toast.error("Erro ao carregar parceiros");
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("partner_details")
      .update({ approval_status: status })
      .eq("user_id", userId);

    if (error) { toast.error("Erro ao atualizar status"); return; }
    toast.success(status === "approved" ? "Parceiro aprovado!" : "Parceiro rejeitado.");
    fetchPartners();
  };

  const filtered = partners.filter(p => {
    const matchSearch = p.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.partner_details?.approval_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pending = partners.filter(p => p.partner_details?.approval_status === "pending").length;
  const approved = partners.filter(p => p.partner_details?.approval_status === "approved").length;

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Gestão de Parceiros</h1>
        <p className="text-slate-500 mt-1">Aprove e gerencie os parceiros do ecossistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl"><UserCheck className="text-blue-500" /></div>
            <div><p className="text-sm text-slate-500">Total Parceiros</p><p className="text-2xl font-bold">{partners.length}</p></div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-xl"><Clock className="text-amber-500" /></div>
            <div><p className="text-sm text-slate-500">Pendentes</p><p className="text-2xl font-bold">{pending}</p></div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-xl"><CheckCircle className="text-green-500" /></div>
            <div><p className="text-sm text-slate-500">Aprovados</p><p className="text-2xl font-bold">{approved}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input placeholder="Buscar parceiro..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {["all", "pending", "approved", "rejected"].map(s => (
                <Button
                  key={s}
                  size="sm"
                  variant={statusFilter === s ? "default" : "outline"}
                  onClick={() => setStatusFilter(s)}
                  className="text-xs"
                >
                  {s === "all" ? "Todos" : statusConfig[s]?.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <div className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">Nenhum parceiro encontrado.</div>
          ) : filtered.map(partner => {
            const status = partner.partner_details?.approval_status || "pending";
            const cfg = statusConfig[status] || statusConfig.pending;
            const StatusIcon = cfg.icon;
            return (
              <div key={partner.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 uppercase">
                    {partner.full_name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{partner.full_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${cfg.color}`}>
                        <StatusIcon size={10} /> {cfg.label}
                      </span>
                      {partner.partner_details?.rating ? (
                        <span className="flex items-center gap-1 text-xs text-amber-500">
                          <Star size={10} fill="currentColor" /> {partner.partner_details.rating}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:block text-right">
                    <p className="font-semibold text-slate-900">R$ {partner.partner_details?.monthly_earnings?.toLocaleString() || 0}</p>
                    <p className="text-xs text-slate-400">Ganhos/mês</p>
                  </div>
                  <div className="flex gap-2">
                    {status === "pending" && (
                      <>
                        <Button size="sm" className="bg-green-600 text-xs h-8" onClick={() => handleApproval(partner.id, "approved")}>Aprovar</Button>
                        <Button size="sm" variant="outline" className="text-xs h-8 text-red-500 border-red-200 hover:bg-red-50" onClick={() => handleApproval(partner.id, "rejected")}>Rejeitar</Button>
                      </>
                    )}
                    {status !== "pending" && (
                      <Button size="sm" variant="outline" className="text-xs h-8"><Eye size={12} className="mr-1" />Ver</Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
