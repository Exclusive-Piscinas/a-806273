
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface InventoryItem {
  id: string;
  nome: string;
  categoria: 'quimicos' | 'equipamentos' | 'materiais_construcao' | 'acessorios' | 'manutencao';
  subcategoria?: string;
  quantidade: number;
  unidade: string;
  quantidade_minima: number;
  preco_unitario: number;
  fornecedor?: string;
  codigo_produto?: string;
  localizacao?: string;
  data_validade?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('estoque_piscinas')
        .select('*')
        .order('nome');

      if (error) throw error;
      setItems((data || []) as InventoryItem[]);
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
      toast.error('Erro ao carregar estoque');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('estoque_piscinas')
        .insert({
          ...item,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setItems(prev => [...prev, data as InventoryItem]);
      toast.success('Item adicionado ao estoque!');
      return data as InventoryItem;
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast.error('Erro ao adicionar item ao estoque');
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const { data, error } = await supabase
        .from('estoque_piscinas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setItems(prev => prev.map(item => item.id === id ? data as InventoryItem : item));
      toast.success('Item atualizado com sucesso!');
      return data as InventoryItem;
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      toast.error('Erro ao atualizar item');
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('estoque_piscinas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Item removido do estoque!');
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast.error('Erro ao remover item');
      throw error;
    }
  };

  const getLowStockItems = () => {
    return items.filter(item => item.quantidade <= item.quantidade_minima);
  };

  const getTotalValue = () => {
    return items.reduce((total, item) => total + (item.quantidade * item.preco_unitario), 0);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    refetch: fetchItems,
    lowStockItems: getLowStockItems(),
    totalValue: getTotalValue()
  };
};
