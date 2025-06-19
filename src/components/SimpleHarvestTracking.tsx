
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, TrendingUp } from 'lucide-react';

const SimpleHarvestTracking = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-green-600" />
            Acompanhamento de Colheitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Dados de Colheita
            </h3>
            <p className="text-gray-500 mb-4">
              Registre e acompanhe suas colheitas para análise de produtividade
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleHarvestTracking;
