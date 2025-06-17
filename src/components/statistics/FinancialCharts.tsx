
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { EditableTable, Column } from '../ui/editable-table';
import { EditableField } from '../ui/editable-field';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface FinancialData {
  id: string;
  categoria: string;
  receitas: number;
  despesas: number;
  lucro: number;
  mes: string;
}

const FinancialCharts = () => {
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [title, setTitle] = useState('Análise Financeira');
  const [description, setDescription] = useState('Acompanhe receitas, despesas e lucratividade');

  const columns: Column[] = [
    { id: 'categoria', header: 'Categoria', accessorKey: 'categoria', isEditable: true },
    { id: 'receitas', header: 'Receitas (R$)', accessorKey: 'receitas', type: 'number', isEditable: true },
    { id: 'despesas', header: 'Despesas (R$)', accessorKey: 'despesas', type: 'number', isEditable: true },
    { id: 'lucro', header: 'Lucro (R$)', accessorKey: 'lucro', type: 'number', isEditable: false },
    { id: 'mes', header: 'Mês', accessorKey: 'mes', isEditable: true }
  ];

  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...financialData];
    newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
    
    // Recalcular lucro automaticamente
    if (columnId === 'receitas' || columnId === 'despesas') {
      newData[rowIndex].lucro = newData[rowIndex].receitas - newData[rowIndex].despesas;
    }
    
    setFinancialData(newData);
    console.log(`Dados financeiros atualizados: ${columnId} = ${value}`);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newData = [...financialData];
    newData.splice(rowIndex, 1);
    setFinancialData(newData);
    console.log('Item financeiro removido');
  };

  const handleAddRow = (newRow: Record<string, any>) => {
    const receitas = Number(newRow.receitas || 0);
    const despesas = Number(newRow.despesas || 0);
    const newItem: FinancialData = {
      id: `financial_${Date.now()}`,
      categoria: String(newRow.categoria || 'Nova Categoria'),
      receitas,
      despesas,
      lucro: receitas - despesas,
      mes: String(newRow.mes || new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
    };
    setFinancialData([...financialData, newItem]);
    console.log('Novo item financeiro adicionado');
  };

  const totalReceitas = financialData.reduce((sum, item) => sum + item.receitas, 0);
  const totalDespesas = financialData.reduce((sum, item) => sum + item.despesas, 0);
  const totalLucro = totalReceitas - totalDespesas;

  const chartData = financialData.map(item => ({
    name: item.categoria,
    receitas: item.receitas,
    despesas: item.despesas,
    lucro: item.lucro
  }));

  const pieData = [
    { name: 'Receitas', value: totalReceitas, fill: '#10B981' },
    { name: 'Despesas', value: totalDespesas, fill: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
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
          {financialData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Receitas Totais</p>
                      <p className="text-2xl font-bold text-green-900">
                        R$ {totalReceitas.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 font-medium">Despesas Totais</p>
                      <p className="text-2xl font-bold text-red-900">
                        R$ {totalDespesas.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <div className={`bg-gradient-to-r ${totalLucro >= 0 ? 'from-blue-50 to-blue-100' : 'from-red-50 to-red-100'} rounded-lg p-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${totalLucro >= 0 ? 'text-blue-600' : 'text-red-600'}`}>Lucro Líquido</p>
                      <p className={`text-2xl font-bold ${totalLucro >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                        R$ {totalLucro.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <DollarSign className={`h-8 w-8 ${totalLucro >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="h-80">
                  <h3 className="text-lg font-medium mb-4">Receitas vs Despesas</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                      <Bar dataKey="receitas" fill="#10B981" name="Receitas" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="despesas" fill="#EF4444" name="Despesas" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-80">
                  <h3 className="text-lg font-medium mb-4">Distribuição Total</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado financeiro</h3>
              <p className="text-gray-500 mb-4">Adicione categorias para começar a análise financeira</p>
              <Button onClick={() => handleAddRow({})} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Categoria
              </Button>
            </div>
          )}

          <EditableTable
            data={financialData}
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

export default FinancialCharts;
