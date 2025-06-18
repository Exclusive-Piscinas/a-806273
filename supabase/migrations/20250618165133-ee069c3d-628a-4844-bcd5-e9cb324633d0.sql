
-- Enable RLS on all main tables
ALTER TABLE public.projetos_piscinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes_piscinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque_piscinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financeiro_piscinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for projetos_piscinas
CREATE POLICY "Users can view own pool projects" ON public.projetos_piscinas
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own pool projects" ON public.projetos_piscinas
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pool projects" ON public.projetos_piscinas
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pool projects" ON public.projetos_piscinas
FOR DELETE USING (auth.uid() = user_id);

-- Policies for clientes_piscinas
CREATE POLICY "Users can view own clients" ON public.clientes_piscinas
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own clients" ON public.clientes_piscinas
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON public.clientes_piscinas
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON public.clientes_piscinas
FOR DELETE USING (auth.uid() = user_id);

-- Policies for estoque_piscinas
CREATE POLICY "Users can view own inventory" ON public.estoque_piscinas
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own inventory" ON public.estoque_piscinas
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inventory" ON public.estoque_piscinas
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inventory" ON public.estoque_piscinas
FOR DELETE USING (auth.uid() = user_id);

-- Policies for financeiro_piscinas
CREATE POLICY "Users can view own finances" ON public.financeiro_piscinas
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own finances" ON public.financeiro_piscinas
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own finances" ON public.financeiro_piscinas
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own finances" ON public.financeiro_piscinas
FOR DELETE USING (auth.uid() = user_id);

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Add updated_at triggers for all tables
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_projetos_piscinas_updated_at
    BEFORE UPDATE ON public.projetos_piscinas
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_clientes_piscinas_updated_at
    BEFORE UPDATE ON public.clientes_piscinas
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_estoque_piscinas_updated_at
    BEFORE UPDATE ON public.estoque_piscinas
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_financeiro_piscinas_updated_at
    BEFORE UPDATE ON public.financeiro_piscinas
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
