
import React from 'react';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EnvironmentalCharts = () => {
  const { environmentalData } = useStatistics();
  const { indicators, carbonFootprint, waterUsage, biodiversity } = environmentalData;

  // Mostrar estado vazio quando não há dados
  if (!indicators || indicators.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Qualidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum indicador de qualidade disponível ainda.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Configure os indicadores de qualidade para acompanhar a performance da sua empresa.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sustentabilidade</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="inline-block relative">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold">0%</span>
                    <span className="text-xs text-muted-foreground">vs N-1</span>
                  </div>
                </div>
                <p className="mt-4 text-sm">
                  Aguardando dados de sustentabilidade.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Eficiência Energética</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="inline-block relative">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold">0%</span>
                    <span className="text-xs text-muted-foreground">vs N-1</span>
                  </div>
                </div>
                <p className="mt-4 text-sm">
                  Aguardando dados de eficiência energética.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Qualidade do Produto</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="inline-block relative">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold">0%</span>
                    <span className="text-xs text-muted-foreground">vs N-1</span>
                  </div>
                </div>
                <p className="mt-4 text-sm">
                  Aguardando dados de qualidade.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Conteúdo será mostrado quando houver dados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sustentabilidade</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-32 h-32 rounded-full border-8 border-green-500"></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">{carbonFootprint}%</span>
                  <span className="text-xs text-muted-foreground">vs N-1</span>
                </div>
              </div>
              <p className="mt-4 text-sm">
                Redução do impacto ambiental através de práticas sustentáveis.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Eficiência Energética</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-32 h-32 rounded-full border-8 border-[#2196F3]"></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">{waterUsage}%</span>
                  <span className="text-xs text-muted-foreground">vs N-1</span>
                </div>
              </div>
              <p className="mt-4 text-sm">
                Melhoria na eficiência energética dos processos.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Qualidade do Produto</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="inline-block relative">
                <div className="w-32 h-32 rounded-full border-8 border-[#FFC107]"></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-2xl font-bold">+{biodiversity}%</span>
                  <span className="text-xs text-muted-foreground">vs N-1</span>
                </div>
              </div>
              <p className="mt-4 text-sm">
                Aumento na qualidade das piscinas produzidas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnvironmentalCharts;
