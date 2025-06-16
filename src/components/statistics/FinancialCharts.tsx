
import React from 'react';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialCharts = () => {
  const { financialData } = useStatistics();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Análise Financeira</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhum dado financeiro disponível.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Adicione transações financeiras para visualizar análises aqui.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Indicadores Financeiros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Receita Total</p>
              <p className="text-2xl font-semibold">R$ 0,00</p>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Despesas Totais</p>
              <p className="text-2xl font-semibold">R$ 0,00</p>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Lucro Líquido</p>
              <p className="text-2xl font-semibold">R$ 0,00</p>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialCharts;
