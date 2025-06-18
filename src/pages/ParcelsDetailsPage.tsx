
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, MapPin, DollarSign, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PageLayout from '@/components/layout/PageLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PoolForm from '@/components/pools/PoolForm';
import { usePools, PoolProject } from '@/hooks/use-pools';

const ParcelsDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pools, updatePool, loading } = usePools();
  const [pool, setPool] = useState<PoolProject | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (pools.length > 0 && id) {
      const foundPool = pools.find(p => p.id === id);
      setPool(foundPool || null);
    }
  }, [pools, id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'orcamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'aprovado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'em_construcao':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'finalizado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'orcamento': return 'Orçamento';
      case 'aprovado': return 'Aprovado';
      case 'em_construcao': return 'Em Construção';
      case 'finalizado': return 'Finalizado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pequena': return 'Pequena';
      case 'media': return 'Média';
      case 'grande': return 'Grande';
      case 'olimpica': return 'Olímpica';
      case 'infantil': return 'Infantil';
      default: return type;
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não definida';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleUpdatePool = async (data: Omit<PoolProject, 'id' | 'created_at' | 'updated_at'>) => {
    if (!pool) return;
    
    const updated = await updatePool(pool.id, data);
    setPool(updated);
    setIsFormOpen(false);
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingSpinner message="Carregando detalhes do projeto..." />
      </PageLayout>
    );
  }

  if (!pool) {
    return (
      <PageLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Projeto não encontrado</h2>
          <p className="text-gray-600 mb-6">O projeto solicitado não existe ou foi removido.</p>
          <Button onClick={() => navigate('/parcelles')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Projetos
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/parcelles')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{pool.nome_cliente}</h1>
              <p className="text-gray-600">Detalhes do projeto de piscina</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(pool.status)}>
              {getStatusLabel(pool.status)}
            </Badge>
            <Button onClick={() => setIsFormOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <p className="text-gray-900">{pool.nome_cliente}</p>
              </div>
              
              {pool.email_cliente && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-gray-900">{pool.email_cliente}</p>
                  </div>
                </div>
              )}
              
              {pool.telefone_cliente && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Telefone</label>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <p className="text-gray-900">{pool.telefone_cliente}</p>
                  </div>
                </div>
              )}
              
              {pool.endereco && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Endereço</label>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                    <p className="text-gray-900">{pool.endereco}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Projeto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo da Piscina</label>
                <p className="text-gray-900">{getTypeLabel(pool.tipo_piscina)}</p>
              </div>
              
              {pool.tamanho_metros && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Tamanho</label>
                  <p className="text-gray-900">{pool.tamanho_metros}</p>
                </div>
              )}
              
              {pool.profundidade && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Profundidade</label>
                  <p className="text-gray-900">{pool.profundidade}m</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500">Orçamento Total</label>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                  <p className="text-gray-900 font-semibold">{formatCurrency(pool.orcamento_total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Cronograma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pool.data_inicio && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Início</label>
                  <p className="text-gray-900">{formatDate(pool.data_inicio)}</p>
                </div>
              )}
              
              {pool.data_previsao_fim && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Previsão de Conclusão</label>
                  <p className="text-gray-900">{formatDate(pool.data_previsao_fim)}</p>
                </div>
              )}
              
              {pool.data_finalizacao && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Finalização</label>
                  <p className="text-gray-900">{formatDate(pool.data_finalizacao)}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-500">Criado em</label>
                <p className="text-gray-900">{formatDate(pool.created_at)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Última atualização</label>
                <p className="text-gray-900">{formatDate(pool.updated_at)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Observations */}
        {pool.observacoes && (
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900 whitespace-pre-wrap">{pool.observacoes}</p>
            </CardContent>
          </Card>
        )}

        {/* Edit Form */}
        <PoolForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleUpdatePool}
          initialData={pool}
          title="Editar Projeto"
        />
      </div>
    </PageLayout>
  );
};

export default ParcelsDetailsPage;
