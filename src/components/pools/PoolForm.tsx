
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFormOperations } from '@/hooks/use-form-operations';
import { PoolProject } from '@/hooks/use-pools';

interface PoolFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<PoolProject, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  initialData?: Partial<PoolProject>;
  title: string;
}

const PoolForm: React.FC<PoolFormProps> = ({ isOpen, onClose, onSubmit, initialData, title }) => {
  const initialValues = {
    nome_cliente: initialData?.nome_cliente || '',
    email_cliente: initialData?.email_cliente || '',
    telefone_cliente: initialData?.telefone_cliente || '',
    endereco: initialData?.endereco || '',
    tipo_piscina: initialData?.tipo_piscina || 'media',
    tamanho_metros: initialData?.tamanho_metros || '',
    profundidade: initialData?.profundidade || 0,
    orcamento_total: initialData?.orcamento_total || 0,
    status: initialData?.status || 'orcamento',
    data_inicio: initialData?.data_inicio || '',
    data_previsao_fim: initialData?.data_previsao_fim || '',
    observacoes: initialData?.observacoes || ''
  };

  const validationConfig = {
    nome_cliente: { required: true, minLength: 2 },
    email_cliente: { isEmail: true },
    tipo_piscina: { required: true },
    orcamento_total: { isNumber: true, min: 0 },
    profundidade: { isNumber: true, min: 0 }
  };

  const { values, errors, handleChange, handleSubmit, isSubmitting, resetForm } = useFormOperations(
    initialValues,
    validationConfig
  );

  const onFormSubmit = async (data: typeof values) => {
    await onSubmit(data as any);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome_cliente">Nome do Cliente *</Label>
              <Input
                id="nome_cliente"
                name="nome_cliente"
                value={values.nome_cliente}
                onChange={handleChange}
                placeholder="Nome completo do cliente"
              />
              {errors.nome_cliente && (
                <p className="text-sm text-red-600">{errors.nome_cliente}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email_cliente">Email</Label>
              <Input
                id="email_cliente"
                name="email_cliente"
                type="email"
                value={values.email_cliente}
                onChange={handleChange}
                placeholder="email@exemplo.com"
              />
              {errors.email_cliente && (
                <p className="text-sm text-red-600">{errors.email_cliente}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone_cliente">Telefone</Label>
              <Input
                id="telefone_cliente"
                name="telefone_cliente"
                value={values.telefone_cliente}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_piscina">Tipo da Piscina *</Label>
              <Select
                value={values.tipo_piscina}
                onValueChange={(value) => handleChange({ target: { name: 'tipo_piscina', value } } as any)}
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

            <div className="space-y-2">
              <Label htmlFor="tamanho_metros">Dimensões</Label>
              <Input
                id="tamanho_metros"
                name="tamanho_metros"
                value={values.tamanho_metros}
                onChange={handleChange}
                placeholder="8x4 metros"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profundidade">Profundidade (m)</Label>
              <Input
                id="profundidade"
                name="profundidade"
                type="number"
                step="0.1"
                value={values.profundidade}
                onChange={handleChange}
                placeholder="1.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orcamento_total">Orçamento Total (R$)</Label>
              <Input
                id="orcamento_total"
                name="orcamento_total"
                type="number"
                step="0.01"
                value={values.orcamento_total}
                onChange={handleChange}
                placeholder="50000.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={values.status}
                onValueChange={(value) => handleChange({ target: { name: 'status', value } } as any)}
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

            <div className="space-y-2">
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                name="data_inicio"
                type="date"
                value={values.data_inicio}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_previsao_fim">Previsão de Conclusão</Label>
              <Input
                id="data_previsao_fim"
                name="data_previsao_fim"
                type="date"
                value={values.data_previsao_fim}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço Completo</Label>
            <Input
              id="endereco"
              name="endereco"
              value={values.endereco}
              onChange={handleChange}
              placeholder="Rua, número, bairro, cidade - CEP"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              name="observacoes"
              value={values.observacoes}
              onChange={handleChange}
              placeholder="Observações adicionais sobre o projeto..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PoolForm;
