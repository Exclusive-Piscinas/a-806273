
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FinancialTransaction {
  id: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  descricao: string;
  valor: number;
  data_transacao: string;
  forma_pagamento?: string;
  status: 'pendente' | 'pago' | 'cancelado';
  projeto_id?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

const validateTransaction = (transaction: Partial<FinancialTransaction>): string | null => {
  if (!transaction.descricao || transaction.descricao.trim().length < 3) return 'Descrição deve ter pelo menos 3 caracteres';
  if (!transaction.categoria || transaction.categoria.trim().length < 2) return 'Categoria deve ser informada';
  if (!transaction.tipo || !['receita', 'despesa'].includes(transaction.tipo)) return 'Tipo deve ser receita ou despesa';
  if (transaction.valor !== undefined && (transaction.valor <= 0 || isNaN(transaction.valor))) return 'Valor deve ser maior que zero';
  if (!transaction.data_transacao) return 'Data da transação é obrigatória';
  return null;
};

const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const useFinancial = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Calculate totals using useMemo for performance
  const totalRevenue = useMemo(() => {
    return transactions
      .filter(t => t.tipo === 'receita' && t.status === 'pago')
      .reduce((sum, t) => sum + t.valor, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.tipo === 'despesa' && t.status === 'pago')
      .reduce((sum, t) => sum + t.valor, 0);
  }, [transactions]);

  const netProfit = useMemo(() => {
    return totalRevenue - totalExpenses;
  }, [totalRevenue, totalExpenses]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('financeiro_piscinas')
        .select('*')
        .order('data_transacao', { ascending: false });

      if (error) throw error;
      
      // Type assertion with validation
      const typedData = (data || []).map(item => ({
        ...item,
        tipo: (item.tipo === 'despesa' ? 'despesa' : 'receita') as 'receita' | 'despesa',
        status: (['pago', 'cancelado'].includes(item.status) ? item.status : 'pendente') as 'pendente' | 'pago' | 'cancelado'
      })) as FinancialTransaction[];
      
      setTransactions(typedData);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      toast.error('Erro ao carregar transações financeiras');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const validationError = validateTransaction(transaction);
      if (validationError) {
        toast.error(validationError);
        throw new Error(validationError);
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const sanitizedTransaction = {
        ...transaction,
        descricao: sanitizeString(transaction.descricao),
        categoria: sanitizeString(transaction.categoria),
        forma_pagamento: transaction.forma_pagamento ? sanitizeString(transaction.forma_pagamento) : null,
        observacoes: transaction.observacoes ? sanitizeString(transaction.observacoes) : null,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('financeiro_piscinas')
        .insert(sanitizedTransaction)
        .select()
        .single();

      if (error) throw error;

      const newTransaction = {
        ...data,
        tipo: (data.tipo === 'despesa' ? 'despesa' : 'receita') as 'receita' | 'despesa',
        status: (['pago', 'cancelado'].includes(data.status) ? data.status : 'pendente') as 'pendente' | 'pago' | 'cancelado'
      } as FinancialTransaction;

      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Transação adicionada com sucesso!');
      return newTransaction;
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      if (error instanceof Error && !error.message.includes('deve')) {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<FinancialTransaction>) => {
    try {
      const validationError = validateTransaction(updates);
      if (validationError && Object.keys(updates).length > 1) {
        toast.error(validationError);
        throw new Error(validationError);
      }

      const sanitizedUpdates = { ...updates };
      if (updates.descricao) sanitizedUpdates.descricao = sanitizeString(updates.descricao);
      if (updates.categoria) sanitizedUpdates.categoria = sanitizeString(updates.categoria);
      if (updates.forma_pagamento) sanitizedUpdates.forma_pagamento = sanitizeString(updates.forma_pagamento);
      if (updates.observacoes) sanitizedUpdates.observacoes = sanitizeString(updates.observacoes);

      const { data, error } = await supabase
        .from('financeiro_piscinas')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedTransaction = {
        ...data,
        tipo: (data.tipo === 'despesa' ? 'despesa' : 'receita') as 'receita' | 'despesa',
        status: (['pago', 'cancelado'].includes(data.status) ? data.status : 'pendente') as 'pendente' | 'pago' | 'cancelado'
      } as FinancialTransaction;

      setTransactions(prev => prev.map(transaction => transaction.id === id ? updatedTransaction : transaction));
      toast.success('Transação atualizada com sucesso!');
      return updatedTransaction;
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      if (error instanceof Error && !error.message.includes('deve')) {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
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

      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      toast.success('Transação removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover transação:', error);
      toast.error('Erro interno. Tente novamente mais tarde.');
      throw error;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    totalRevenue,
    totalExpenses,
    netProfit,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
};
