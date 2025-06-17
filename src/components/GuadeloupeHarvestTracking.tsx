
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EditableField } from './ui/editable-field';
import { EditableTable, Column } from './ui/editable-table';
import { Droplets, Package, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import PreviewPrintButton from './common/PreviewPrintButton';

interface SalesData {
  id: string;
  product: string;
  currentSales: number;
  previousSales: number;
  unit: string;
  targetMarket: number;
  quality: 'Excelente' | 'Boa' | 'Média' | 'Baixa';
}

const GuadeloupeHarvestTracking = () => {
  const [title, setTitle] = useState('Acompanhamento de Vendas de Piscinas');
  const [description, setDescription] = useState('Acompanhe as vendas e qualidade dos produtos para os principais tipos de piscinas');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  
  // Colunas para a tabela editável
  const columns: Column[] = [
    { id: 'product', header: 'Produto', accessorKey: 'product', isEditable: true },
    { id: 'currentSales', header: 'Vendas atuais', accessorKey: 'currentSales', type: 'number', isEditable: true },
    { id: 'previousSales', header: 'Vendas anteriores', accessorKey: 'previousSales', type: 'number', isEditable: true },
    { id: 'unit', header: 'Unidade', accessorKey: 'unit', isEditable: true },
    { id: 'targetMarket', header: 'Meta', accessorKey: 'targetMarket', type: 'number', isEditable: true },
    { id: 'quality', header: 'Qualidade', accessorKey: 'quality', isEditable: true }
  ];
  
  // Handlers
  const handleTitleChange = (value: string | number) => {
    setTitle(String(value));
  };
  
  const handleDescriptionChange = (value: string | number) => {
    setDescription(String(value));
  };
  
  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...salesData];
    const updatedRow = { ...newData[rowIndex] };
    
    if (columnId === 'currentSales' || columnId === 'previousSales' || columnId === 'targetMarket') {
      (updatedRow as any)[columnId] = Number(value);
    } else if (columnId === 'product' || columnId === 'unit' || columnId === 'quality') {
      (updatedRow as any)[columnId] = String(value);
    }
    
    newData[rowIndex] = updatedRow as SalesData;
    setSalesData(newData);
    console.log('Dados de vendas atualizados');
  };
  
  const handleDeleteRow = (rowIndex: number) => {
    const newData = [...salesData];
    newData.splice(rowIndex, 1);
    setSalesData(newData);
    console.log('Produto removido do acompanhamento');
  };
  
  const handleAddRow = (newRow: Record<string, any>) => {
    const typedRow: SalesData = {
      id: `sales_${Date.now()}`,
      product: String(newRow.product || 'Novo Produto'),
      currentSales: Number(newRow.currentSales || 0),
      previousSales: Number(newRow.previousSales || 0),
      unit: String(newRow.unit || 'vendas/mês'),
      targetMarket: Number(newRow.targetMarket || 0),
      quality: (newRow.quality as SalesData['quality']) || 'Média'
    };
    setSalesData([...salesData, typedRow]);
    console.log('Novo produto adicionado ao acompanhamento');
  };
  
  // Dados para o gráfico comparativo
  const chartData = salesData.map(item => ({
    name: item.product,
    atual: item.currentSales,
    anterior: item.previousSales,
    meta: item.targetMarket,
    diferenca: item.currentSales - item.previousSales,
    unidade: item.unit
  }));

  // Preparar dados para visualização/impressão
  const printData = salesData.map(item => ({
    produto: item.product,
    vendas_atuais: `${item.currentSales} ${item.unit}`,
    vendas_anteriores: `${item.previousSales} ${item.unit}`,
    meta_mercado: `${item.targetMarket}`,
    qualidade: item.quality,
    evolucao: `${item.currentSales > item.previousSales ? '+' : ''}${(item.currentSales - item.previousSales)} ${item.unit}`
  }));
  
  // Colunas para visualização/impressão
  const printColumns = [
    { key: "produto", header: "Produto" },
    { key: "vendas_atuais", header: "Vendas atuais" },
    { key: "vendas_anteriores", header: "Vendas anteriores" },
    { key: "meta_mercado", header: "Meta de mercado" },
    { key: "qualidade", header: "Qualidade" },
    { key: "evolucao", header: "Evolução" }
  ];

  const totalVendasAtual = salesData.reduce((sum, item) => sum + item.currentSales, 0);
  const totalVendasAnterior = salesData.reduce((sum, item) => sum + item.previousSales, 0);
  const crescimento = totalVendasAnterior > 0 ? ((totalVendasAtual - totalVendasAnterior) / totalVendasAnterior * 100).toFixed(1) : '0';
  
  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="mb-4 flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Droplets className="h-6 w-6 text-blue-500" />
                <EditableField
                  value={title}
                  onSave={handleTitleChange}
                  className="inline-block"
                />
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                <EditableField
                  value={description}
                  onSave={handleDescriptionChange}
                  className="inline-block"
                />
              </p>
            </div>
            
            <div className="flex gap-2">
              <PreviewPrintButton 
                data={printData} 
                moduleName="sales_data"
                title={title}
                columns={printColumns}
                variant="outline"
                size="sm"
              />
              <Button
                onClick={() => handleAddRow({})}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {salesData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Atual</p>
                      <p className="text-2xl font-bold text-blue-900">{totalVendasAtual}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Total Anterior</p>
                      <p className="text-2xl font-bold text-gray-900">{totalVendasAnterior}</p>
                    </div>
                    <Package className="h-8 w-8 text-gray-600" />
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
                    {Number(crescimento) >= 0 ? (
                      <ArrowUp className="h-8 w-8 text-green-600" />
                    ) : (
                      <ArrowDown className="h-8 w-8 text-red-600" />
                    )}
                  </div>
                </div>
              </div>

              <div className="h-80 mb-6">
                <h3 className="text-lg font-medium mb-4">Comparativo de Vendas</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} ${props.payload.unidade}`, 
                        name === 'atual' ? 'Vendas Atuais' : 
                        name === 'anterior' ? 'Vendas Anteriores' : 'Meta'
                      ]}
                    />
                    <Legend />
                    <Bar name="atual" dataKey="atual" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar name="anterior" dataKey="anterior" fill="#9CA3AF" radius={[4, 4, 0, 0]} />
                    <Bar name="meta" dataKey="meta" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {salesData.map(item => {
                  const change = item.currentSales - item.previousSales;
                  const changePercent = item.previousSales > 0 ? ((change / item.previousSales) * 100).toFixed(1) : '0';
                  const isPositive = change >= 0;
                  
                  return (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 border">
                      <h3 className="font-medium mb-1 flex items-center">
                        <Package className="h-4 w-4 mr-1.5 text-blue-500" />
                        {item.product}
                      </h3>
                      <div className="text-2xl font-bold">{item.currentSales} {item.unit}</div>
                      <div className={`text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        <span>{isPositive ? '+' : ''}{change} {item.unit} ({isPositive ? '+' : ''}{changePercent}%)</span>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Qualidade: <span className="font-medium">{item.quality}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Meta: <span className="font-medium">{item.targetMarket} {item.unit}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum dado de vendas disponível
              </h3>
              <p className="text-gray-500 mb-4">
                Adicione produtos na tabela para começar o acompanhamento
              </p>
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

export default GuadeloupeHarvestTracking;
