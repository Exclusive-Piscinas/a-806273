
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Package, AlertTriangle, Search } from 'lucide-react';
import { useInventory, InventoryItem } from '@/hooks/use-inventory';
import { toast } from 'sonner';

const Inventory = () => {
  const { inventory, loading, lowStockItems, totalValue, addItem, updateItem, deleteItem } = useInventory();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    subcategoria: '',
    codigo_produto: '',
    quantidade: '',
    quantidade_minima: '',
    unidade: 'unidade',
    preco_unitario: '',
    fornecedor: '',
    localizacao: '',
    data_validade: '',
    observacoes: ''
  });

  const categories = useMemo(() => {
    const cats = inventory.map(item => item.categoria);
    return ['all', ...Array.from(new Set(cats))];
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.codigo_produto && item.codigo_produto.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || item.categoria === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchTerm, categoryFilter]);

  const resetForm = () => {
    setFormData({
      nome: '',
      categoria: '',
      subcategoria: '',
      codigo_produto: '',
      quantidade: '',
      quantidade_minima: '',
      unidade: 'unidade',
      preco_unitario: '',
      fornecedor: '',
      localizacao: '',
      data_validade: '',
      observacoes: ''
    });
    setIsEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.categoria || !formData.quantidade || !formData.preco_unitario) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const itemData = {
        ...formData,
        quantidade: parseInt(formData.quantidade),
        quantidade_minima: parseInt(formData.quantidade_minima || '1'),
        preco_unitario: parseFloat(formData.preco_unitario),
        data_validade: formData.data_validade || undefined
      };

      if (isEditing) {
        await updateItem(isEditing, itemData);
      } else {
        await addItem(itemData);
      }
      
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      nome: item.nome,
      categoria: item.categoria,
      subcategoria: item.subcategoria || '',
      codigo_produto: item.codigo_produto || '',
      quantidade: item.quantidade.toString(),
      quantidade_minima: item.quantidade_minima.toString(),
      unidade: item.unidade,
      preco_unitario: item.preco_unitario.toString(),
      fornecedor: item.fornecedor || '',
      localizacao: item.localizacao || '',
      data_validade: item.data_validade || '',
      observacoes: item.observacoes || ''
    });
    setIsEditing(item.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Erro ao excluir item:', error);
      }
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantidade === 0) return { label: 'Sem estoque', color: 'bg-red-100 text-red-800' };
    if (item.quantidade <= item.quantidade_minima) return { label: 'Estoque baixo', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Em estoque', color: 'bg-green-100 text-green-800' };
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
      {/* Alertas de Estoque */}
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 mb-3">
              {lowStockItems.length} itens com estoque baixo ou zerado
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {lowStockItems.slice(0, 4).map(item => (
                <div key={item.id} className="text-sm text-yellow-800">
                  • {item.nome} ({item.quantidade} {item.unidade})
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Itens</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold">R$ {totalValue.toLocaleString('pt-BR')}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estoque Baixo</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isEditing ? 'Editar Item' : 'Novo Item'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome do produto"
                  required
                />
              </div>

              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Input
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  placeholder="Ex: Químicos, Equipamentos"
                  required
                />
              </div>

              <div>
                <Label htmlFor="codigo_produto">Código do Produto</Label>
                <Input
                  id="codigo_produto"
                  value={formData.codigo_produto}
                  onChange={(e) => setFormData({ ...formData, codigo_produto: e.target.value })}
                  placeholder="Código interno"
                />
              </div>

              <div>
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <Label htmlFor="quantidade_minima">Quantidade Mínima</Label>
                <Input
                  id="quantidade_minima"
                  type="number"
                  value={formData.quantidade_minima}
                  onChange={(e) => setFormData({ ...formData, quantidade_minima: e.target.value })}
                  placeholder="1"
                />
              </div>

              <div>
                <Label htmlFor="unidade">Unidade</Label>
                <Select value={formData.unidade} onValueChange={(value) => setFormData({ ...formData, unidade: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidade">Unidade</SelectItem>
                    <SelectItem value="kg">Kg</SelectItem>
                    <SelectItem value="litro">Litro</SelectItem>
                    <SelectItem value="metro">Metro</SelectItem>
                    <SelectItem value="caixa">Caixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="preco_unitario">Preço Unitário (R$) *</Label>
                <Input
                  id="preco_unitario"
                  type="number"
                  step="0.01"
                  value={formData.preco_unitario}
                  onChange={(e) => setFormData({ ...formData, preco_unitario: e.target.value })}
                  placeholder="0,00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input
                  id="fornecedor"
                  value={formData.fornecedor}
                  onChange={(e) => setFormData({ ...formData, fornecedor: e.target.value })}
                  placeholder="Nome do fornecedor"
                />
              </div>

              <div>
                <Label htmlFor="localizacao">Localização</Label>
                <Input
                  id="localizacao"
                  value={formData.localizacao}
                  onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                  placeholder="Ex: Estoque A1"
                />
              </div>

              <div>
                <Label htmlFor="data_validade">Data de Validade</Label>
                <Input
                  id="data_validade"
                  type="date"
                  value={formData.data_validade}
                  onChange={(e) => setFormData({ ...formData, data_validade: e.target.value })}
                />
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
                {isEditing ? 'Atualizar' : 'Adicionar'} Item
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

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome, categoria ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'Todas as categorias' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filteredInventory.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {inventory.length === 0 ? 'Nenhum item no estoque.' : 'Nenhum item encontrado com os filtros aplicados.'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {inventory.length === 0 ? 'Adicione seu primeiro item acima.' : 'Tente alterar os filtros de busca.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item);
                return (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{item.nome}</h4>
                        <p className="text-sm text-gray-600">{item.categoria}</p>
                        {item.codigo_produto && (
                          <p className="text-xs text-gray-500">Código: {item.codigo_produto}</p>
                        )}
                      </div>
                      <Badge className={stockStatus.color}>
                        {stockStatus.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Quantidade:</span>
                        <span className="font-medium">{item.quantidade} {item.unidade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Preço unitário:</span>
                        <span className="font-medium">R$ {item.preco_unitario.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor total:</span>
                        <span className="font-medium">R$ {(item.quantidade * item.preco_unitario).toLocaleString('pt-BR')}</span>
                      </div>
                      {item.fornecedor && (
                        <div className="flex justify-between">
                          <span>Fornecedor:</span>
                          <span className="font-medium">{item.fornecedor}</span>
                        </div>
                      )}
                      {item.localizacao && (
                        <div className="flex justify-between">
                          <span>Localização:</span>
                          <span className="font-medium">{item.localizacao}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} className="flex-1">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
