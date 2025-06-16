
import React from 'react';
import { InventoryItem } from './ImportExportFunctions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InventoryStatsProps {
  inventoryData: InventoryItem[];
  categoryStats: Array<{name: string; value: number; fill: string}>;
}

const InventoryStats: React.FC<InventoryStatsProps> = ({ 
  inventoryData,
  categoryStats
}) => {
  const getTotalInventoryValue = () => {
    return inventoryData.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const getLowStockItems = () => {
    return inventoryData.filter(item => item.quantity <= item.minQuantity).length;
  };

  const getInventoryHealthStatus = () => {
    const lowStockItems = getLowStockItems();
    const totalItems = inventoryData.length;
    
    if (totalItems === 0) return { label: 'Sem dados', color: 'text-gray-500' };
    if (lowStockItems === 0) return { label: 'Excelente', color: 'text-green-500' };
    if (lowStockItems / totalItems < 0.1) return { label: 'Bom', color: 'text-lime-500' };
    if (lowStockItems / totalItems < 0.25) return { label: 'Médio', color: 'text-amber-500' };
    return { label: 'Atenção', color: 'text-red-500' };
  };

  const healthStatus = getInventoryHealthStatus();

  return (
    <div className="space-y-6 animate-enter">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white rounded-xl border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {getTotalInventoryValue().toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-xl border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Artigos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <p className="text-3xl font-bold">{inventoryData.length}</p>
              <p className="text-muted-foreground">
                {getLowStockItems()} a reabastecer
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white rounded-xl border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Estado do Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${healthStatus.color}`}>{healthStatus.label}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white rounded-xl border">
        <CardHeader>
          <CardTitle>Distribuição por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryStats}
                  margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    tick={{ fontSize: 12 }}
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="#4CAF50" 
                    radius={[4, 4, 0, 0]} 
                    fillOpacity={1} 
                    name="Quantidade"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Nenhum dado disponível para exibir</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryStats;
