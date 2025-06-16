
import React from 'react';
import { Check, Layers, ArrowRight } from 'lucide-react';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const EnvironmentalCharts = () => {
  const { environmentalData } = useStatistics();
  const { indicators, carbonFootprint, waterUsage, biodiversity } = environmentalData;

  return (
    <div className="space-y-6">
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
                Redução do impacto ambiental através de práticas sustentáveis na fabricação.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Eficiência energética</CardTitle>
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
                Melhoria na eficiência energética dos processos de produção.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Qualidade do produto</CardTitle>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Indicadores de qualidade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">Indicador</th>
                  <th className="px-4 py-2 text-left">Valor atual</th>
                  <th className="px-4 py-2 text-left">Meta</th>
                  <th className="px-4 py-2 text-left">Tendência</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {indicators.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 font-medium">{item.indicator}</td>
                    <td className="px-4 py-3">{item.current}</td>
                    <td className="px-4 py-3">{item.target}</td>
                    <td className="px-4 py-3 text-green-600">{item.trend}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        item.status === 'Atteint' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Certificações e compromissos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-medium mb-1">ISO 9001</h4>
              <p className="text-sm text-center text-muted-foreground">
                Certificado desde 2019
              </p>
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                <Layers className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="font-medium mb-1">Qualidade Premium</h4>
              <p className="text-sm text-center text-muted-foreground">
                Fibra de alta resistência
              </p>
            </div>
            <div className="border rounded-lg p-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <ArrowRight className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-medium mb-1">Garantia Estendida</h4>
              <p className="text-sm text-center text-muted-foreground">
                15 anos de garantia
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalCharts;
