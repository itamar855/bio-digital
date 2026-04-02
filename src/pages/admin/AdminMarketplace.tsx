import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Search, ShoppingBag, Plus, Trash2, MapPin, Clock, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/lib/database.types";

type Opportunity = Database['public']['Tables']['opportunities']['Row'];

export function AdminMarketplace() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", company_name: "", location: "Remoto",
    price: "", duration: "30 dias", requirement: "Top Partner"
  });

  useEffect(() => { fetchOpportunities(); }, []);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from("opportunities").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setOpportunities(data || []);
    } catch { toast.error("Erro ao carregar oportunidades"); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!form.title || !form.company_name || !form.price) {
      toast.error("Preencha todos os campos obrigatórios"); return;
    }
    const { error } = await supabase.from("opportunities").insert({
      title: form.title, company_name: form.company_name,
      location: form.location, price: parseFloat(form.price),
      duration: form.duration, requirement: form.requirement,
    });
    if (error) { toast.error("Erro ao criar oportunidade"); return; }
    toast.success("Oportunidade criada!");
    setOpen(false);
    setForm({ title: "", company_name: "", location: "Remoto", price: "", duration: "30 dias", requirement: "Top Partner" });
    fetchOpportunities();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("opportunities").delete().eq("id", id);
    if (error) { toast.error("Erro ao excluir"); return; }
    toast.success("Oportunidade removida.");
    fetchOpportunities();
  };

  const filtered = opportunities.filter(o =>
    o.title?.toLowerCase().includes(search.toLowerCase()) ||
    o.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Marketplace & Serviços</h1>
          <p className="text-slate-500 mt-1">Gerencie as oportunidades disponíveis para os parceiros.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus size={16} /> Nova Oportunidade</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Oportunidade</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              {[
                { label: "Título *", key: "title", placeholder: "Ex: Gestão de Tráfego" },
                { label: "Empresa *", key: "company_name", placeholder: "Ex: Loja de Roupas" },
                { label: "Localização", key: "location", placeholder: "Ex: Remoto" },
                { label: "Valor (R$) *", key: "price", placeholder: "Ex: 800", type: "number" },
                { label: "Prazo", key: "duration", placeholder: "Ex: 3 meses" },
                { label: "Requisito", key: "requirement", placeholder: "Ex: Top Partner" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-sm font-medium">{label}</Label>
                  <Input
                    type={type || "text"}
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreate}>Criar Oportunidade</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input placeholder="Buscar oportunidade..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <ShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-400 font-medium">Nenhuma oportunidade cadastrada.</p>
          <p className="text-slate-300 text-sm mt-1">Clique em "Nova Oportunidade" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(opp => (
            <Card key={opp.id} className="border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge className="bg-primary/10 text-primary border-none text-xs">
                    R$ {opp.price.toLocaleString()}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(opp.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{opp.title}</h3>
                <p className="text-sm font-medium text-slate-600 mb-3">{opp.company_name}</p>
                <div className="space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1"><MapPin size={10} /> {opp.location}</div>
                  <div className="flex items-center gap-1"><Clock size={10} /> {opp.duration}</div>
                  <div className="flex items-center gap-1"><Star size={10} /> {opp.requirement}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
