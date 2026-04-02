-- Criar enum de roles (ignora se já existir)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('mpe', 'partner', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Tabela de perfis
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT 'Usuário',
  role user_role NOT NULL DEFAULT 'mpe',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de detalhes MPE
CREATE TABLE IF NOT EXISTS public.mpe_details (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  company_name TEXT NOT NULL DEFAULT 'Minha Empresa',
  site_visits INTEGER DEFAULT 0,
  new_leads INTEGER DEFAULT 0,
  active_services_count INTEGER DEFAULT 0,
  journey_progress INTEGER DEFAULT 0,
  site_preview_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de detalhes Parceiro
CREATE TABLE IF NOT EXISTS public.partner_details (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  active_projects INTEGER DEFAULT 0,
  opportunities_count INTEGER DEFAULT 0,
  monthly_earnings DECIMAL DEFAULT 0,
  rating DECIMAL DEFAULT 0,
  available_balance DECIMAL DEFAULT 0,
  approval_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Oportunidades
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Remoto',
  price DECIMAL NOT NULL DEFAULT 0,
  duration TEXT NOT NULL DEFAULT '30 dias',
  requirement TEXT NOT NULL DEFAULT 'Top Partner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Tabela de Transações
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL NOT NULL DEFAULT 0,
  commission DECIMAL NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'payment',
  status TEXT DEFAULT 'pending',
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Tickets de Suporte
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Métricas Globais
CREATE TABLE IF NOT EXISTS public.global_metrics (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_mpes INTEGER DEFAULT 0,
  total_partners INTEGER DEFAULT 0,
  monthly_revenue DECIMAL DEFAULT 0,
  support_tickets_count INTEGER DEFAULT 0,
  urgent_tickets_count INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir linha inicial de métricas
INSERT INTO public.global_metrics (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Ativar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mpe_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_metrics ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas (para evitar conflito)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "MPEs can view own details" ON public.mpe_details;
DROP POLICY IF EXISTS "Admins can view all MPE details" ON public.mpe_details;
DROP POLICY IF EXISTS "MPEs can insert own details" ON public.mpe_details;
DROP POLICY IF EXISTS "Partners can view own details" ON public.partner_details;
DROP POLICY IF EXISTS "Admins can view all partner details" ON public.partner_details;
DROP POLICY IF EXISTS "Partners can insert own details" ON public.partner_details;
DROP POLICY IF EXISTS "Anyone can view opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Admins can manage opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Admins only access" ON public.global_metrics;

-- Políticas de profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Políticas de mpe_details
CREATE POLICY "MPEs can view own details" ON public.mpe_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "MPEs can insert own details" ON public.mpe_details FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all MPE details" ON public.mpe_details FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas de partner_details
CREATE POLICY "Partners can view own details" ON public.partner_details FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Partners can insert own details" ON public.partner_details FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all partner details" ON public.partner_details FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas de opportunities
CREATE POLICY "Anyone can view opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Admins can manage opportunities" ON public.opportunities FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas de transactions
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON public.transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas de support_tickets
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all tickets" ON public.support_tickets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Políticas de global_metrics
CREATE POLICY "Admins only access" ON public.global_metrics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Função trigger para criar perfil ao cadastrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Novo Usuário'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'mpe')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recriar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
