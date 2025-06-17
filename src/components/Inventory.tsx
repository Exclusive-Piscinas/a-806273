import React, { useState, useRef } from 'react';
import { DateRange } from 'react-day-picker';
import { Package, Plus, ArrowUp, ArrowDown, ChevronRight, X, Save, FileUp, FileDown, BarChart2, Trash2, Search, Filter } from 'lucide-react';
import { EditableTable, Column } from './ui/editable-table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { EditableField } from './ui/editable-field';
import ConfirmDialog from './inventory/ConfirmDialog';
import { exportInventoryToCSV, importInventoryFromCSV, exportInventoryToPDF, downloadInventoryTemplate } from './inventory/ImportExportFunctions';
import InventoryFilters from './inventory/InventoryFilters';
import InventoryStats from './inventory/InventoryStats';
import InventoryAlerts from './inventory/InventoryAlerts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useInventory, InventoryItem } from '@/hooks/use-inventory';

interface InventoryProps {
  dateRange?: DateRange;
  searchTerm?: string;
}

const Inventory: React.FC<InventoryProps> = ({
  dateRange,
  searchTerm: externalSearchTerm
}) => {
  const { items: inventoryData, loading, addItem, updateItem, deleteItem } = useInventory();
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm || '');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('nome');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    nome: '',
    categoria: 'quimicos' as const,
    quantidade: 0,
    unidade: '',
    quantidade_minima: 0,
    preco_unitario: 0,
    localizacao: '',
    observacoes: ''
  });
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [view, setView] = useState<'list' | 'detail' | 'stats'>('list');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateAlerts = () => {
    return inventoryData.filter(item => item.quantidade <= item.quantidade_minima).map(item => ({
      id: item.id,
      name: item.nome,
      current: item.quantidade,
      min: item.quantidade_minima,
      status: item.quantidade < item.quantidade_minima * 0.5 ? 'critical' as const : 'warning' as const
    }));
  };

  const alerts = generateAlerts();

  const filteredItems = inventoryData.filter(item => {
    const matchesSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.categoria.toLowerCase().includes(searchTerm.toLowerCase());
    if (categoryFilter === 'all') return matchesSearch;
    return matchesSearch && item.categoria === categoryFilter;
  }).sort((a, b) => {
    if (sortBy === 'nome') {
      return sortOrder === 'asc' ? a.nome.localeCompare(b.nome) : b.nome.localeCompare(a.nome);
    } else if (sortBy === 'quantidade') {
      return sortOrder === 'asc' ? a.quantidade - b.quantidade : b.quantidade - a.quantidade;
    } else if (sortBy === 'preco_unitario') {
      return sortOrder === 'asc' ? a.preco_unitario - b.preco_unitario : b.preco_unitario - a.preco_unitario;
    }
    return 0;
  });

  const categories = ['all', ...new Set(inventoryData.map(item => item.categoria))];

  const handleExportData = () => {
    if (view === 'list') {
      // Converter para formato compatível com a função de exportação
      const exportData = inventoryData.map(item => ({
        id: parseInt(item.id) || 0,
        name: item.nome,
        category: item.categoria,
        quantity: item.quantidade,
        unit: item.unidade,
        minQuantity: item.quantidade_minima,
        price: item.preco_unitario,
        location: item.localizacao || '',
        lastUpdated: item.updated_at,
        supplier: item.fornecedor || '',
        sku: item.codigo_produto || '',
        expiryDate: item.data_validade || '',
        notes: item.observacoes || ''
      }));
      exportInventoryToCSV(exportData);
    } else if (view === 'stats') {
      exportInventoryToPDF(inventoryData as any);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    importInventoryFromCSV(file, (importedData) => {
      // Converter dados importados para o formato correto
      importedData.forEach(async (item) => {
        try {
          await addItem({
            nome: item.name,
            categoria: 'materiais_construcao',
            quantidade: item.quantity,
            unidade: item.unit,
            quantidade_minima: item.minQuantity,
            preco_unitario: item.price,
            localizacao: item.location,
            observacoes: item.notes
          });
        } catch (error) {
          console.error('Erro ao importar item:', error);
        }
      });
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const confirmDeleteItem = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteItem = async () => {
    if (itemToDelete === null) return;
    
    try {
      await deleteItem(itemToDelete);
      if (selectedItem && selectedItem.id === itemToDelete) {
        setSelectedItem(null);
      }
    } catch (error) {
      // Erro já tratado no hook
    }
    
    setItemToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleAddItem = async () => {
    if (!newItem.nome || !newItem.categoria || !newItem.unidade) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await addItem(newItem);
      setShowAddForm(false);
      setNewItem({
        nome: '',
        categoria: 'quimicos',
        quantidade: 0,
        unidade: '',
        quantidade_minima: 0,
        preco_unitario: 0,
        localizacao: '',
        observacoes: ''
      });
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleUpdateItem = async (id: string, field: string, value: any) => {
    try {
      await updateItem(id, { [field]: value });
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem({ ...selectedItem, [field]: value });
      }
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleQuantityChange = async (itemId: string, field: string, value: any) => {
    await handleUpdateItem(itemId, field, value);
  };

  const inventoryColumns: Column[] = [
    {
      id: 'nome',
      header: 'Article',
      accessorKey: 'nome',
      isEditable: true
    },
    {
      id: 'categoria',
      header: 'Catégorie',
      accessorKey: 'categoria',
      isEditable: true
    },
    {
      id: 'quantidade',
      header: 'Quantité',
      accessorKey: 'quantidade',
      type: 'number',
      isEditable: true
    },
    {
      id: 'preco_unitario',
      header: 'Prix unitaire',
      accessorKey: 'preco_unitario',
      type: 'number',
      isEditable: true
    },
    {
      id: 'value',
      header: 'Valeur totale',
      accessorKey: 'value',
      type: 'text',
      isEditable: false
    },
    {
      id: 'status',
      header: 'Statut',
      accessorKey: 'status',
      type: 'text',
      isEditable: false
    }
  ];

  const tableData = filteredItems.map(item => ({
    ...item,
    value: `${(item.quantidade * item.preco_unitario).toFixed(2)} €`,
    status: item.quantidade <= item.quantidade_minima 
      ? item.quantidade < item.quantidade_minima * 0.5 ? 'critical' : 'warning' 
      : 'normal'
  }));

  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const item = filteredItems[rowIndex];
    if (!item) return;
    handleUpdateItem(item.id, columnId, value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="animate-enter">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Gestão de Estoque</h1>
          <p className="text-muted-foreground">Gerencie seu estoque de materiais para piscinas</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={view === 'list' ? 'default' : 'outline'} 
            onClick={() => setView('list')} 
            className="px-4 py-2"
          >
            Lista
          </Button>
          <Button 
            variant={view === 'stats' ? 'default' : 'outline'} 
            onClick={() => setView('stats')} 
            className="px-4 py-2"
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Estatísticas
          </Button>
          <Button variant="outline" onClick={handleExportData} className="px-4 py-2">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <div className="relative">
            <Button variant="outline" onClick={handleImportClick} className="px-4 py-2">
              <FileUp className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".csv" 
              className="hidden" 
            />
          </div>
          <Button onClick={() => setShowAddForm(true)} className="ml-2">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item
          </Button>
        </div>
      </header>

      <InventoryAlerts alerts={alerts} onQuantityChange={handleQuantityChange} />

      {view === 'list' ? (
        selectedItem ? (
          <div className="border rounded-xl overflow-hidden">
            <div className="bg-agri-primary text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <button onClick={() => setSelectedItem(null)} className="mr-3 hover:bg-white/10 p-1 rounded" aria-label="Retour à la liste">
                  <ChevronRight className="h-5 w-5 transform rotate-180" />
                </button>
                <EditableField value={selectedItem.nome} onSave={value => handleUpdateItem(selectedItem.id, 'nome', value)} className="text-xl font-semibold" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => {}} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-none">
                  <ArrowDown className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">Entrada</span>
                </Button>
                <Button onClick={() => {}} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-none">
                  <ArrowUp className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">Saída</span>
                </Button>
                <Button onClick={() => confirmDeleteItem(selectedItem.id)} variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-none">
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  <span className="hidden sm:inline">Excluir</span>
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Detalhes do Item</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Categoria:</span>
                      <EditableField value={selectedItem.categoria} onSave={value => handleUpdateItem(selectedItem.id, 'categoria', value)} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Quantidade:</span>
                      <div className="flex items-center">
                        <EditableField value={selectedItem.quantidade} type="number" onSave={value => handleUpdateItem(selectedItem.id, 'quantidade', Number(value))} className="font-medium" />
                        <EditableField value={selectedItem.unidade} onSave={value => handleUpdateItem(selectedItem.id, 'unidade', value)} className="ml-1" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Estoque Mínimo:</span>
                      <div className="flex items-center">
                        <EditableField value={selectedItem.quantidade_minima} type="number" onSave={value => handleUpdateItem(selectedItem.id, 'quantidade_minima', Number(value))} />
                        <span className="ml-1">{selectedItem.unidade}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Preço Unitário:</span>
                      <div className="flex items-center">
                        <EditableField value={selectedItem.preco_unitario} type="number" onSave={value => handleUpdateItem(selectedItem.id, 'preco_unitario', Number(value))} />
                        <span className="ml-1">R$</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Valor Total:</span>
                      <span className="font-medium">{(selectedItem.quantidade * selectedItem.preco_unitario).toFixed(2)} R$</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Localização:</span>
                      <EditableField value={selectedItem.localizacao} onSave={value => handleUpdateItem(selectedItem.id, 'localizacao', value)} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Última atualização:</span>
                      <span>{new Date(selectedItem.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="font-medium mb-3">Estatísticas</h3>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{ name: 'Estoque Atual', value: selectedItem.quantidade }, { name: 'Estoque Mínimo', value: selectedItem.quantidade_minima }]} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} ${selectedItem.unidade}`, '']} />
                        <Bar dataKey="value" fill="#4CAF50" radius={[4, 4, 0, 0]} fillOpacity={1} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Histórico de Transações</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">Data</th>
                        <th className="px-4 py-2 text-left">Tipo</th>
                        <th className="px-4 py-2 text-left">Quantidade</th>
                        <th className="px-4 py-2 text-left">Usuário</th>
                        <th className="px-4 py-2 text-left">Observações</th>
                        <th className="px-4 py-2 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={6} className="px-4 py-4 text-center text-muted-foreground">
                          Nenhuma transação registrada
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <InventoryFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder as (order: 'asc' | 'desc') => void}
              />
            </div>
            
            <EditableTable 
              data={tableData}
              columns={inventoryColumns}
              onUpdate={handleTableUpdate}
              onDelete={(rowIndex) => confirmDeleteItem(filteredItems[rowIndex].id)}
              actions={[{
                icon: <ChevronRight className="h-4 w-4" />,
                label: "Ver detalhes",
                onClick: (rowIndex) => setSelectedItem(filteredItems[rowIndex])
              }]}
              className="mb-6"
              sortable={true}
            />
            
            {showAddForm && (
              <div className="border rounded-xl p-6 bg-muted/5 animate-enter">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Adicionar novo item</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome do item*</Label>
                    <Input 
                      id="nome"
                      value={newItem.nome}
                      onChange={(e) => setNewItem({ ...newItem, nome: e.target.value })}
                      className="mt-1"
                      placeholder="Ex: Cloro granulado"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria*</Label>
                    <select 
                      id="categoria"
                      value={newItem.categoria}
                      onChange={(e) => setNewItem({ ...newItem, categoria: e.target.value as any })}
                      className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="quimicos">Químicos</option>
                      <option value="equipamentos">Equipamentos</option>
                      <option value="materiais_construcao">Materiais de Construção</option>
                      <option value="acessorios">Acessórios</option>
                      <option value="manutencao">Manutenção</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="quantidade">Quantidade inicial*</Label>
                    <div className="flex mt-1">
                      <Input 
                        id="quantidade"
                        type="number"
                        value={newItem.quantidade}
                        onChange={(e) => setNewItem({ ...newItem, quantidade: Number(e.target.value) })}
                        min={0}
                      />
                      <Input 
                        className="w-24 ml-2"
                        placeholder="Unidade"
                        value={newItem.unidade}
                        onChange={(e) => setNewItem({ ...newItem, unidade: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="quantidade_minima">Estoque mínimo</Label>
                    <Input 
                      id="quantidade_minima"
                      type="number"
                      value={newItem.quantidade_minima}
                      onChange={(e) => setNewItem({ ...newItem, quantidade_minima: Number(e.target.value) })}
                      className="mt-1"
                      min={0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="preco_unitario">Preço unitário (R$)</Label>
                    <Input 
                      id="preco_unitario"
                      type="number"
                      value={newItem.preco_unitario}
                      onChange={(e) => setNewItem({ ...newItem, preco_unitario: Number(e.target.value) })}
                      className="mt-1"
                      min={0}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label htmlFor="localizacao">Localização</Label>
                    <Input 
                      id="localizacao"
                      value={newItem.localizacao}
                      onChange={(e) => setNewItem({ ...newItem, localizacao: e.target.value })}
                      className="mt-1"
                      placeholder="Ex: Depósito A"
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label htmlFor="observacoes">Observações</Label>
                    <Textarea 
                      id="observacoes"
                      value={newItem.observacoes || ''}
                      onChange={(e) => setNewItem({ ...newItem, observacoes: e.target.value })}
                      className="mt-1"
                      placeholder="Informações adicionais sobre o item..."
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="mr-2">
                    Cancelar
                  </Button>
                  <Button onClick={handleAddItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Item
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <InventoryStats inventoryData={inventoryData} />
      )}

      <ConfirmDialog 
        open={deleteConfirmOpen}
        title="Excluir item"
        description="Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteItem}
        onOpenChange={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default Inventory;
