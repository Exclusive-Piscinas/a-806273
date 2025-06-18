
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

// Input validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const validateCEP = (cep: string): boolean => {
  const cepRegex = /^\d{5}-?\d{3}$/;
  return cepRegex.test(cep);
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 255;
};

const validateDocument = (documento: string, tipo: 'pessoa_fisica' | 'pessoa_juridica'): boolean => {
  if (!documento) return true; // Optional field
  
  if (tipo === 'pessoa_fisica') {
    // CPF validation (basic format check)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
    return cpfRegex.test(documento);
  } else {
    // CNPJ validation (basic format check)
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/;
    return cnpjRegex.test(documento);
  }
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
        .order('nome');

      if (error) throw error;
      setClients((data || []) as Client[]);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Input validation
      if (!validateName(client.nome)) {
        toast.error('Nome deve ter entre 2 e 255 caracteres');
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

      if (client.cep && !validateCEP(client.cep)) {
        toast.error('CEP inválido');
        throw new Error('CEP inválido');
      }

      if (client.documento && !validateDocument(client.documento, client.tipo_cliente)) {
        toast.error('Documento inválido para o tipo de cliente selecionado');
        throw new Error('Documento inválido');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // Sanitize string inputs
      const sanitizedClient = {
        ...client,
        nome: sanitizeString(client.nome),
        email: client.email ? sanitizeString(client.email) : undefined,
        endereco: client.endereco ? sanitizeString(client.endereco) : undefined,
        cidade: client.cidade ? sanitizeString(client.cidade) : undefined,
        observacoes: client.observacoes ? sanitizeString(client.observacoes) : undefined,
      };

      const { data, error } = await supabase
        .from('clientes_piscinas')
        .insert({
          ...sanitizedClient,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setClients(prev => [...prev, data as Client]);
      toast.success('Cliente adicionado com sucesso!');
      return data as Client;
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      if (error instanceof Error && !['Nome inválido', 'Email inválido', 'Telefone inválido', 'CEP inválido', 'Documento inválido'].includes(error.message)) {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
      throw error;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      // Validate inputs if they're being updated
      if (updates.nome !== undefined && !validateName(updates.nome)) {
        toast.error('Nome deve ter entre 2 e 255 caracteres');
        throw new Error('Nome inválido');
      }

      if (updates.email !== undefined && updates.email && !validateEmail(updates.email)) {
        toast.error('Email inválido');
        throw new Error('Email inválido');
      }

      if (updates.telefone !== undefined && updates.telefone && !validatePhone(updates.telefone)) {
        toast.error('Telefone inválido');
        throw new Error('Telefone inválido');
      }

      if (updates.cep !== undefined && updates.cep && !validateCEP(updates.cep)) {
        toast.error('CEP inválido');
        throw new Error('CEP inválido');
      }

      // Sanitize string fields
      const sanitizedUpdates = { ...updates };
      if (updates.nome) sanitizedUpdates.nome = sanitizeString(updates.nome);
      if (updates.email) sanitizedUpdates.email = sanitizeString(updates.email);
      if (updates.endereco) sanitizedUpdates.endereco = sanitizeString(updates.endereco);
      if (updates.cidade) sanitizedUpdates.cidade = sanitizeString(updates.cidade);
      if (updates.observacoes) sanitizedUpdates.observacoes = sanitizeString(updates.observacoes);

      const { data, error } = await supabase
        .from('clientes_piscinas')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setClients(prev => prev.map(client => client.id === id ? data as Client : client));
      toast.success('Cliente atualizado com sucesso!');
      return data as Client;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      if (error instanceof Error && !['Nome inválido', 'Email inválido', 'Telefone inválido', 'CEP inválido'].includes(error.message)) {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      if (!id || id.trim().length === 0) {
        toast.error('ID do cliente inválido');
        throw new Error('ID inválido');
      }

      const { error } = await supabase
        .from('clientes_piscinas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClients(prev => prev.filter(client => client.id !== id));
      toast.success('Cliente removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      if (error instanceof Error && error.message !== 'ID inválido') {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
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
