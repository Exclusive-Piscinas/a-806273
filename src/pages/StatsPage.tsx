
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SimpleStatistics from '../components/SimpleStatistics';
import SimpleHarvestTracking from '../components/SimpleHarvestTracking';
import { ChartConfig } from '../components/ui/chart-config';
import { EditableTable, Column } from '../components/ui/editable-table';
import { EditableField } from '../components/ui/editable-field';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { BarChart, PieChart, TrendingUp, Download, RefreshCw, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PreviewPrintButton from '@/components/common/PreviewPrintButton';

interface PerformanceData {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
}

const StatsPage = () => {
  const [pageTitle, setPageTitle] = useState('Estatísticas e Análises de Piscinas');
  const [pageDescription, setPageDescription] = useState('Visualize e analise os dados do seu negócio de piscinas de fibra');
  const [activeView, setActiveView] = useState<'performance' | 'harvest' | 'detailed'>('performance');
  const [lastSyncDate, setLastSyncDate] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [connectedModules] = useState<string[]>(['piscinas', 'estoque', 'financeiro']);
  
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  
  useEffect(() => {
    console.log('Página de estatísticas carregada com sucesso');
    console.log(`Módulos conectados: ${connectedModules.join(', ')}`);
  }, [connectedModules]);
  
  const syncData = () => {
    setIsSyncing(true);
    console.log('Sincronizando dados dos módulos...');
    
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncDate(new Date());
      console.log('Dados sincronizados com sucesso');
    }, 2000);
  };
  
  const columns: Column[] = [
    { id: 'name', header: 'Indicador', accessorKey: 'name', isEditable: true },
    { id: 'current', header: 'Valor atual', accessorKey: 'current', type: 'number', isEditable: true },
    { id: 'target', header: 'Meta', accessorKey: 'target', type: 'number', isEditable: true },
    { id: 'unit', header: 'Unidade', accessorKey: 'unit', isEditable: true },
  ];
  
  const handleTableUpdate = (rowIndex: number, columnId: string, value: any) => {
    const newData = [...performanceData];
    const updatedRow = { ...newData[rowIndex] } as PerformanceData;
    
    if (columnId === 'current' || columnId === 'target') {
      updatedRow[columnId as 'current' | 'target'] = Number(value);
    } else if (columnId === 'name' || columnId === 'unit') {
      updatedRow[columnId as 'name' | 'unit'] = String(value);
    }
    
    newData[rowIndex] = updatedRow;
    setPerformanceData(newData);
    console.log(`Indicador ${updatedRow.name} atualizado`);
  };
  
  const handleDeleteRow = (rowIndex: number) => {
    const newData = [...performanceData];
    const deletedItem = newData[rowIndex];
    newData.splice(rowIndex, 1);
    setPerformanceData(newData);
    console.log(`Indicador ${deletedItem.name} excluído`);
  };
  
  const handleAddRow = (newRow: Record<string, any>) => {
    const typedRow: PerformanceData = {
      id: `perf_${Date.now()}`,
      name: String(newRow.name || 'Novo Indicador'),
      current: Number(newRow.current || 0),
      target: Number(newRow.target || 0),
      unit: String(newRow.unit || '%'),
    };
    setPerformanceData([...performanceData, typedRow]);
    console.log(`Indicador ${typedRow.name} adicionado`);
  };

  const handleTitleChange = (value: string | number) => {
    setPageTitle(String(value));
  };

  const handleDescriptionChange = (value: string | number) => {
    setPageDescription(String(value));
  };
  
  const handleViewChange = (view: 'performance' | 'harvest' | 'detailed') => {
    setActiveView(view);
    console.log(`Visualização alterada para: ${view}`);
  };
  
  const handleExportData = () => {
    console.log('Dados exportados com sucesso');
  };

  return (
    <StatisticsProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Navbar />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6 animate-enter">
            <motion.header 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4"
            >
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  <EditableField
                    value={pageTitle}
                    onSave={handleTitleChange}
                    className="inline-block"
                  />
                </h1>
                <p className="text-muted-foreground">
                  <EditableField
                    value={pageDescription}
                    onSave={handleDescriptionChange}
                    className="inline-block"
                  />
                </p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <span className="mr-2">Módulos: {connectedModules.join(', ')}</span>
                  <span>Última sincronização: {lastSyncDate.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handleViewChange('performance')}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${
                    activeView === 'performance' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <PieChart className="h-4 w-4 mr-1.5" />
                  Indicadores
                </button>
                
                <button 
                  onClick={() => handleViewChange('harvest')}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${
                    activeView === 'harvest' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <BarChart className="h-4 w-4 mr-1.5" />
                  Vendas
                </button>
                
                <button 
                  onClick={() => handleViewChange('detailed')}
                  className={`px-3 py-1.5 rounded-md flex items-center text-sm transition-colors ${
                    activeView === 'detailed' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 mr-1.5" />
                  Detalhado
                </button>
                
                <PreviewPrintButton
                  data={performanceData}
                  moduleName="performance-indicators"
                  title="Indicadores de Performance"
                  columns={[
                    { key: "name", header: "Indicador" },
                    { key: "current", header: "Valor atual" },
                    { key: "target", header: "Meta" },
                    { key: "unit", header: "Unidade" }
                  ]}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                  variant="ghost"
                />
                
                <button 
                  onClick={handleExportData}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Download className="h-4 w-4 mr-1.5" />
                  Exportar
                </button>
                
                <button 
                  onClick={syncData}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                  disabled={isSyncing}
                >
                  <RefreshCw className={`h-4 w-4 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Sync...' : 'Sync'}
                </button>
                
                <button 
                  onClick={() => console.log('Alertas configurados')}
                  className="px-3 py-1.5 rounded-md flex items-center text-sm bg-muted hover:bg-muted/80 transition-colors"
                >
                  <Bell className="h-4 w-4 mr-1.5" />
                  Alertas
                </button>
              </div>
            </motion.header>
            
            {activeView === 'performance' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <ChartConfig 
                  title="Indicadores de Performance"
                  description="Acompanhe suas performances em relação às suas metas"
                  onTitleChange={() => console.log('Título atualizado')}
                  onDescriptionChange={() => console.log('Descrição atualizada')}
                  onOptionsChange={() => console.log('Opções atualizadas')}
                  className="mb-6"
                >
                  <div className="p-4">
                    {performanceData.length > 0 ? (
                      <EditableTable
                        data={performanceData}
                        columns={columns}
                        onUpdate={handleTableUpdate}
                        onDelete={handleDeleteRow}
                        onAdd={handleAddRow}
                        className="border-0"
                      />
                    ) : (
                      <div className="text-center py-12">
                        <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Nenhum indicador configurado
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Adicione indicadores para monitorar sua performance
                        </p>
                        <Button onClick={() => handleAddRow({})}>
                          Adicionar Primeiro Indicador
                        </Button>
                      </div>
                    )}
                  </div>
                </ChartConfig>
              </motion.div>
            )}
            
            {activeView === 'harvest' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SimpleHarvestTracking />
              </motion.div>
            )}
            
            {activeView === 'detailed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SimpleStatistics />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </StatisticsProvider>
  );
};

export default StatsPage;
