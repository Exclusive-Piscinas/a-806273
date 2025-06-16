
import React from 'react';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialCharts = () => {
  const { financialData } = useStatistics();
  const { profitabilityByParcel, costAnalysis, revenueByMonth } = financialData;

  // Mostrar estado vazio quando não há dados
  if (!profitabilityByParcel?.length && !costAnalysis?.length && !revenueByMonth?.length) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Análise Financeira</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum dado financeiro disponível ainda.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Comece adicionando informações sobre vendas e custos para ver os gráficos aqui.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Indicadores Financeiros Principais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Margem Bruta</p>
                <p className="text-2xl font-semibold">R$ 0,00</p>
                <p className="text-xs text-muted-foreground">0% do faturamento</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Lucratividade</p>
                <p className="text-2xl font-semibold">0%</p>
                <p className="text-xs text-muted-foreground">Aguardando dados</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">ROI</p>
                <p className="text-2xl font-semibold">0%</p>
                <p className="text-xs text-muted-foreground">Sobre investimentos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conteúdo existente será mostrado quando houver dados */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores Financeiros Principais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Margem Bruta</p>
              <p className="text-2xl font-semibold">R$ 0,00</p>
              <p className="text-xs text-muted-foreground">0% do faturamento</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Lucratividade</p>
              <p className="text-2xl font-semibold">0%</p>
              <p className="text-xs text-muted-foreground">Aguardando dados</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">ROI</p>
              <p className="text-2xl font-semibold">0%</p>
              <p className="text-xs text-muted-foreground">Sobre investimentos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialCharts;
