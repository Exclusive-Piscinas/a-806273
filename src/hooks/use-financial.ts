
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FinancialTransaction {
  id: string;
  projeto_id?: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  descricao: string;
  valor: number;
  data_transacao: string;
  forma_pagamento?: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix' | 'transferencia' | 'cheque';
  status: 'pendente' | 'pago' | 'cancelado';
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export const useFinancial = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('financeiro_piscinas')
        .select('*')
        .order('data_transacao', { ascending: false });

      if (error) throw error;
      setTransactions((data || []) as FinancialTransaction[]);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      toast.error('Erro ao carregar transações financeiras');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('financeiro_piscinas')
        .insert({
          ...transaction,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setTransactions(prev => [data as FinancialTransaction, ...prev]);
      toast.success('Transação criada com sucesso!');
      return data as FinancialTransaction;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      toast.error('Erro ao criar transação');
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<FinancialTransaction>) => {
    try {
      const { data, error } = await supabase
        .from('financeiro_piscinas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTransactions(prev => prev.map(tx => tx.id === id ? data as FinancialTransaction : tx));
      toast.success('Transação atualizada com sucesso!');
      return data as FinancialTransaction;
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast.error('Erro ao atualizar transação');
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financeiro_piscinas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      toast.success('Transação excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação');
      throw error;
    }
  };

  const getTotalRevenue = () => {
    return transactions
      .filter(tx => tx.tipo === 'receita' && tx.status === 'pago')
      .reduce((total, tx) => total + tx.valor, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(tx => tx.tipo === 'despesa' && tx.status === 'pago')
      .reduce((total, tx) => total + tx.valor, 0);
  };

  const getNetProfit = () => {
    return getTotalRevenue() - getTotalExpenses();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
    totalRevenue: getTotalRevenue(),
    totalExpenses: getTotalExpenses(),
    netProfit: getNetProfit()
  };
};
