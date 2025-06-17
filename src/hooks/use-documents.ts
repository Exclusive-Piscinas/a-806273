
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

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      // Como ainda não temos a tabela de documentos, vamos usar dados mock
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
      // Implementar quando a tabela de documentos for criada
      const newDoc: Document = {
        ...document,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setDocuments(prev => [newDoc, ...prev]);
      toast.success('Documento adicionado com sucesso!');
      return newDoc;
    } catch (error) {
      console.error('Erro ao adicionar documento:', error);
      toast.error('Erro ao adicionar documento');
      throw error;
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...updates, updated_at: new Date().toISOString() } : doc));
      toast.success('Documento atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar documento:', error);
      toast.error('Erro ao atualizar documento');
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      toast.success('Documento removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover documento:', error);
      toast.error('Erro ao remover documento');
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
