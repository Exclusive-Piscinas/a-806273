
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PoolProject {
  id: string;
  nome_cliente: string;
  email_cliente?: string;
  telefone_cliente?: string;
  endereco?: string;
  tipo_piscina: 'pequena' | 'media' | 'grande' | 'olimpica' | 'infantil';
  tamanho_metros?: string;
  profundidade?: number;
  orcamento_total?: number;
  status: 'orcamento' | 'aprovado' | 'em_construcao' | 'finalizado' | 'cancelado';
  data_inicio?: string;
  data_previsao_fim?: string;
  data_finalizacao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export const usePools = () => {
  const [pools, setPools] = useState<PoolProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPools = async () => {
    try {
      const { data, error } = await supabase
        .from('projetos_piscinas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPools((data || []) as PoolProject[]);
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      toast.error('Erro ao carregar projetos de piscinas');
    } finally {
      setLoading(false);
    }
  };

  const addPool = async (pool: Omit<PoolProject, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('projetos_piscinas')
        .insert({
          ...pool,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setPools(prev => [data as PoolProject, ...prev]);
      toast.success('Projeto de piscina criado com sucesso!');
      return data as PoolProject;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      toast.error('Erro ao criar projeto de piscina');
      throw error;
    }
  };

  const updatePool = async (id: string, updates: Partial<PoolProject>) => {
    try {
      const { data, error } = await supabase
        .from('projetos_piscinas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setPools(prev => prev.map(pool => pool.id === id ? data as PoolProject : pool));
      toast.success('Projeto atualizado com sucesso!');
      return data as PoolProject;
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      toast.error('Erro ao atualizar projeto');
      throw error;
    }
  };

  const deletePool = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projetos_piscinas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPools(prev => prev.filter(pool => pool.id !== id));
      toast.success('Projeto excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir projeto:', error);
      toast.error('Erro ao excluir projeto');
      throw error;
    }
  };

  useEffect(() => {
    fetchPools();
  }, []);

  return {
    pools,
    loading,
    addPool,
    updatePool,
    deletePool,
    refetch: fetchPools
  };
};
