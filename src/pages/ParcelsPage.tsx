
import React, { useState } from 'react';
import { Plus, Search, Filter, Grid, List, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/layout/PageLayout';
import PoolCard from '@/components/pools/PoolCard';
import PoolForm from '@/components/pools/PoolForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { usePools, PoolProject } from '@/hooks/use-pools';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const ParcelsPage = () => {
  const navigate = useNavigate();
  const { pools, loading, addPool, updatePool, deletePool } = usePools();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPool, setEditingPool] = useState<PoolProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { t } = useLanguage();

  const filteredPools = pools.filter(pool => {
    const matchesSearch = pool.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pool.endereco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pool.email_cliente?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || pool.status === statusFilter;
    const matchesType = typeFilter === 'all' || pool.tipo_piscina === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddPool = () => {
    setEditingPool(null);
    setIsFormOpen(true);
  };

  const handleEditPool = (pool: PoolProject) => {
    setEditingPool(pool);
    setIsFormOpen(true);
  };

  const handleDeletePool = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      await deletePool(id);
    }
  };

  const handleSubmitPool = async (data: Omit<PoolProject, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingPool) {
      await updatePool(editingPool.id, data);
    } else {
      await addPool(data);
    }
    setIsFormOpen(false);
    setEditingPool(null);
  };

  const handleViewDetails = (pool: PoolProject) => {
    navigate(`/parcelles/${pool.id}`);
  };

  const getStatusCount = (status: string) => {
    return pools.filter(pool => pool.status === status).length;
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingSpinner message="Carregando projetos de piscinas..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projetos de Piscinas</h1>
            <p className="text-gray-600 mt-1">
              Gerencie todos os seus projetos de piscinas
            </p>
          </div>
          <Button onClick={handleAddPool} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-800">{getStatusCount('orcamento')}</div>
            <div className="text-sm text-yellow-600 mt-1">Orçamentos</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-800">{getStatusCount('aprovado')}</div>
            <div className="text-sm text-blue-600 mt-1">Aprovados</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-800">{getStatusCount('em_construcao')}</div>
            <div className="text-sm text-orange-600 mt-1">Em Construção</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-800">{getStatusCount('finalizado')}</div>
            <div className="text-sm text-green-600 mt-1">Finalizados</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-800">{getStatusCount('cancelado')}</div>
            <div className="text-sm text-red-600 mt-1">Cancelados</div>
          </div>
        </div>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="orcamento">Orçamento</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="em_construcao">Em Construção</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Tipos</SelectItem>
                <SelectItem value="pequena">Pequena</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="grande">Grande</SelectItem>
                <SelectItem value="olimpica">Olímpica</SelectItem>
                <SelectItem value="infantil">Infantil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {filteredPools.length} projeto{filteredPools.length !== 1 ? 's' : ''} encontrado{filteredPools.length !== 1 ? 's' : ''}
          </div>
          {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
            >
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Content */}
        {filteredPools.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredPools.map((pool) => (
              <PoolCard
                key={pool.id}
                pool={pool}
                onEdit={handleEditPool}
                onDelete={handleDeletePool}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Nenhum projeto encontrado' 
                : 'Nenhum projeto cadastrado'
              }
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Tente ajustar os filtros de busca para encontrar o que procura'
                : 'Comece criando seu primeiro projeto de piscina para começar a gerenciar seu negócio'
              }
            </p>
            {(!searchTerm && statusFilter === 'all' && typeFilter === 'all') && (
              <Button onClick={handleAddPool} className="bg-blue-600 hover:bg-blue-700" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Criar Primeiro Projeto
              </Button>
            )}
          </div>
        )}

        {/* Form Modal */}
        <PoolForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingPool(null);
          }}
          onSubmit={handleSubmitPool}
          initialData={editingPool || undefined}
          title={editingPool ? 'Editar Projeto' : 'Novo Projeto de Piscina'}
        />
      </div>
    </PageLayout>
  );
};

export default ParcelsPage;
