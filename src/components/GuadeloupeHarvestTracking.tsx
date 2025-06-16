
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EditableField } from './ui/editable-field';
import { EditableTable, Column } from './ui/editable-table';
import { Droplets, Package, ArrowUp, ArrowDown } from 'lucide-react';
import { useStatistics } from '../contexts/StatisticsContext';
import PreviewPrintButton from './common/PreviewPrintButton';

interface SalesData {
  product: string;
  currentSales: number;
  previousSales: number;
  unit: string;
  targetMarket: number;
  quality: 'Excelente' | 'Boa' | 'Média' | 'Baixa';
}

const GuadeloupeHarvestTracking = () => {
  const { yieldData } = useStatistics();
  const [title, setTitle] = useState('Acompanhamento de Vendas de Piscinas');
  const [description, setDescription] = useState('Acompanhe as vendas e qualidade dos produtos para os principais tipos de piscinas');
  
  // Estado inicial vazio para vendas
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  
  // Colunas para a tabela editável
  const columns: Column[] = [
    { id: 'product', header: 'Produto', accessorKey: 'product', isEditable: true },
    { id: 'currentSales', header: 'Vendas atuais', accessorKey: 'currentSales', type: 'number', isEditable: true },
    { id: 'previousSales', header: 'Vendas anteriores', accessorKey: 'previousSales', type: 'number', isEditable: true },
    { id: 'unit', header: 'Unidade', accessorKey: 'unit', isEditable: true },
    { id: 'targetMarket', header: 'Meta de mercado', accessorKey: 'targetMarket', type: 'number', isEditable: true },
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
      product: String(newRow.product || ''),
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
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <div className="mb-4 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Droplets className="h-6 w-6 mr-2 text-blue-500" />
              <EditableField
                value={title}
                onSave={handleTitleChange}
                className="inline-block"
              />
            </h2>
            <p className="text-muted-foreground">
              <EditableField
                value={description}
                onSave={handleDescriptionChange}
                className="inline-block"
              />
            </p>
          </div>
          
          <PreviewPrintButton 
            data={printData} 
            moduleName="sales_data"
            title={title}
            columns={printColumns}
            variant="outline"
          />
        </div>
        
        {salesData.length > 0 ? (
          <>
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      if (name === 'diferenca') {
                        return [`${Number(value) > 0 ? '+' : ''}${value} ${props.payload.unidade}`, 'Evolução'];
                      }
                      return [`${value} ${props.payload.unidade}`, name];
                    }}
                  />
                  <Legend />
                  <Bar name="Vendas atuais" dataKey="atual" fill="#4CAF50" />
                  <Bar name="Vendas anteriores" dataKey="anterior" fill="#8D6E63" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {salesData.map(item => {
                const change = item.currentSales - item.previousSales;
                const changePercent = item.previousSales > 0 ? ((change / item.previousSales) * 100).toFixed(1) : '0';
                const isPositive = change >= 0;
                
                return (
                  <div key={item.product} className="bg-muted/30 rounded-lg p-4 border">
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
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">
              Nenhum dado de vendas disponível
            </p>
            <p className="text-sm text-muted-foreground">
              Adicione produtos na tabela abaixo para começar o acompanhamento
            </p>
          </div>
        )}
        
        <EditableTable
          data={salesData}
          columns={columns}
          onUpdate={handleTableUpdate}
          onDelete={handleDeleteRow}
          onAdd={handleAddRow}
          className="border-none"
        />
      </div>
    </div>
  );
};

export default GuadeloupeHarvestTracking;
