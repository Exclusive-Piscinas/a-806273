
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Download, Camera, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import TechnicalSheetButton from '../common/TechnicalSheetButton';

const YieldsCharts = () => {
  const { yieldData, period } = useStatistics();
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  // Formatar os dados para o gráfico comparativo
  const comparativeData = yieldData.map(item => ({
    name: item.name,
    atual: item.current,
    anterior: item.previous,
    diferenca: item.current - item.previous,
    unidade: item.unit
  }));

  // Dados históricos sobre várias anos (simulados)
  const historicalData = [
    { year: '2018', 'Piscinas Pequenas': 70, 'Piscinas Médias': 28, 'Piscinas Grandes': 12, 'Spas': 14, 'Acessórios': 180 },
    { year: '2019', 'Piscinas Pequenas': 72, 'Piscinas Médias': 29, 'Piscinas Grandes': 13, 'Spas': 15, 'Acessórios': 190 },
    { year: '2020', 'Piscinas Pequenas': 75, 'Piscinas Médias': 30, 'Piscinas Grandes': 18, 'Spas': 15, 'Acessórios': 200 },
    { year: '2021', 'Piscinas Pequenas': 78, 'Piscinas Médias': 31, 'Piscinas Grandes': 17, 'Spas': 16, 'Acessórios': 210 },
    { year: '2022', 'Piscinas Pequenas': 82, 'Piscinas Médias': 31, 'Piscinas Grandes': 16, 'Spas': 17, 'Acessórios': 215 },
    { year: '2023', 'Piscinas Pequenas': 85, 'Piscinas Médias': 32, 'Piscinas Grandes': 15, 'Spas': 18, 'Acessórios': 220 }
  ];

  // Gerar as cores para cada produto
  const colors = {
    'Piscinas Pequenas': '#4CAF50',
    'Piscinas Médias': '#FFC107',
    'Piscinas Grandes': '#F44336',
    'Spas': '#9C27B0',
    'Acessórios': '#2196F3'
  };

  // Captura e exportação do gráfico (simulação)
  const handleExportChart = (chartName: string) => {
    toast.success(`Gráfico exportado`, {
      description: `O gráfico "${chartName}" foi baixado no formato PNG`
    });
  };

  // Compartilhamento do gráfico (simulação)
  const handleShareChart = (chartName: string) => {
    toast.success(`Gráfico compartilhado`, {
      description: `O link para o gráfico "${chartName}" foi copiado para a área de transferência`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Vendas atuais vs anteriores</CardTitle>
            <CardDescription>Comparação das vendas atuais com o período anterior</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex rounded-md border overflow-hidden">
              <Button
                variant={chartType === 'bar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('bar')}
                className={chartType === 'bar' ? 'rounded-none' : 'rounded-none hover:bg-muted/50'}
              >
                Barras
              </Button>
              <Button
                variant={chartType === 'line' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setChartType('line')}
                className={chartType === 'line' ? 'rounded-none' : 'rounded-none hover:bg-muted/50'}
              >
                Linhas
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={() => handleExportChart('Vendas comparativas')}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShareChart('Vendas comparativas')}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart
                  data={comparativeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
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
              ) : (
                <LineChart
                  data={comparativeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
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
                  <Line type="monotone" name="Vendas atuais" dataKey="atual" stroke="#4CAF50" strokeWidth={2} />
                  <Line type="monotone" name="Vendas anteriores" dataKey="anterior" stroke="#8D6E63" strokeWidth={2} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Evolução histórica das vendas ({period === 'year' ? 'anual' : 'mensal'})</CardTitle>
            <CardDescription>Tendência das vendas ao longo de vários anos</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => handleExportChart('Evolução histórica')}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShareChart('Evolução histórica')}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={historicalData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} vendas/mês`, '']} />
                <Legend />
                {Object.keys(colors).map((product) => (
                  <Line
                    key={product}
                    type="monotone"
                    dataKey={product}
                    stroke={colors[product as keyof typeof colors]}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {yieldData.map((item) => {
          const change = item.current - item.previous;
          const changePercent = ((change / item.previous) * 100).toFixed(1);
          const isPositive = change >= 0;
          
          return (
            <Card key={item.name}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-base flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[item.name as keyof typeof colors] || '#4CAF50' }}></span>
                    {item.name}
                  </CardTitle>
                  <TechnicalSheetButton 
                    data={{ 
                      name: item.name,
                      currentSales: item.current,
                      previousSales: item.previous,
                      unit: item.unit
                    }} 
                    variant="outline"
                    className="h-8 w-8 p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </TechnicalSheetButton>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{item.current} {item.unit}</div>
                <div className={`text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span>{isPositive ? '+' : ''}{change} {item.unit} ({isPositive ? '+' : ''}{changePercent}%)</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default YieldsCharts;
