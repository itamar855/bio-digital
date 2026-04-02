import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, TrendingUp, Globe, Loader2, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

type MpeUser = {
  id: string;
  full_name: string;
  created_at: string;
  mpe_details: {
    company_name: string;
    site_visits: number;
    new_leads: number;
    active_services_count: number;
    journey_progress: number;
  } | null;
};

export function AdminMpe() {
  const [users, setUsers] = useState<MpeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMpeUsers();
  }, []);

  const fetchMpeUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, created_at, mpe_details(company_name, site_visits, new_leads, active_services_count, journey_progress)")
        .eq("role", "mpe")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers((data as any) || []);
    } catch (err) {
      toast.error("Erro ao carregar MPEs");
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.mpe_details?.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalSiteVisits = users.reduce((acc, u) => acc + (u.mpe_details?.site_visits || 0), 0);
  const totalLeads = users.reduce((acc, u) => acc + (u.mpe_details?.new_leads || 0), 0);

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Gestão de MPEs</h1>
        <p className="text-slate-500 mt-1">Gerencie todos os clientes do ecossistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-xl"><Users className="text-blue-500" /></div>
            <div><p className="text-sm text-slate-500">Total de MPEs</p><p className="text-2xl font-bold">{users.length}</p></div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-xl"><TrendingUp className="text-green-500" /></div>
            <div><p className="text-sm text-slate-500">Total Visitas</p><p className="text-2xl font-bold">{totalSiteVisits.toLocaleString()}</p></div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-xl"><Globe className="text-purple-500" /></div>
            <div><p className="text-sm text-slate-500">Total Leads</p><p className="text-2xl font-bold">{totalLeads}</p></div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <Input
                placeholder="Buscar por nome ou empresa..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">Nenhum MPE cadastrado ainda.</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map(user => (
                <div key={user.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 uppercase">
                      {user.full_name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{user.full_name}</p>
                      <p className="text-sm text-slate-500">{user.mpe_details?.company_name || "Empresa não configurada"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-500">
                    <div className="text-center hidden md:block">
                      <p className="font-semibold text-slate-900">{user.mpe_details?.site_visits || 0}</p>
                      <p className="text-xs">Visitas</p>
                    </div>
                    <div className="text-center hidden md:block">
                      <p className="font-semibold text-slate-900">{user.mpe_details?.journey_progress || 0}%</p>
                      <p className="text-xs">Jornada</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs gap-1">
                        <Eye size={12} /> Ver
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
