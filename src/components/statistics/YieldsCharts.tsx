
import React, { useState } from 'react';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const YieldsCharts = () => {
  const { yieldData } = useStatistics();

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
              Nenhum dado de vendas disponível.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Registre suas vendas para visualizar gráficos e análises.
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
            <div className="text-2xl font-bold">0 vendas</div>
            <div className="text-sm text-muted-foreground">
              Nenhuma venda registrada
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Piscinas Médias</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">0 vendas</div>
            <div className="text-sm text-muted-foreground">
              Nenhuma venda registrada
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Piscinas Grandes</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold">0 vendas</div>
            <div className="text-sm text-muted-foreground">
              Nenhuma venda registrada
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default YieldsCharts;
