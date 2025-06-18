
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Client {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  cep?: string;
  tipo_cliente: 'pessoa_fisica' | 'pessoa_juridica';
  documento?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

// Validation functions
const validateEmail = (email: string): boolean => {
  if (!email) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  if (!phone) return true; // Phone is optional
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clientes_piscinas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Validation
      if (!client.nome || client.nome.trim().length < 2) {
        toast.error('Nome deve ter pelo menos 2 caracteres');
        throw new Error('Nome inválido');
      }

      if (client.email && !validateEmail(client.email)) {
        toast.error('Email inválido');
        throw new Error('Email inválido');
      }

      if (client.telefone && !validatePhone(client.telefone)) {
        toast.error('Telefone inválido');
        throw new Error('Telefone inválido');
      }

      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Sanitize inputs
      const sanitizedClient = {
        ...client,
        nome: sanitizeString(client.nome),
        email: client.email ? sanitizeString(client.email) : null,
        telefone: client.telefone ? sanitizeString(client.telefone) : null,
        endereco: client.endereco ? sanitizeString(client.endereco) : null,
        cidade: client.cidade ? sanitizeString(client.cidade) : null,
        documento: client.documento ? sanitizeString(client.documento) : null,
        observacoes: client.observacoes ? sanitizeString(client.observacoes) : null,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('clientes_piscinas')
        .insert(sanitizedClient)
        .select()
        .single();

      if (error) throw error;

      setClients(prev => [data, ...prev]);
      toast.success('Cliente adicionado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      if (error instanceof Error && !['Nome inválido', 'Email inválido', 'Telefone inválido'].includes(error.message)) {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
      throw error;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      // Validation
      if (updates.nome && updates.nome.trim().length < 2) {
        toast.error('Nome deve ter pelo menos 2 caracteres');
        throw new Error('Nome inválido');
      }

      if (updates.email && !validateEmail(updates.email)) {
        toast.error('Email inválido');
        throw new Error('Email inválido');
      }

      if (updates.telefone && !validatePhone(updates.telefone)) {
        toast.error('Telefone inválido');
        throw new Error('Telefone inválido');
      }

      // Sanitize string fields
      const sanitizedUpdates = { ...updates };
      if (updates.nome) sanitizedUpdates.nome = sanitizeString(updates.nome);
      if (updates.email) sanitizedUpdates.email = sanitizeString(updates.email);
      if (updates.telefone) sanitizedUpdates.telefone = sanitizeString(updates.telefone);
      if (updates.endereco) sanitizedUpdates.endereco = sanitizeString(updates.endereco);
      if (updates.cidade) sanitizedUpdates.cidade = sanitizeString(updates.cidade);
      if (updates.documento) sanitizedUpdates.documento = sanitizeString(updates.documento);
      if (updates.observacoes) sanitizedUpdates.observacoes = sanitizeString(updates.observacoes);

      const { data, error } = await supabase
        .from('clientes_piscinas')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClients(prev => prev.map(client => client.id === id ? data : client));
      toast.success('Cliente atualizado com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      if (error instanceof Error && !['Nome inválido', 'Email inválido', 'Telefone inválido'].includes(error.message)) {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clientes_piscinas')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Cliente removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      toast.error('Erro interno. Tente novamente mais tarde.');
      throw error;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
};
