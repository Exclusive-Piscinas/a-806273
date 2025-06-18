
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, DollarSign } from 'lucide-react';
import { useFinancial, FinancialTransaction } from '@/hooks/use-financial';
import { toast } from 'sonner';

const FinancialTracking = () => {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useFinancial();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    tipo: 'receita' as 'receita' | 'despesa',
    categoria: '',
    descricao: '',
    valor: '',
    data_transacao: new Date().toISOString().split('T')[0],
    forma_pagamento: '',
    status: 'pendente' as 'pendente' | 'pago' | 'cancelado',
    observacoes: ''
  });

  const resetForm = () => {
    setFormData({
      tipo: 'receita',
      categoria: '',
      descricao: '',
      valor: '',
      data_transacao: new Date().toISOString().split('T')[0],
      forma_pagamento: '',
      status: 'pendente',
      observacoes: ''
    });
    setIsEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.categoria || !formData.valor) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const transactionData = {
        ...formData,
        valor: parseFloat(formData.valor)
      };

      if (isEditing) {
        await updateTransaction(isEditing, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
    }
  };

  const handleEdit = (transaction: FinancialTransaction) => {
    setFormData({
      tipo: transaction.tipo,
      categoria: transaction.categoria,
      descricao: transaction.descricao,
      valor: transaction.valor.toString(),
      data_transacao: transaction.data_transacao,
      forma_pagamento: transaction.forma_pagamento || '',
      status: transaction.status,
      observacoes: transaction.observacoes || ''
    });
    setIsEditing(transaction.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error('Erro ao excluir transação:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    return tipo === 'receita' ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {isEditing ? 'Editar Transação' : 'Nova Transação'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipo">Tipo *</Label>
                <Select value={formData.tipo} onValueChange={(value: 'receita' | 'despesa') => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Input
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  placeholder="Ex: Vendas, Materiais, etc."
                  required
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição *</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição da transação"
                  required
                />
              </div>

              <div>
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0,00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="data_transacao">Data da Transação</Label>
                <Input
                  id="data_transacao"
                  type="date"
                  value={formData.data_transacao}
                  onChange={(e) => setFormData({ ...formData, data_transacao: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
                <Input
                  id="forma_pagamento"
                  value={formData.forma_pagamento}
                  onChange={(e) => setFormData({ ...formData, forma_pagamento: e.target.value })}
                  placeholder="Ex: Dinheiro, PIX, Cartão"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'pendente' | 'pago' | 'cancelado') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Adicionar'} Transação
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma transação encontrada.</p>
              <p className="text-sm text-gray-400 mt-2">Adicione sua primeira transação acima.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-medium ${getTipoColor(transaction.tipo)}`}>
                          {transaction.tipo === 'receita' ? '+' : '-'} R$ {transaction.valor.toLocaleString('pt-BR')}
                        </span>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium">{transaction.descricao}</h4>
                      <p className="text-sm text-gray-600">{transaction.categoria}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(transaction.data_transacao).toLocaleDateString('pt-BR')}
                        {transaction.forma_pagamento && ` • ${transaction.forma_pagamento}`}
                      </p>
                      {transaction.observacoes && (
                        <p className="text-xs text-gray-500 mt-1">{transaction.observacoes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(transaction)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(transaction.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialTracking;
