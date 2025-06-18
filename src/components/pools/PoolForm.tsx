
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PoolProject } from '@/hooks/use-pools';

interface PoolFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PoolProject, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: PoolProject;
  title: string;
}

const PoolForm: React.FC<PoolFormProps> = ({ isOpen, onClose, onSubmit, initialData, title }) => {
  const [formData, setFormData] = useState<Omit<PoolProject, 'id' | 'created_at' | 'updated_at'>>({
    nome_cliente: '',
    email_cliente: '',
    telefone_cliente: '',
    endereco: '',
    tipo_piscina: 'media',
    tamanho_metros: '',
    profundidade: 0,
    orcamento_total: 0,
    status: 'orcamento',
    data_inicio: '',
    data_previsao_fim: '',
    data_finalizacao: '',
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome_cliente: initialData.nome_cliente,
        email_cliente: initialData.email_cliente || '',
        telefone_cliente: initialData.telefone_cliente || '',
        endereco: initialData.endereco || '',
        tipo_piscina: initialData.tipo_piscina,
        tamanho_metros: initialData.tamanho_metros || '',
        profundidade: initialData.profundidade || 0,
        orcamento_total: initialData.orcamento_total || 0,
        status: initialData.status,
        data_inicio: initialData.data_inicio || '',
        data_previsao_fim: initialData.data_previsao_fim || '',
        data_finalizacao: initialData.data_finalizacao || '',
        observacoes: initialData.observacoes || ''
      });
    } else {
      setFormData({
        nome_cliente: '',
        email_cliente: '',
        telefone_cliente: '',
        endereco: '',
        tipo_piscina: 'media',
        tamanho_metros: '',
        profundidade: 0,
        orcamento_total: 0,
        status: 'orcamento',
        data_inicio: '',
        data_previsao_fim: '',
        data_finalizacao: '',
        observacoes: ''
      });
    }
  }, [initialData, isOpen]);

  const handleInputChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome_cliente.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cliente Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações do Cliente</h3>
              
              <div>
                <Label htmlFor="nome_cliente">Nome do Cliente *</Label>
                <Input
                  id="nome_cliente"
                  value={formData.nome_cliente}
                  onChange={(e) => handleInputChange('nome_cliente', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email_cliente">Email</Label>
                <Input
                  id="email_cliente"
                  type="email"
                  value={formData.email_cliente}
                  onChange={(e) => handleInputChange('email_cliente', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="telefone_cliente">Telefone</Label>
                <Input
                  id="telefone_cliente"
                  value={formData.telefone_cliente}
                  onChange={(e) => handleInputChange('telefone_cliente', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações do Projeto</h3>
              
              <div>
                <Label htmlFor="tipo_piscina">Tipo da Piscina</Label>
                <Select
                  value={formData.tipo_piscina}
                  onValueChange={(value) => handleInputChange('tipo_piscina', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pequena">Pequena</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="grande">Grande</SelectItem>
                    <SelectItem value="olimpica">Olímpica</SelectItem>
                    <SelectItem value="infantil">Infantil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tamanho_metros">Tamanho (metros)</Label>
                <Input
                  id="tamanho_metros"
                  value={formData.tamanho_metros}
                  onChange={(e) => handleInputChange('tamanho_metros', e.target.value)}
                  placeholder="Ex: 8x4m"
                />
              </div>

              <div>
                <Label htmlFor="profundidade">Profundidade (metros)</Label>
                <Input
                  id="profundidade"
                  type="number"
                  step="0.1"
                  value={formData.profundidade}
                  onChange={(e) => handleInputChange('profundidade', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="orcamento_total">Orçamento Total (R$)</Label>
                <Input
                  id="orcamento_total"
                  type="number"
                  step="0.01"
                  value={formData.orcamento_total}
                  onChange={(e) => handleInputChange('orcamento_total', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orcamento">Orçamento</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="em_construcao">Em Construção</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={(e) => handleInputChange('data_inicio', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="data_previsao_fim">Previsão de Fim</Label>
              <Input
                id="data_previsao_fim"
                type="date"
                value={formData.data_previsao_fim}
                onChange={(e) => handleInputChange('data_previsao_fim', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="data_finalizacao">Data de Finalização</Label>
              <Input
                id="data_finalizacao"
                type="date"
                value={formData.data_finalizacao}
                onChange={(e) => handleInputChange('data_finalizacao', e.target.value)}
              />
            </div>
          </div>

          {/* Observations */}
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              rows={4}
              placeholder="Observações adicionais sobre o projeto..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PoolForm;
