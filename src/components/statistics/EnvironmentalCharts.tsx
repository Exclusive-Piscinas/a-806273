
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, Leaf, Target, TrendingUp } from 'lucide-react';
import { EditableTable, Column } from '../ui/editable-table';
import { EditableField } from '../ui/editable-field';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface QualityData {
  id: string;
  indicador: string;
  valor_atual: number;
  meta: number;
  unidade: string;
  status: 'Atingido' | 'Em Progresso' | 'Atrasado';
}

const EnvironmentalCharts = () => {
  const [qualityData, setQualityData] = useState<QualityData[]>([]);
  const [title, setTitle] = useState('Indicadores de Qualidade');
  const [description, setDescription] = useState('Monitore a qualidade dos seus produtos e processos');

  const columns: Column[] = [
    { id: 'indicador', header: 'Indicador', accessorKey: 'indicador', isEditable: true },
    { id: 'valor_atual', header: 'Valor Atual', accessorKey: 'valor_atual', type: 'number', isEditable: true },
    { id: 'meta', header: 'Meta', accessorKey: 'meta', type: 'number', isEditable: true },
    { id: 'unidade', header: 'Unidade', accessorKey: 'unidade', isEditable: true },
    { id: 'status', header: 'Status', accessorKey: 'status', isEditable: true }
  ];

  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...qualityData];
    newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
    
    // Atualizar status automaticamente baseado no valor atual vs meta
    if (columnId === 'valor_atual' || columnId === 'meta') {
      const valorAtual = newData[rowIndex].valor_atual;
      const meta = newData[rowIndex].meta;
      if (valorAtual >= meta) {
        newData[rowIndex].status = 'Atingido';
      } else if (valorAtual >= meta * 0.8) {
        newData[rowIndex].status = 'Em Progresso';
      } else {
        newData[rowIndex].status = 'Atrasado';
      }
    }
    
    setQualityData(newData);
    console.log(`Indicador de qualidade atualizado: ${columnId} = ${value}`);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newData = [...qualityData];
    newData.splice(rowIndex, 1);
    setQualityData(newData);
    console.log('Indicador de qualidade removido');
  };

  const handleAddRow = (newRow: Record<string, any>) => {
    const valorAtual = Number(newRow.valor_atual || 0);
    const meta = Number(newRow.meta || 100);
    let status: QualityData['status'] = 'Atrasado';
    
    if (valorAtual >= meta) {
      status = 'Atingido';
    } else if (valorAtual >= meta * 0.8) {
      status = 'Em Progresso';
    }

    const newItem: QualityData = {
      id: `quality_${Date.now()}`,
      indicador: String(newRow.indicador || 'Novo Indicador'),
      valor_atual: valorAtual,
      meta,
      unidade: String(newRow.unidade || '%'),
      status
    };
    setQualityData([...qualityData, newItem]);
    console.log('Novo indicador de qualidade adicionado');
  };

  const chartData = qualityData.map(item => ({
    name: item.indicador,
    atual: item.valor_atual,
    meta: item.meta,
    percentual: item.meta > 0 ? (item.valor_atual / item.meta * 100) : 0
  }));

  const indicadoresAtingidos = qualityData.filter(item => item.status === 'Atingido').length;
  const indicadoresEmProgresso = qualityData.filter(item => item.status === 'Em Progresso').length;
  const indicadoresAtrasados = qualityData.filter(item => item.status === 'Atrasado').length;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                <EditableField
                  value={title}
                  onSave={(value) => setTitle(String(value))}
                  className="inline-block"
                />
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                <EditableField
                  value={description}
                  onSave={(value) => setDescription(String(value))}
                  className="inline-block"
                />
              </p>
            </div>
            <Button
              onClick={() => handleAddRow({})}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {qualityData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Atingidos</p>
                      <p className="text-2xl font-bold text-green-900">{indicadoresAtingidos}</p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Em Progresso</p>
                      <p className="text-2xl font-bold text-yellow-900">{indicadoresEmProgresso}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">Atrasados</p>
                      <p className="text-2xl font-bold text-red-900">{indicadoresAtrasados}</p>
                    </div>
                    <Target className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="h-80 mb-6">
                <h3 className="text-lg font-medium mb-4">Performance dos Indicadores</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="atual" fill="#3B82F6" name="Valor Atual" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="meta" fill="#10B981" name="Meta" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {qualityData.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border">
                    <h4 className="font-medium text-gray-900 mb-2">{item.indicador}</h4>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {item.valor_atual} {item.unidade}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Atingido' ? 'bg-green-100 text-green-800' :
                        item.status === 'Em Progresso' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Meta: {item.meta} {item.unidade}</p>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.status === 'Atingido' ? 'bg-green-500' :
                          item.status === 'Em Progresso' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (item.valor_atual / item.meta) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum indicador de qualidade</h3>
              <p className="text-gray-500 mb-4">Adicione indicadores para monitorar a qualidade</p>
              <Button onClick={() => handleAddRow({})} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Indicador
              </Button>
            </div>
          )}

          <EditableTable
            data={qualityData}
            columns={columns}
            onUpdate={handleTableUpdate}
            onDelete={handleDeleteRow}
            onAdd={handleAddRow}
            className="border-0"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalCharts;
