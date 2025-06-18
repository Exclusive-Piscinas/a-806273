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

// Input validation functions
const validateAmount = (valor: number): boolean => {
  return typeof valor === 'number' && valor > 0 && valor <= 999999999.99;
};

const validateTransactionType = (tipo: string): boolean => {
  return ['receita', 'despesa'].includes(tipo);
};

const validatePaymentMethod = (forma_pagamento?: string): boolean => {
  if (!forma_pagamento) return true;
  return ['dinheiro', 'cartao_credito', 'cartao_debito', 'pix', 'transferencia', 'cheque'].includes(forma_pagamento);
};

const validateStatus = (status: string): boolean => {
  return ['pendente', 'pago', 'cancelado'].includes(status);
};

const validateDescription = (descricao: string): boolean => {
  return descricao.trim().length >= 3 && descricao.trim().length <= 500;
};

const validateCategory = (categoria: string): boolean => {
  return categoria.trim().length >= 2 && categoria.trim().length <= 100;
};

const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const useFinancial = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
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
      // Input validation
      if (!validateAmount(transaction.valor)) {
        toast.error('Valor deve ser um número positivo até R$ 999.999.999,99');
        throw new Error('Valor inválido');
      }

      if (!validateTransactionType(transaction.tipo)) {
        toast.error('Tipo de transação inválido');
        throw new Error('Tipo inválido');
      }

      if (!validateDescription(transaction.descricao)) {
        toast.error('Descrição deve ter entre 3 e 500 caracteres');
        throw new Error('Descrição inválida');
      }

      if (!validateCategory(transaction.categoria)) {
        toast.error('Categoria deve ter entre 2 e 100 caracteres');
        throw new Error('Categoria inválida');
      }

      if (!validatePaymentMethod(transaction.forma_pagamento)) {
        toast.error('Forma de pagamento inválida');
        throw new Error('Forma de pagamento inválida');
      }

      if (!validateStatus(transaction.status)) {
        toast.error('Status inválido');
        throw new Error('Status inválido');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Sanitize string inputs
      const sanitizedTransaction = {
        ...transaction,
        categoria: sanitizeString(transaction.categoria),
        descricao: sanitizeString(transaction.descricao),
        observacoes: transaction.observacoes ? sanitizeString(transaction.observacoes) : undefined,
      };

      const { data, error } = await supabase
        .from('financeiro_piscinas')
        .insert({
          ...sanitizedTransaction,
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
      if (error instanceof Error && !['Valor inválido', 'Tipo inválido', 'Descrição inválida', 'Categoria inválida', 'Forma de pagamento inválida', 'Status inválido'].includes(error.message)) {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<FinancialTransaction>) => {
    try {
      // Validate updates if they exist
      if (updates.valor !== undefined && !validateAmount(updates.valor)) {
        toast.error('Valor deve ser um número positivo até R$ 999.999.999,99');
        throw new Error('Valor inválido');
      }

      if (updates.tipo !== undefined && !validateTransactionType(updates.tipo)) {
        toast.error('Tipo de transação inválido');
        throw new Error('Tipo inválido');
      }

      if (updates.descricao !== undefined && !validateDescription(updates.descricao)) {
        toast.error('Descrição deve ter entre 3 e 500 caracteres');
        throw new Error('Descrição inválida');
      }

      if (updates.categoria !== undefined && !validateCategory(updates.categoria)) {
        toast.error('Categoria deve ter entre 2 e 100 caracteres');
        throw new Error('Categoria inválida');
      }

      if (updates.forma_pagamento !== undefined && !validatePaymentMethod(updates.forma_pagamento)) {
        toast.error('Forma de pagamento inválida');
        throw new Error('Forma de pagamento inválida');
      }

      if (updates.status !== undefined && !validateStatus(updates.status)) {
        toast.error('Status inválido');
        throw new Error('Status inválido');
      }

      // Sanitize string fields
      const sanitizedUpdates = { ...updates };
      if (updates.categoria) sanitizedUpdates.categoria = sanitizeString(updates.categoria);
      if (updates.descricao) sanitizedUpdates.descricao = sanitizeString(updates.descricao);
      if (updates.observacoes) sanitizedUpdates.observacoes = sanitizeString(updates.observacoes);

      const { data, error } = await supabase
        .from('financeiro_piscinas')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setTransactions(prev => prev.map(tx => tx.id === id ? data as FinancialTransaction : tx));
      toast.success('Transação atualizada com sucesso!');
      return data as FinancialTransaction;
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      if (error instanceof Error && !['Valor inválido', 'Tipo inválido', 'Descrição inválida', 'Categoria inválida', 'Forma de pagamento inválida', 'Status inválido'].includes(error.message)) {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      if (!id || id.trim().length === 0) {
        toast.error('ID da transação inválido');
        throw new Error('ID inválido');
      }

      const { error } = await supabase
        .from('financeiro_piscinas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTransactions(prev => prev.filter(tx => tx.id !== id));
      toast.success('Transação excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      if (error instanceof Error && error.message !== 'ID inválido') {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
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
