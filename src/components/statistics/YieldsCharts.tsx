
import React, { useState } from 'react';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const YieldsCharts = () => {
  const { yieldData } = useStatistics();

  // Mostrar estado vazio quando não há dados
  if (!yieldData || yieldData.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas de Piscinas</CardTitle>
            <CardDescription>Dados de vendas por tipo de produto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum dado de vendas disponível ainda.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Comece registrando suas vendas para ver os gráficos e análises aqui.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Piscinas Pequenas</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">0 vendas/mês</div>
              <div className="text-sm text-muted-foreground">
                Aguardando dados
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Piscinas Médias</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">0 vendas/mês</div>
              <div className="text-sm text-muted-foreground">
                Aguardando dados
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Piscinas Grandes</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">0 vendas/mês</div>
              <div className="text-sm text-muted-foreground">
                Aguardando dados
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
      {/* Conteúdo será mostrado quando houver dados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {yieldData.map((item) => {
          const change = item.current - item.previous;
          const changePercent = item.previous > 0 ? ((change / item.previous) * 100).toFixed(1) : '0';
          const isPositive = change >= 0;
          
          return (
            <Card key={item.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{item.current} {item.unit}</div>
                <div className={`text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{change} {item.unit} ({isPositive ? '+' : ''}{changePercent}%)
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
