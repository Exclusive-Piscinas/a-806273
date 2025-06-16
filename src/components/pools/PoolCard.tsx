
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, MapPin, Phone, Mail, Calendar, DollarSign, User, Waves } from 'lucide-react';
import { PoolProject } from '@/hooks/use-pools';

interface PoolCardProps {
  pool: PoolProject;
  onEdit: (pool: PoolProject) => void;
  onDelete: (id: string) => void;
  onViewDetails: (pool: PoolProject) => void;
}

const statusColors = {
  orcamento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  aprovado: 'bg-blue-100 text-blue-800 border-blue-200',
  em_construcao: 'bg-orange-100 text-orange-800 border-orange-200',
  finalizado: 'bg-green-100 text-green-800 border-green-200',
  cancelado: 'bg-red-100 text-red-800 border-red-200'
};

const statusLabels = {
  orcamento: 'Orçamento',
  aprovado: 'Aprovado',
  em_construcao: 'Em Construção',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado'
};

const poolTypeLabels = {
  pequena: 'Pequena',
  media: 'Média',
  grande: 'Grande',
  olimpica: 'Olímpica',
  infantil: 'Infantil'
};

const PoolCard: React.FC<PoolCardProps> = ({ pool, onEdit, onDelete, onViewDetails }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              {pool.nome_cliente}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${statusColors[pool.status]}`}>
                {statusLabels[pool.status]}
              </Badge>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Waves className="h-3 w-3" />
                {poolTypeLabels[pool.tipo_piscina]}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(pool)}>
                Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(pool)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(pool.id)}
                className="text-red-600"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {pool.endereco && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{pool.endereco}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            {pool.telefone_cliente && (
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span className="truncate">{pool.telefone_cliente}</span>
              </div>
            )}
            
            {pool.email_cliente && (
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="truncate">{pool.email_cliente}</span>
              </div>
            )}
          </div>

          {pool.tamanho_metros && (
            <div className="text-sm text-gray-600">
              <strong>Tamanho:</strong> {pool.tamanho_metros}
              {pool.profundidade && ` • Profundidade: ${pool.profundidade}m`}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            {pool.orcamento_total && (
              <div className="flex items-center gap-1 text-green-600 font-semibold">
                <DollarSign className="h-4 w-4" />
                R$ {pool.orcamento_total.toLocaleString('pt-BR')}
              </div>
            )}
            
            {pool.data_previsao_fim && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                {new Date(pool.data_previsao_fim).toLocaleDateString('pt-BR')}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoolCard;
