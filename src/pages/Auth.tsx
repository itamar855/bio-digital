import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Rocket, Briefcase, ShieldCheck, ArrowRight } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (role: 'mpe' | 'partner' | 'admin') => {
    // Mock login logic
    if (role === 'mpe') navigate('/mpe');
    else if (role === 'partner') navigate('/partner');
    else if (role === 'admin') navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Rocket size={32} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Ecossistema Digital</h1>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
            A solução completa para <span className="text-primary">Micro e Pequenas Empresas</span>
          </h2>
          <p className="text-lg text-slate-600">
            Conectamos negócios a especialistas, automatizamos sua presença digital e impulsionamos seu crescimento.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <Briefcase className="text-primary mb-2" />
              <h3 className="font-semibold text-sm">Marketplace</h3>
              <p className="text-xs text-slate-500 text-balance">Contrate especialistas em marketing, design e contabilidade.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <Rocket className="text-primary mb-2" />
              <h3 className="font-semibold text-sm">IA Website</h3>
              <p className="text-xs text-slate-500 text-balance">Crie seu site profissional em minutos com inteligência artificial.</p>
            </div>
          </div>
        </div>

        <Card className="shadow-xl border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {isRegistering ? "Criar conta" : "Bem-vindo de volta"}
            </CardTitle>
            <CardDescription>
              {isRegistering 
                ? "Escolha seu perfil e comece sua jornada hoje." 
                : "Entre com suas credenciais para acessar sua conta."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="mpe" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="mpe">MPE (Cliente)</TabsTrigger>
                <TabsTrigger value="partner">Parceiro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mpe" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-mpe">E-mail</Label>
                  <Input id="email-mpe" placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass-mpe">Senha</Label>
                  <Input id="pass-mpe" type="password" />
                </div>
                <Button className="w-full" onClick={() => handleLogin('mpe')}>
                  Entrar como MPE <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </TabsContent>

              <TabsContent value="partner" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-partner">E-mail Profissional</Label>
                  <Input id="email-partner" placeholder="seu@trabalho.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pass-partner">Senha</Label>
                  <Input id="pass-partner" type="password" />
                </div>
                <Button className="w-full bg-slate-900" onClick={() => handleLogin('partner')}>
                  Entrar como Parceiro <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-slate-500">
              {isRegistering ? "Já tem uma conta?" : "Ainda não tem conta?"}
              <Button 
                variant="link" 
                className="p-1 font-semibold text-primary"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? "Faça login" : "Cadastre-se"}
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck size={12} />
              Ambiente seguro e criptografado
            </div>
            {/* Secret Admin Entry for demo */}
            <div className="opacity-0 hover:opacity-10 transition-opacity">
              <Button variant="ghost" size="sm" className="text-[10px]" onClick={() => handleLogin('admin')}>
                Admin Access
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;