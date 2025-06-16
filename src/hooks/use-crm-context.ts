
import { useState, useEffect, useCallback } from 'react';
import { exportToCSV, exportToExcel, exportToPDF, importFromCSV, printData } from '../utils/crm-data-operations';

// Types para o contexto CRM global
interface CRMContextState {
  lastSync: Date;
  isRefreshing: boolean;
  companyName: string;
  activeModules: string[];
  syncDataAcrossCRM: () => void;
  updateModuleData: (moduleName: string, data: any) => void;
  getModuleData: (moduleName: string) => any;
  exportModuleData: (moduleName: string, format: 'csv' | 'excel' | 'pdf', customData?: any[]) => Promise<boolean>;
  importModuleData: (moduleName: string, file: File) => Promise<boolean>;
  printModuleData: (moduleName: string, options?: any) => Promise<boolean>;
}

// Hook personalizado para gerenciar o contexto global do CRM
export const useCRMContext = (): CRMContextState => {
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [moduleData, setModuleData] = useState<Record<string, any>>({
    piscinas: {
      items: [],
      columns: [
        { key: "id", header: "ID" },
        { key: "nome", header: "Nome" },
        { key: "tamanho", header: "Tamanho" },
        { key: "tipo", header: "Tipo" },
        { key: "status", header: "Status" }
      ]
    },
    manutencoes: {
      items: [],
      columns: [
        { key: "id", header: "ID" },
        { key: "nome", header: "Manutenção" },
        { key: "tipo", header: "Tipo" },
        { key: "dataInicio", header: "Data de Início" },
        { key: "dataFim", header: "Data de Fim" }
      ]
    },
    financeiro: {
      items: [],
      columns: [
        { key: "id", header: "ID" },
        { key: "data", header: "Data" },
        { key: "tipo", header: "Tipo" },
        { key: "descricao", header: "Descrição" },
        { key: "valor", header: "Valor (R$)" }
      ]
    },
    estatisticas: {
      items: [],
      columns: [
        { key: "periodo", header: "Período" },
        { key: "produtoId", header: "Produto ID" },
        { key: "vendas", header: "Vendas" },
        { key: "receitas", header: "Receitas (R$)" },
        { key: "custos", header: "Custos (R$)" }
      ]
    },
    estoque: {
      items: [],
      columns: [
        { key: "id", header: "ID" },
        { key: "nome", header: "Nome" },
        { key: "categoria", header: "Categoria" },
        { key: "quantidade", header: "Quantidade" },
        { key: "unidade", header: "Unidade" },
        { key: "preco", header: "Preço unitário (R$)" }
      ]
    }
  });
  const [activeModules, setActiveModules] = useState<string[]>([
    'piscinas',
    'manutencoes',
    'financeiro',
    'estatisticas',
    'estoque'
  ]);
  
  // Nome da empresa
  const companyName = 'Exclusive Piscinas';

  // Sincronização dos dados através de todos os módulos do CRM
  const syncDataAcrossCRM = useCallback(() => {
    setIsRefreshing(true);
    
    // Simular um tempo de sincronização
    setTimeout(() => {
      setLastSync(new Date());
      setIsRefreshing(false);
    }, 1500);
  }, []);

  // Atualizar os dados de um módulo específico
  const updateModuleData = useCallback((moduleName: string, data: any) => {
    setModuleData(prevData => ({
      ...prevData,
      [moduleName]: {
        ...prevData[moduleName],
        ...data
      }
    }));
    
    // Atualizar a data de última sincronização
    setLastSync(new Date());
  }, []);

  // Recuperar os dados de um módulo específico
  const getModuleData = useCallback((moduleName: string) => {
    return moduleData[moduleName] || { items: [], columns: [] };
  }, [moduleData]);

  // Export module data to specified format
  const exportModuleData = useCallback(async (
    moduleName: string, 
    format: 'csv' | 'excel' | 'pdf',
    customData?: any[]
  ): Promise<boolean> => {
    // Use custom data if provided, otherwise get from module
    const data = customData || getModuleData(moduleName)?.items;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log(`Nenhum dado encontrado para exportar do módulo ${moduleName}`);
      return true; // Return true para não mostrar erro quando não há dados
    }
    
    try {
      let success = false;
      
      // Handle special cases like technical sheets and guides
      if (moduleName === 'fiche_technique') {
        return await exportToPDF(data, `${companyName}_fiche_technique`, {
          title: `${companyName} - Ficha Técnica`,
          landscape: false,
          template: 'technical_sheet'
        });
      }
      
      // Standard formats
      switch (format) {
        case 'csv':
          success = exportToCSV(data, `${companyName}_${moduleName}`);
          break;
        case 'excel':
          success = exportToExcel(data, `${companyName}_${moduleName}`);
          break;
        case 'pdf':
          success = await exportToPDF(data, `${companyName}_${moduleName}`);
          break;
        default:
          return false;
      }
      
      return success;
    } catch (error) {
      console.error(`Erro ao exportar dados do ${moduleName}:`, error);
      return false;
    }
  }, [getModuleData, companyName]);

  // Import module data
  const importModuleData = useCallback(async (moduleName: string, file: File): Promise<boolean> => {
    try {
      const importedData = await importFromCSV(file);
      
      if (importedData && importedData.length > 0) {
        updateModuleData(moduleName, {
          items: importedData
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Erro ao importar dados do ${moduleName}:`, error);
      return false;
    }
  }, [updateModuleData]);

  // Print module data
  const printModuleData = useCallback(async (moduleName: string, options?: any): Promise<boolean> => {
    const data = getModuleData(moduleName);
    
    if (!data || !data.items || !Array.isArray(data.items) || data.items.length === 0) {
      console.log(`Nenhum dado encontrado para imprimir do módulo ${moduleName}`);
      return true; // Return true para não mostrar erro quando não há dados
    }
    
    const moduleNames: Record<string, string> = {
      piscinas: "Piscinas",
      manutencoes: "Manutenções",
      financeiro: "Financeiro",
      estatisticas: "Estatísticas",
      estoque: "Estoque"
    };
    
    const title = `${companyName} - ${moduleNames[moduleName] || moduleName}`;
    
    try {
      return await printData(
        data.items,
        title,
        data.columns || Object.keys(data.items[0]).map(key => ({ key, header: key })),
        options
      );
    } catch (error) {
      console.error(`Erro ao imprimir dados do ${moduleName}:`, error);
      return false;
    }
  }, [getModuleData, companyName]);

  return {
    lastSync,
    isRefreshing,
    companyName,
    activeModules,
    syncDataAcrossCRM,
    updateModuleData,
    getModuleData,
    exportModuleData,
    importModuleData,
    printModuleData
  };
};

export default useCRMContext;
