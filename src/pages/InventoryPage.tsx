
import React, { useState, useRef } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import Inventory from '../components/Inventory';
import GuadeloupeSpecificCrops from '../components/GuadeloupeSpecificCrops';
import GuadeloupeHarvestTracking from '../components/GuadeloupeHarvestTracking';
import GuadeloupeWeatherAlerts from '../components/GuadeloupeWeatherAlerts';
import { Button } from '../components/ui/button';
import { Download, Plus, Upload, FileUp, FileDown, BarChart2, Calendar, Package } from 'lucide-react';
import { DatePickerWithRange } from '../components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { useToast } from "@/hooks/use-toast";
import usePageMetadata from '../hooks/use-page-metadata';
import { downloadInventoryTemplate } from '../components/inventory/ImportExportFunctions';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const InventoryPage = () => {
  const { toast: shadowToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('inventory');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Gestão de Estoque e Produtos',
    defaultDescription: 'Gerencie seu estoque e acompanhe os níveis de produtos para piscinas'
  });

  const handleExportData = () => {
    if (activeTab === 'inventory') {
      console.log("Exportação de dados de estoque iniciada");
    } else if (activeTab === 'crops') {
      console.log("Exportação de dados de produtos");
    } else if (activeTab === 'weather') {
      console.log("Exportação de dados climáticos");
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(`Importação do arquivo ${file.name}`);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddItem = () => {
    const actionText = activeTab === 'inventory' ? 'estoque' : 
                      activeTab === 'crops' ? 'produto' : 
                      activeTab === 'weather' ? 'alerta' : 'item';
                      
    console.log(`Funcionalidade de adição de ${actionText} ativada`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Pass the search term to the active component using context or props
  };

  const handleDownloadTemplate = () => {
    downloadInventoryTemplate();
    console.log("Download do modelo de estoque");
  };

  const renderTabActions = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="whitespace-nowrap transition-colors hover:bg-gray-100">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border shadow-lg">
            <DropdownMenuItem onClick={handleExportData} className="cursor-pointer">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportData} className="cursor-pointer">
              <BarChart2 className="mr-2 h-4 w-4" />
              Exportar PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="whitespace-nowrap transition-colors hover:bg-gray-100">
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border shadow-lg">
            <DropdownMenuItem onClick={handleImportClick} className="cursor-pointer">
              <FileUp className="mr-2 h-4 w-4" />
              Importar arquivo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDownloadTemplate} className="cursor-pointer">
              <Package className="mr-2 h-4 w-4" />
              Baixar modelo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".csv"
          className="hidden" 
        />
        
        <Button 
          onClick={handleAddItem} 
          className="whitespace-nowrap transition-colors hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          {activeTab === 'inventory' ? 'Adicionar Estoque' : 
           activeTab === 'crops' ? 'Adicionar Produto' : 
           activeTab === 'weather' ? 'Adicionar Alerta' : 'Adicionar'}
        </Button>
      </div>
    );
  };

  const renderFilterArea = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-3 w-full"
      >
        <div className="relative flex-grow">
          <Input 
            placeholder={`Pesquisar em ${activeTab === 'inventory' ? 'estoque' : activeTab === 'crops' ? 'produtos' : 'alertas'}`} 
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="w-full md:w-[300px]">
          <DatePickerWithRange
            date={dateRange}
            setDate={setDateRange}
            placeholderText="Filtrar por data"
            align="end"
          />
        </div>
      </motion.div>
    );
  };

  const cropsContent = (
    <StatisticsProvider>
      <div className="space-y-8">
        <GuadeloupeSpecificCrops />
        <GuadeloupeHarvestTracking />
      </div>
    </StatisticsProvider>
  );

  const tabs: TabItem[] = [
    {
      value: 'inventory',
      label: 'Estoque',
      content: <Inventory dateRange={dateRange} searchTerm={searchTerm} />
    },
    {
      value: 'crops',
      label: 'Produtos',
      content: cropsContent
    },
    {
      value: 'weather',
      label: 'Condições',
      content: <GuadeloupeWeatherAlerts />
    }
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    const tabLabels = {
      inventory: 'o Estoque',
      crops: 'os Produtos',
      weather: 'as Condições'
    };
    
    console.log(`Você está visualizando agora ${tabLabels[value as keyof typeof tabLabels] || value}`);
  };

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          actions={renderTabActions()}
          icon={<Package className="h-6 w-6" />}
          filterArea={renderFilterArea()}
        />

        <TabContainer 
          tabs={tabs} 
          defaultValue={activeTab} 
          onValueChange={handleTabChange} 
        />
      </div>
    </PageLayout>
  );
};

export default InventoryPage;
