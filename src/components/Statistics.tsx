
import React from 'react';
import { Link } from 'react-router-dom';
import StatisticsHeader from './statistics/StatisticsHeader';
import ChartSelector from './statistics/ChartSelector';
import ChartFilters from './statistics/ChartFilters';
import YieldsCharts from './statistics/YieldsCharts';
import FinancialCharts from './statistics/FinancialCharts';
import EnvironmentalCharts from './statistics/EnvironmentalCharts';
import { useStatistics } from '../contexts/StatisticsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb';

const Statistics = () => {
  const { 
    period, 
    setPeriod, 
    cropFilter, 
    setCropFilter,
    updateDataWithFilters
  } = useStatistics();
  
  const isMobile = useIsMobile();
  const [currentChart, setCurrentChart] = React.useState<'yields' | 'financial' | 'environmental'>('yields');
  
  const getChartTitle = () => {
    switch (currentChart) {
      case 'yields': return 'Análise de Vendas';
      case 'financial': return 'Análise Financeira';
      case 'environmental': return 'Indicadores de Qualidade';
      default: return 'Estatísticas';
    }
  };
  
  const getChartDescription = () => {
    switch (currentChart) {
      case 'yields': return 'Acompanhe as vendas e performance dos produtos';
      case 'financial': return 'Monitore receitas, despesas e lucratividade';
      case 'environmental': return 'Acompanhe indicadores de qualidade e performance';
      default: return 'Dados estatísticos do seu negócio';
    }
  };

  const handleFilterChange = (newPeriod: any, newCropFilter: string) => {
    setPeriod(newPeriod);
    setCropFilter(newCropFilter);
    updateDataWithFilters(newPeriod, newCropFilter);
  };

  const handleExportData = async () => {
    console.log(`Exportando dados de ${currentChart}...`);
  };
  
  return (
    <div className="p-3 md:p-6 animate-enter">
      <StatisticsHeader />
      
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{getChartTitle()}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ChartSelector 
        currentChart={currentChart} 
        setCurrentChart={setCurrentChart} 
      />

      <div className="bg-white rounded-xl border border-gray-100 p-3 md:p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">{getChartTitle()}</h2>
            <p className="text-sm md:text-base text-gray-500">{getChartDescription()}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <ChartFilters 
              period={period}
              setPeriod={(newPeriod) => handleFilterChange(newPeriod, cropFilter)}
              cropFilter={cropFilter}
              setCropFilter={(newCropFilter) => handleFilterChange(period, newCropFilter)}
              onExport={handleExportData}
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-2 md:p-4 overflow-x-auto">
          <div className={`min-w-full ${isMobile ? 'min-w-[500px]' : ''}`}>
            {currentChart === 'yields' && <YieldsCharts />}
            {currentChart === 'financial' && <FinancialCharts />}
            {currentChart === 'environmental' && <EnvironmentalCharts />}
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button 
            variant="outline" 
            size="sm"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
