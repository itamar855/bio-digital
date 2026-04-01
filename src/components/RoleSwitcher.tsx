import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Users, UserCircle, ShieldCheck, ChevronDown } from "lucide-react";

export function RoleSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Don't show on auth page
  if (location.pathname === '/auth' || location.pathname === '/') return null;

  const roles = [
    { label: "MPE (Cliente)", icon: Users, url: "/mpe" },
    { label: "Parceiro", icon: UserCircle, url: "/partner" },
    { label: "Administrador", icon: ShieldCheck, url: "/admin" },
  ];

  const currentRole = roles.find(r => location.pathname.startsWith(r.url)) || roles[0];

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="shadow-2xl bg-white/90 backdrop-blur-md border-primary/20 hover:bg-white text-slate-700 gap-2 h-12 px-5 rounded-full ring-4 ring-primary/5">
            <currentRole.icon className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Visualizar como: {currentRole.label}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 mb-2" align="start">
          <div className="text-[10px] font-bold uppercase text-slate-400 px-3 py-2 tracking-widest">Alternar Perfil</div>
          <div className="space-y-1">
            {roles.map((role) => (
              <Button 
                key={role.url} 
                variant="ghost" 
                className={`w-full justify-start gap-3 h-11 px-3 rounded-lg ${location.pathname.startsWith(role.url) ? 'bg-primary/5 text-primary' : 'text-slate-600'}`}
                onClick={() => {
                  navigate(role.url);
                  setOpen(false);
                }}
              >
                <role.icon className="h-4 w-4" />
                <span className="font-medium text-sm">{role.label}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}