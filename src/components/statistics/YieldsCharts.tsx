
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, BarChart3, TrendingUp } from 'lucide-react';
import { EditableTable, Column } from '../ui/editable-table';
import { EditableField } from '../ui/editable-field';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesData {
  id: string;
  produto: string;
  vendas_mes_atual: number;
  vendas_mes_anterior: number;
  meta: number;
  unidade: string;
}

const YieldsCharts = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [title, setTitle] = useState('Vendas de Piscinas');
  const [description, setDescription] = useState('Acompanhe as vendas mensais dos seus produtos');

  const columns: Column[] = [
    { id: 'produto', header: 'Produto', accessorKey: 'produto', isEditable: true },
    { id: 'vendas_mes_atual', header: 'Vendas Atual', accessorKey: 'vendas_mes_atual', type: 'number', isEditable: true },
    { id: 'vendas_mes_anterior', header: 'Vendas Anterior', accessorKey: 'vendas_mes_anterior', type: 'number', isEditable: true },
    { id: 'meta', header: 'Meta', accessorKey: 'meta', type: 'number', isEditable: true },
    { id: 'unidade', header: 'Unidade', accessorKey: 'unidade', isEditable: true }
  ];

  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...salesData];
    newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
    setSalesData(newData);
    console.log(`Dados de vendas atualizados: ${columnId} = ${value}`);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newData = [...salesData];
    newData.splice(rowIndex, 1);
    setSalesData(newData);
    console.log('Produto removido das vendas');
  };

  const handleAddRow = (newRow: Record<string, any>) => {
    const newItem: SalesData = {
      id: `sales_${Date.now()}`,
      produto: String(newRow.produto || 'Novo Produto'),
      vendas_mes_atual: Number(newRow.vendas_mes_atual || 0),
      vendas_mes_anterior: Number(newRow.vendas_mes_anterior || 0),
      meta: Number(newRow.meta || 0),
      unidade: String(newRow.unidade || 'vendas')
    };
    setSalesData([...salesData, newItem]);
    console.log('Novo produto adicionado às vendas');
  };

  const chartData = salesData.map(item => ({
    name: item.produto,
    atual: item.vendas_mes_atual,
    anterior: item.vendas_mes_anterior,
    meta: item.meta
  }));

  const totalVendasAtual = salesData.reduce((sum, item) => sum + item.vendas_mes_atual, 0);
  const totalVendasAnterior = salesData.reduce((sum, item) => sum + item.vendas_mes_anterior, 0);
  const crescimento = totalVendasAnterior > 0 ? ((totalVendasAtual - totalVendasAnterior) / totalVendasAnterior * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <EditableField
                  value={title}
                  onSave={(value) => setTitle(String(value))}
                  className="inline-block"
                />
              </CardTitle>
              <CardDescription className="mt-1">
                <EditableField
                  value={description}
                  onSave={(value) => setDescription(String(value))}
                  className="inline-block"
                />
              </CardDescription>
            </div>
            <Button
              onClick={() => handleAddRow({})}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {salesData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Vendas Atuais</p>
                      <p className="text-2xl font-bold text-blue-900">{totalVendasAtual}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Vendas Anteriores</p>
                      <p className="text-2xl font-bold text-gray-900">{totalVendasAnterior}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-gray-600" />
                  </div>
                </div>
                <div className={`bg-gradient-to-r ${Number(crescimento) >= 0 ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'} rounded-lg p-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${Number(crescimento) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Crescimento</p>
                      <p className={`text-2xl font-bold ${Number(crescimento) >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                        {Number(crescimento) >= 0 ? '+' : ''}{crescimento}%
                      </p>
                    </div>
                    <TrendingUp className={`h-8 w-8 ${Number(crescimento) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                </div>
              </div>

              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="atual" fill="#3B82F6" name="Vendas Atuais" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="anterior" fill="#9CA3AF" name="Vendas Anteriores" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="meta" fill="#10B981" name="Meta" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado de vendas</h3>
              <p className="text-gray-500 mb-4">Adicione produtos para começar a acompanhar suas vendas</p>
              <Button onClick={() => handleAddRow({})} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Produto
              </Button>
            </div>
          )}

          <EditableTable
            data={salesData}
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

export default YieldsCharts;
