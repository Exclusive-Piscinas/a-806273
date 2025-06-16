
import React from 'react';
import { InventoryItem } from '@/hooks/use-inventory';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';

interface InventoryStatsProps {
  inventoryData: InventoryItem[];
}

const categoryColors = {
  quimicos: '#3B82F6',
  equipamentos: '#10B981',
  materiais_construcao: '#F59E0B',
  acessorios: '#8B5CF6',
  manutencao: '#EF4444'
};

const categoryLabels = {
  quimicos: 'Químicos',
  equipamentos: 'Equipamentos',
  materiais_construcao: 'Materiais de Construção',
  acessorios: 'Acessórios',
  manutencao: 'Manutenção'
};

const InventoryStats: React.FC<InventoryStatsProps> = ({ inventoryData = [] }) => {
  const getTotalInventoryValue = () => {
    return inventoryData.reduce((sum, item) => sum + (item.quantidade * item.preco_unitario), 0);
  };

  const getLowStockItems = () => {
    return inventoryData.filter(item => item.quantidade <= item.quantidade_minima);
  };

  const getOutOfStockItems = () => {
    return inventoryData.filter(item => item.quantidade === 0);
  };

  const getInventoryHealthStatus = () => {
    const lowStockItems = getLowStockItems().length;
    const totalItems = inventoryData.length;
    
    if (totalItems === 0) return { label: 'Sem dados', color: 'text-gray-500', bgColor: 'bg-gray-100' };
    if (lowStockItems === 0) return { label: 'Excelente', color: 'text-green-700', bgColor: 'bg-green-100' };
    if (lowStockItems / totalItems < 0.1) return { label: 'Bom', color: 'text-lime-700', bgColor: 'bg-lime-100' };
    if (lowStockItems / totalItems < 0.25) return { label: 'Atenção', color: 'text-amber-700', bgColor: 'bg-amber-100' };
    return { label: 'Crítico', color: 'text-red-700', bgColor: 'bg-red-100' };
  };

  const getCategoryStats = () => {
    const stats: Record<string, { quantidade: number; valor: number }> = {};
    
    inventoryData.forEach(item => {
      if (!stats[item.categoria]) {
        stats[item.categoria] = { quantidade: 0, valor: 0 };
      }
      stats[item.categoria].quantidade += item.quantidade;
      stats[item.categoria].valor += item.quantidade * item.preco_unitario;
    });

    return Object.entries(stats).map(([categoria, data]) => ({
      name: categoryLabels[categoria as keyof typeof categoryLabels] || categoria,
      quantidade: data.quantidade,
      valor: data.valor,
      fill: categoryColors[categoria as keyof typeof categoryColors] || '#6B7280'
    }));
  };

  const getTopValueItems = () => {
    return inventoryData
      .map(item => ({
        ...item,
        totalValue: item.quantidade * item.preco_unitario
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);
  };

  const healthStatus = getInventoryHealthStatus();
  const categoryStats = getCategoryStats();
  const lowStockItems = getLowStockItems();
  const outOfStockItems = getOutOfStockItems();
  const topValueItems = getTopValueItems();

  return (
    <div className="space-y-6 animate-enter">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
              <Package className="h-5 w-5" />
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-900">
              {getTotalInventoryValue().toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              {inventoryData.length} itens em estoque
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-green-800">
              <TrendingUp className="h-5 w-5" />
              Itens Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-green-900">
                {inventoryData.filter(item => item.quantidade > 0).length}
              </p>
              <p className="text-sm text-green-700 mt-1">
                {outOfStockItems.length} sem estoque
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-amber-900">{lowStockItems.length}</p>
              <p className="text-sm text-amber-700 mt-1">
                Necessitam reposição
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 ${healthStatus.bgColor}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
              <TrendingDown className="h-5 w-5" />
              Status Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${healthStatus.color}`}>{healthStatus.label}</p>
            <p className="text-sm text-gray-600 mt-1">
              Saúde do estoque
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {categoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                      height={70}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'quantidade' ? `${value} itens` : 
                        `R$ ${Number(value).toLocaleString('pt-BR')}`,
                        name === 'quantidade' ? 'Quantidade' : 'Valor Total'
                      ]}
                    />
                    <Bar dataKey="quantidade" fill="#4CAF50" radius={[4, 4, 0, 0]} name="quantidade" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhum item em estoque</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Adicione itens ao estoque para visualizar estatísticas
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {categoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryStats}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="valor"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhum dado disponível</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Estoque Baixo */}
      {lowStockItems.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Itens com Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockItems.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div>
                    <p className="font-medium text-sm">{item.nome}</p>
                    <p className="text-xs text-gray-500">{categoryLabels[item.categoria]}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" className="text-xs">
                      {item.quantidade} {item.unidade}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Min: {item.quantidade_minima}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {lowStockItems.length > 6 && (
              <p className="text-center text-sm text-amber-700 mt-3">
                e mais {lowStockItems.length - 6} itens...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Top 5 Itens por Valor */}
      {topValueItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Itens de Maior Valor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topValueItems.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.nome}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantidade} {item.unidade} × R$ {item.preco_unitario.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      R$ {item.totalValue.toLocaleString('pt-BR')}
                    </p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {categoryLabels[item.categoria]}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryStats;
