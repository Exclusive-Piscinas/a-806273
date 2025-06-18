
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InventoryItem {
  id: string;
  nome: string;
  categoria: string;
  subcategoria?: string;
  codigo_produto?: string;
  quantidade: number;
  quantidade_minima: number;
  unidade: string;
  preco_unitario: number;
  fornecedor?: string;
  localizacao?: string;
  data_validade?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

const validateInventoryItem = (item: Partial<InventoryItem>): string | null => {
  if (!item.nome || item.nome.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
  if (!item.categoria || item.categoria.trim().length < 2) return 'Categoria deve ser informada';
  if (item.quantidade !== undefined && (item.quantidade < 0 || isNaN(item.quantidade))) return 'Quantidade deve ser um número válido';
  if (item.quantidade_minima !== undefined && (item.quantidade_minima < 0 || isNaN(item.quantidade_minima))) return 'Quantidade mínima deve ser um número válido';
  if (item.preco_unitario !== undefined && (item.preco_unitario < 0 || isNaN(item.preco_unitario))) return 'Preço deve ser um número válido';
  return null;
};

const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('estoque_piscinas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
      toast.error('Erro ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const validationError = validateInventoryItem(item);
      if (validationError) {
        toast.error(validationError);
        throw new Error(validationError);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const sanitizedItem = {
        ...item,
        nome: sanitizeString(item.nome),
        categoria: sanitizeString(item.categoria),
        subcategoria: item.subcategoria ? sanitizeString(item.subcategoria) : null,
        codigo_produto: item.codigo_produto ? sanitizeString(item.codigo_produto) : null,
        fornecedor: item.fornecedor ? sanitizeString(item.fornecedor) : null,
        localizacao: item.localizacao ? sanitizeString(item.localizacao) : null,
        observacoes: item.observacoes ? sanitizeString(item.observacoes) : null,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('estoque_piscinas')
        .insert(sanitizedItem)
        .select()
        .single();

      if (error) throw error;

      setInventory(prev => [data, ...prev]);
      toast.success('Item adicionado ao estoque!');
      return data;
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      if (error instanceof Error && !error.message.includes('deve')) {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
      throw error;
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const validationError = validateInventoryItem(updates);
      if (validationError) {
        toast.error(validationError);
        throw new Error(validationError);
      }

      const sanitizedUpdates = { ...updates };
      if (updates.nome) sanitizedUpdates.nome = sanitizeString(updates.nome);
      if (updates.categoria) sanitizedUpdates.categoria = sanitizeString(updates.categoria);
      if (updates.subcategoria) sanitizedUpdates.subcategoria = sanitizeString(updates.subcategoria);
      if (updates.codigo_produto) sanitizedUpdates.codigo_produto = sanitizeString(updates.codigo_produto);
      if (updates.fornecedor) sanitizedUpdates.fornecedor = sanitizeString(updates.fornecedor);
      if (updates.localizacao) sanitizedUpdates.localizacao = sanitizeString(updates.localizacao);
      if (updates.observacoes) sanitizedUpdates.observacoes = sanitizeString(updates.observacoes);

      const { data, error } = await supabase
        .from('estoque_piscinas')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setInventory(prev => prev.map(item => item.id === id ? data : item));
      toast.success('Item atualizado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      if (error instanceof Error && !error.message.includes('deve')) {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
      throw error;
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('estoque_piscinas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInventory(prev => prev.filter(item => item.id !== id));
      toast.success('Item removido do estoque!');
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast.error('Erro interno. Tente novamente mais tarde.');
      throw error;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    loading,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    refetch: fetchInventory
  };
};
