
import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  ReferenceLine
} from 'recharts';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calculator, RefreshCw, TrendingUp, Share2 } from "lucide-react";

// Dados de previsão para os próximos 12 meses - adaptado para piscinas
const forecastData = [
  { month: 'Jan', revenue: 85500, expenses: 60100, forecast: 25400, previous: 22200 },
  { month: 'Fev', revenue: 90200, expenses: 65800, forecast: 24400, previous: 23500 },
  { month: 'Mar', revenue: 98800, expenses: 67400, forecast: 31400, previous: 28200 },
  { month: 'Abr', revenue: 105500, expenses: 69100, forecast: 36400, previous: 32200 },
  { month: 'Mai', revenue: 118200, expenses: 70500, forecast: 47700, previous: 40700 },
  { month: 'Jun', revenue: 137800, expenses: 72900, forecast: 64900, previous: 51200 },
  { month: 'Jul', revenue: 142500, expenses: 74200, forecast: 68300, previous: 52400 },
  { month: 'Ago', revenue: 144800, expenses: 75300, forecast: 69500, previous: 53100 },
  { month: 'Set', revenue: 140200, expenses: 74800, forecast: 65400, previous: 52400 },
  { month: 'Out', revenue: 138200, expenses: 73100, forecast: 65100, previous: 51800 },
  { month: 'Nov', revenue: 136500, expenses: 72500, forecast: 64000, previous: 50900 },
  { month: 'Dez', revenue: 141200, expenses: 75800, forecast: 65400, previous: 52200 }
];

// Dados de projeção de fluxo de caixa
const cashFlowProjection = [
  { month: 'Jan', inflow: 85500, outflow: 60100, balance: 25400 },
  { month: 'Fev', inflow: 90200, outflow: 65800, balance: 49800 },
  { month: 'Mar', inflow: 98800, outflow: 67400, balance: 81200 },
  { month: 'Abr', inflow: 105500, outflow: 69100, balance: 117600 },
  { month: 'Mai', inflow: 118200, outflow: 70500, balance: 165300 },
  { month: 'Jun', inflow: 137800, outflow: 72900, balance: 230200 },
  { month: 'Jul', inflow: 142500, outflow: 74200, balance: 298500 },
  { month: 'Ago', inflow: 144800, outflow: 75300, balance: 368000 },
  { month: 'Set', inflow: 140200, outflow: 74800, balance: 433400 },
  { month: 'Out', inflow: 138200, outflow: 73100, balance: 498500 },
  { month: 'Nov', inflow: 136500, outflow: 72500, balance: 562500 },
  { month: 'Dez', inflow: 141200, outflow: 75800, balance: 627900 }
];

const FinancialForecast = () => {
  const [forecastDuration, setForecastDuration] = useState<string>("12");
  const [revenueFactor, setRevenueFactor] = useState<number[]>([100]);
  const [expenseFactor, setExpenseFactor] = useState<number[]>([100]);
  const [revenueScenario, setRevenueScenario] = useState<string>("estavel");
  const [forecastModel, setForecastModel] = useState<string>("basico");
  
  const handleRefreshForecast = () => {
    toast.info("Atualizando previsões financeiras para piscinas");
  };
  
  const handleShareForecast = () => {
    toast.success("Previsões compartilhadas por email");
  };
  
  const handleRunSimulation = () => {
    toast.success("Simulação executada com sucesso");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Previsões Financeiras - Piscinas</h2>
          <p className="text-muted-foreground">Projeções a {forecastDuration} meses baseadas no histórico de vendas</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={forecastDuration} onValueChange={setForecastDuration}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Duração" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
              <SelectItem value="24">24 meses</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={forecastModel} onValueChange={setForecastModel}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Modelo" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="basico">Modelo básico</SelectItem>
              <SelectItem value="sazonal">Modelo sazonal</SelectItem>
              <SelectItem value="avancado">Modelo avançado</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleRefreshForecast} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          
          <Button onClick={handleShareForecast} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Margem Líquida Prevista</CardTitle>
            <CardDescription>Comparação com vendas do ano anterior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={forecastData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === "forecast") return [`R$ ${value.toLocaleString()}`, "Previsão"];
                      if (name === "previous") return [`R$ ${value.toLocaleString()}`, "Ano anterior"];
                      return [`R$ ${value.toLocaleString()}`, name];
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#4CAF50" 
                    strokeWidth={2} 
                    name="Previsão" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#9E9E9E" 
                    strokeDasharray="5 5" 
                    name="Ano anterior" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Previsão de Fluxo de Caixa</CardTitle>
            <CardDescription>Evolução do saldo de caixa da empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={cashFlowProjection}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`R$ ${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <ReferenceLine y={0} stroke="#000" />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#2196F3" 
                    fill="#2196F3" 
                    fillOpacity={0.3}
                    name="Saldo de caixa"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Simulação</CardTitle>
          <CardDescription>Ajuste os parâmetros para personalizar suas previsões de vendas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Fator de vendas ({revenueFactor[0]}%)</Label>
              <Slider
                value={revenueFactor}
                onValueChange={setRevenueFactor}
                max={150}
                min={50}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Ajuste o crescimento esperado das vendas de piscinas
              </p>
            </div>
            
            <div className="space-y-3">
              <Label>Fator de custos ({expenseFactor[0]}%)</Label>
              <Slider
                value={expenseFactor}
                onValueChange={setExpenseFactor}
                max={120}
                min={80}
                step={5}
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Ajuste a evolução esperada dos custos operacionais
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button onClick={handleRunSimulation} className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Executar simulação
            </Button>
            
            <Button variant="outline" onClick={handleRefreshForecast}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Recalcular previsões
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialForecast;
