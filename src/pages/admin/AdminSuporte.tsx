import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, MessageSquare, AlertTriangle, CheckCircle, Clock, Loader2, Eye, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/lib/database.types";

type Ticket = Database['public']['Tables']['support_tickets']['Row'] & {
  profiles?: { full_name: string } | null;
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  open: { label: "Aberto", color: "bg-blue-50 text-blue-600 border-blue-200", icon: MessageSquare },
  in_progress: { label: "Em Andamento", color: "bg-amber-50 text-amber-600 border-amber-200", icon: Clock },
  resolved: { label: "Resolvido", color: "bg-green-50 text-green-600 border-green-200", icon: CheckCircle },
  closed: { label: "Fechado", color: "bg-slate-50 text-slate-500 border-slate-200", icon: XCircle },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Baixa", color: "text-slate-400" },
  normal: { label: "Normal", color: "text-blue-500" },
  high: { label: "Alta", color: "text-amber-500" },
  urgent: { label: "Urgente", color: "text-red-500" },
};

export function AdminSuporte() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*, profiles(full_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setTickets((data as Ticket[]) || []);
    } catch { toast.error("Erro ao carregar tickets"); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("support_tickets")
      .update({ status })
      .eq("id", id);
    if (error) { toast.error("Erro ao atualizar"); return; }
    toast.success("Status atualizado!");
    setSelectedTicket(null);
    fetchTickets();
  };

  const filtered = tickets.filter(t => {
    const matchSearch = t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.profiles?.full_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCount = tickets.filter(t => t.status === "open").length;
  const urgentCount = tickets.filter(t => t.priority === "urgent").length;
  const inProgressCount = tickets.filter(t => t.status === "in_progress").length;

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Suporte</h1>
        <p className="text-slate-500 mt-1">Gerencie os tickets de suporte dos usuários.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl"><MessageSquare className="text-blue-500" size={18} /></div>
            <div><p className="text-xs text-slate-500">Total</p><p className="text-xl font-bold">{tickets.length}</p></div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="bg-green-50 p-2.5 rounded-xl"><Clock className="text-green-500" size={18} /></div>
            <div><p className="text-xs text-slate-500">Abertos</p><p className="text-xl font-bold">{openCount}</p></div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="bg-amber-50 p-2.5 rounded-xl"><Clock className="text-amber-500" size={18} /></div>
            <div><p className="text-xs text-slate-500">Em Andamento</p><p className="text-xl font-bold">{inProgressCount}</p></div>
          </CardContent>
        </Card>
        <Card className="border-red-100 bg-red-50/30">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="bg-red-100 p-2.5 rounded-xl"><AlertTriangle className="text-red-500" size={18} /></div>
            <div><p className="text-xs text-red-400">Urgentes</p><p className="text-xl font-bold text-red-600">{urgentCount}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input placeholder="Buscar por assunto ou usuário..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "open", "in_progress", "resolved", "closed"].map(s => (
                <Button key={s} size="sm" variant={statusFilter === s ? "default" : "outline"} onClick={() => setStatusFilter(s)} className="text-xs">
                  {s === "all" ? "Todos" : statusConfig[s]?.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquare className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-400">Nenhum ticket encontrado.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map(ticket => {
                const sCfg = statusConfig[ticket.status || "open"] || statusConfig.open;
                const pCfg = priorityConfig[ticket.priority || "normal"] || priorityConfig.normal;
                const StatusIcon = sCfg.icon;
                return (
                  <div key={ticket.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center ${ticket.priority === "urgent" ? "bg-red-100" : "bg-slate-100"}`}>
                        {ticket.priority === "urgent" ? <AlertTriangle className="text-red-500" size={16} /> : <MessageSquare className="text-slate-400" size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{ticket.subject}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-400">{ticket.profiles?.full_name || "Anônimo"}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${sCfg.color}`}>
                            <StatusIcon size={9} /> {sCfg.label}
                          </span>
                          <span className={`text-[10px] font-bold ${pCfg.color}`}>{pCfg.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 hidden md:block">
                        {new Date(ticket.created_at || "").toLocaleDateString("pt-BR")}
                      </span>
                      <Button size="sm" variant="outline" className="text-xs h-8 gap-1" onClick={() => setSelectedTicket(ticket)}>
                        <Eye size={12} /> Gerenciar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ticket de Suporte</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-slate-400">Assunto</Label>
                <p className="font-semibold">{selectedTicket.subject}</p>
              </div>
              <div>
                <Label className="text-xs text-slate-400">Usuário</Label>
                <p>{selectedTicket.profiles?.full_name || "Anônimo"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-slate-400">Status</Label>
                  <p className="capitalize">{statusConfig[selectedTicket.status || "open"]?.label}</p>
                </div>
                <div>
                  <Label className="text-xs text-slate-400">Prioridade</Label>
                  <p className={`capitalize font-semibold ${priorityConfig[selectedTicket.priority || "normal"]?.color}`}>
                    {priorityConfig[selectedTicket.priority || "normal"]?.label}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-slate-400 mb-2 block">Alterar Status</Label>
                <div className="flex gap-2 flex-wrap">
                  {["open", "in_progress", "resolved", "closed"].map(s => (
                    <Button
                      key={s}
                      size="sm"
                      variant={selectedTicket.status === s ? "default" : "outline"}
                      className="text-xs"
                      onClick={() => updateStatus(selectedTicket.id, s)}
                    >
                      {statusConfig[s]?.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
