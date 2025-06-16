
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Dashboard from '../components/Dashboard';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import GuadeloupeHarvestTracking from '../components/GuadeloupeHarvestTracking';
import GuadeloupeWeatherAlerts from '../components/GuadeloupeWeatherAlerts';
import TaskList from '../components/cultures/TaskList';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download, Filter, RefreshCw, Upload, Printer } from 'lucide-react';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { useCRM } from '../contexts/CRMContext';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { user } = useAuth();
  
  // Utilizar o contexto CRM
  const { 
    lastSync,
    isRefreshing,
    syncDataAcrossCRM,
    exportModuleData,
    importModuleData,
    printModuleData
  } = useCRM();

  // Ações baseadas na aba ativa
  const getTabActions = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={syncDataAcrossCRM}
            >
              <RefreshCw className={`h-4 w-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sincronizar
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => handleExportData('dashboard')}
            >
              <Download className="h-4 w-4 text-gray-600" />
              Exportar
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => handleImportData()}
            >
              <Upload className="h-4 w-4 text-gray-600" />
              Importar
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => handlePrintData('dashboard')}
            >
              <Printer className="h-4 w-4 text-gray-600" />
              Imprimir
            </Button>
          </div>
        );
      case 'manutencoes':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handleExportData('manutencoes')}
            >
              <Download className="h-4 w-4 text-gray-600" />
              Exportar
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handlePrintData('manutencoes')}
            >
              <Printer className="h-4 w-4 text-gray-600" />
              Imprimir
            </Button>
          </div>
        );
      case 'alertas':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handleExportData('alertas')}
            >
              <Download className="h-4 w-4 text-gray-600" />
              Exportar
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 text-gray-600" />
              Configurar
            </Button>
          </div>
        );
      case 'tarefas':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Adicionar
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handleExportData('tarefas')}
            >
              <Download className="h-4 w-4 text-gray-600" />
              Exportar
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handlePrintData('tarefas')}
            >
              <Printer className="h-4 w-4 text-gray-600" />
              Imprimir
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    console.log(`Mudança de aba para: ${value}`);
  };

  // Manipulações dos dados
  const handleExportData = async (tab: string) => {
    const moduleMapping: {[key: string]: string} = {
      'dashboard': 'estatisticas',
      'manutencoes': 'culturas',
      'alertas': 'estatisticas',
      'tarefas': 'culturas'
    };
    
    const module = moduleMapping[tab] || 'estatisticas';
    const format = tab === 'dashboard' ? 'excel' : 'csv';
    
    try {
      await exportModuleData(module, format as 'csv' | 'excel' | 'pdf');
      console.log(`Exportação dos dados ${module} no formato ${format} iniciada`);
    } catch (error) {
      console.error(`Erro ao exportar ${module}:`, error);
    }
  };

  const handleImportData = () => {
    setImportDialogOpen(true);
  };

  const handleImportConfirm = async () => {
    if (!selectedFile) {
      console.error("Nenhum arquivo selecionado");
      return;
    }
    
    const moduleMapping = {
      'dashboard': 'estatisticas',
      'manutencoes': 'culturas',
      'alertas': 'estatisticas',
      'tarefas': 'culturas'
    };
    
    const module = moduleMapping[activeTab] || 'estatisticas';
    
    try {
      await importModuleData(module, selectedFile);
      console.log(`Importação do arquivo ${selectedFile.name} bem-sucedida`);
    } catch (error) {
      console.error(`Erro ao importar ${module}:`, error);
    }
    
    setImportDialogOpen(false);
    setSelectedFile(null);
  };

  const handlePrintData = async (tab: string) => {
    const moduleMapping = {
      'dashboard': 'estatisticas',
      'manutencoes': 'culturas',
      'alertas': 'estatisticas',
      'tarefas': 'culturas'
    };
    
    const module = moduleMapping[tab] || 'estatisticas';
    
    try {
      await printModuleData(module);
      console.log(`Impressão dos dados ${module} iniciada`);
    } catch (error) {
      console.error(`Erro ao imprimir ${module}:`, error);
    }
  };

  const tabs: TabItem[] = [
    {
      value: 'dashboard',
      label: 'Painel Principal',
      content: <Dashboard />
    },
    {
      value: 'manutencoes',
      label: 'Manutenções',
      content: <GuadeloupeHarvestTracking />
    },
    {
      value: 'alertas',
      label: 'Alertas do Sistema',
      content: <GuadeloupeWeatherAlerts />
    },
    {
      value: 'tarefas',
      label: 'Lista de Tarefas',
      content: <TaskList />
    }
  ];

  const getNomeUsuario = () => {
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Usuário';
  };

  return (
    <StatisticsProvider>
      <PageLayout>
        <div className="p-6 animate-enter">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Painel Exclusive Piscinas</h1>
              <p className="text-gray-500">
                Bem-vindo, {getNomeUsuario()} | Última sincronização: {lastSync.toLocaleTimeString()}
              </p>
            </div>
            {getTabActions()}
          </div>
          
          <TabContainer 
            tabs={tabs}
            defaultValue={activeTab}
            onValueChange={handleTabChange}
          />
          
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Importar Dados</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Arquivo CSV</Label>
                  <input 
                    type="file" 
                    id="file" 
                    accept=".csv" 
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Os dados serão importados para o módulo atual. 
                  Certifique-se de que o arquivo está no formato CSV.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleImportConfirm}>Importar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageLayout>
    </StatisticsProvider>
  );
};

export default Index;
