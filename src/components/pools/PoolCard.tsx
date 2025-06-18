
import React from 'react';
import { Edit, Trash2, Eye, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { PoolProject } from '@/hooks/use-pools';

interface PoolCardProps {
  pool: PoolProject;
  onEdit: (pool: PoolProject) => void;
  onDelete: (id: string) => void;
  onViewDetails: (pool: PoolProject) => void;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, onEdit, onDelete, onViewDetails }) => {
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

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {pool.nome_cliente}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{pool.endereco || 'Endereço não informado'}</span>
            </div>
          </div>
          <Badge className={getStatusColor(pool.status)}>
            {getStatusLabel(pool.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Tipo:</span>
            <p className="font-medium">{getTypeLabel(pool.tipo_piscina)}</p>
          </div>
          <div>
            <span className="text-gray-500">Tamanho:</span>
            <p className="font-medium">{pool.tamanho_metros || 'Não definido'}</p>
          </div>
          {pool.profundidade && (
            <div>
              <span className="text-gray-500">Profundidade:</span>
              <p className="font-medium">{pool.profundidade}m</p>
            </div>
          )}
          <div>
            <span className="text-gray-500">Orçamento:</span>
            <p className="font-medium text-green-600">{formatCurrency(pool.orcamento_total)}</p>
          </div>
        </div>

        {pool.data_inicio && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Início: {formatDate(pool.data_inicio)}</span>
          </div>
        )}

        {pool.email_cliente && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Email:</span> {pool.email_cliente}
          </div>
        )}

        {pool.telefone_cliente && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Telefone:</span> {pool.telefone_cliente}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-3">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(pool)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(pool)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(pool.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PoolCard;
