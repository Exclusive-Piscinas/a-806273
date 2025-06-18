
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Document {
  id: string;
  nome: string;
  tipo: 'contrato' | 'fatura' | 'relatorio';
  descricao?: string;
  caminho_arquivo?: string;
  tamanho_arquivo?: string;
  status: 'ativo' | 'pendente' | 'arquivado';
  cliente_id?: string;
  projeto_id?: string;
  created_at: string;
  updated_at: string;
}

// Input validation functions
const validateDocumentName = (nome: string): boolean => {
  return nome.trim().length >= 3 && nome.trim().length <= 255;
};

const validateDocumentType = (tipo: string): boolean => {
  return ['contrato', 'fatura', 'relatorio'].includes(tipo);
};

const validateDocumentStatus = (status: string): boolean => {
  return ['ativo', 'pendente', 'arquivado'].includes(status);
};

const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // Mock data for now - will be replaced with actual Supabase query
      const mockDocuments: Document[] = [
        {
          id: '1',
          nome: 'Contrato - Piscina Residencial Silva',
          tipo: 'contrato',
          status: 'ativo',
          tamanho_arquivo: '2.3 MB',
          created_at: '2024-01-15T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z',
        },
        {
          id: '2',
          nome: 'Fatura #2024-001',
          tipo: 'fatura',
          status: 'pendente',
          tamanho_arquivo: '1.2 MB',
          created_at: '2024-01-14T00:00:00Z',
          updated_at: '2024-01-14T00:00:00Z',
        },
        {
          id: '3',
          nome: 'Relatório Mensal - Janeiro 2024',
          tipo: 'relatorio',
          status: 'ativo',
          tamanho_arquivo: '5.1 MB',
          created_at: '2024-01-13T00:00:00Z',
          updated_at: '2024-01-13T00:00:00Z',
        }
      ];
      
      setDocuments(mockDocuments);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      toast.error('Erro ao carregar documentos');
    } finally {
      setLoading(false);
    }
  };

  const addDocument = async (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Input validation
      if (!validateDocumentName(document.nome)) {
        toast.error('Nome do documento deve ter entre 3 e 255 caracteres');
        throw new Error('Nome inválido');
      }

      if (!validateDocumentType(document.tipo)) {
        toast.error('Tipo de documento inválido');
        throw new Error('Tipo inválido');
      }

      if (!validateDocumentStatus(document.status)) {
        toast.error('Status do documento inválido');
        throw new Error('Status inválido');
      }

      // Sanitize inputs
      const sanitizedDocument = {
        ...document,
        nome: sanitizeString(document.nome),
        descricao: document.descricao ? sanitizeString(document.descricao) : undefined,
      };

      // For now, using mock implementation
      const newDoc: Document = {
        ...sanitizedDocument,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setDocuments(prev => [newDoc, ...prev]);
      toast.success('Documento adicionado com sucesso!');
      return newDoc;
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
      if (error instanceof Error && error.message !== 'Nome inválido' && error.message !== 'Tipo inválido' && error.message !== 'Status inválido') {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
      throw error;
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      // Validate ID
      if (!id || id.trim().length === 0) {
        toast.error('ID do documento inválido');
        throw new Error('ID inválido');
      }

      // Validate updates if they exist
      if (updates.nome !== undefined && !validateDocumentName(updates.nome)) {
        toast.error('Nome do documento deve ter entre 3 e 255 caracteres');
        throw new Error('Nome inválido');
      }

      if (updates.tipo !== undefined && !validateDocumentType(updates.tipo)) {
        toast.error('Tipo de documento inválido');
        throw new Error('Tipo inválido');
      }

      if (updates.status !== undefined && !validateDocumentStatus(updates.status)) {
        toast.error('Status do documento inválido');
        throw new Error('Status inválido');
      }

      // Sanitize string fields in updates
      const sanitizedUpdates = { ...updates };
      if (updates.nome) {
        sanitizedUpdates.nome = sanitizeString(updates.nome);
      }
      if (updates.descricao) {
        sanitizedUpdates.descricao = sanitizeString(updates.descricao);
      }

      setDocuments(prev => prev.map(doc => 
        doc.id === id ? { ...doc, ...sanitizedUpdates, updated_at: new Date().toISOString() } : doc
      ));
      toast.success('Documento atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      if (error instanceof Error && !['ID inválido', 'Nome inválido', 'Tipo inválido', 'Status inválido'].includes(error.message)) {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      // Validate ID
      if (!id || id.trim().length === 0) {
        toast.error('ID do documento inválido');
        throw new Error('ID inválido');
      }

      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Documento removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover documento:', error);
      if (error instanceof Error && error.message !== 'ID inválido') {
        toast.error('Erro interno. Tente novamente mais tarde.');
      }
      throw error;
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    addDocument,
    updateDocument,
    deleteDocument,
    refetch: fetchDocuments
  };
};
