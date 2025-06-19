
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SimpleCrops = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Culturas Específicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Leaf className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Gerenciar Culturas
            </h3>
            <p className="text-gray-500 mb-4">
              Cadastre e gerencie diferentes tipos de culturas
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cultura
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleCrops;
