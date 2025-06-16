
-- Criar tabela de projetos de piscinas
CREATE TABLE public.projetos_piscinas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nome_cliente TEXT NOT NULL,
  email_cliente TEXT,
  telefone_cliente TEXT,
  endereco TEXT,
  tipo_piscina TEXT NOT NULL CHECK (tipo_piscina IN ('pequena', 'media', 'grande', 'olimpica', 'infantil')),
  tamanho_metros TEXT,
  profundidade DECIMAL(4,2),
  orcamento_total DECIMAL(12,2),
  status TEXT NOT NULL DEFAULT 'orcamento' CHECK (status IN ('orcamento', 'aprovado', 'em_construcao', 'finalizado', 'cancelado')),
  data_inicio DATE,
  data_previsao_fim DATE,
  data_finalizacao DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de estoque específico para piscinas
CREATE TABLE public.estoque_piscinas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('quimicos', 'equipamentos', 'materiais_construcao', 'acessorios', 'manutencao')),
  subcategoria TEXT,
  quantidade INTEGER NOT NULL DEFAULT 0,
  unidade TEXT NOT NULL DEFAULT 'unidade',
  quantidade_minima INTEGER NOT NULL DEFAULT 1,
  preco_unitario DECIMAL(10,2) NOT NULL DEFAULT 0,
  fornecedor TEXT,
  codigo_produto TEXT,
  localizacao TEXT,
  data_validade DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de transações financeiras
CREATE TABLE public.financeiro_piscinas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  projeto_id UUID REFERENCES public.projetos_piscinas,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor DECIMAL(12,2) NOT NULL,
  data_transacao DATE NOT NULL DEFAULT CURRENT_DATE,
  forma_pagamento TEXT CHECK (forma_pagamento IN ('dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'transferencia', 'cheque')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de clientes
CREATE TABLE public.clientes_piscinas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  cidade TEXT,
  cep TEXT,
  tipo_cliente TEXT DEFAULT 'pessoa_fisica' CHECK (tipo_cliente IN ('pessoa_fisica', 'pessoa_juridica')),
  documento TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.projetos_piscinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque_piscinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financeiro_piscinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes_piscinas ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para projetos_piscinas
CREATE POLICY "Usuários podem ver seus próprios projetos" 
  ON public.projetos_piscinas 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios projetos" 
  ON public.projetos_piscinas 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios projetos" 
  ON public.projetos_piscinas 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios projetos" 
  ON public.projetos_piscinas 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar políticas RLS para estoque_piscinas
CREATE POLICY "Usuários podem ver seu próprio estoque" 
  ON public.estoque_piscinas 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar itens no seu estoque" 
  ON public.estoque_piscinas 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio estoque" 
  ON public.estoque_piscinas 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar itens do seu estoque" 
  ON public.estoque_piscinas 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar políticas RLS para financeiro_piscinas
CREATE POLICY "Usuários podem ver suas próprias transações" 
  ON public.financeiro_piscinas 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias transações" 
  ON public.financeiro_piscinas 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias transações" 
  ON public.financeiro_piscinas 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias transações" 
  ON public.financeiro_piscinas 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar políticas RLS para clientes_piscinas
CREATE POLICY "Usuários podem ver seus próprios clientes" 
  ON public.clientes_piscinas 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios clientes" 
  ON public.clientes_piscinas 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios clientes" 
  ON public.clientes_piscinas 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios clientes" 
  ON public.clientes_piscinas 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_projetos_piscinas_updated_at BEFORE UPDATE ON public.projetos_piscinas 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_estoque_piscinas_updated_at BEFORE UPDATE ON public.estoque_piscinas 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financeiro_piscinas_updated_at BEFORE UPDATE ON public.financeiro_piscinas 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clientes_piscinas_updated_at BEFORE UPDATE ON public.clientes_piscinas 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
