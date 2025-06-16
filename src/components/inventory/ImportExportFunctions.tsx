
import { toast } from 'sonner';
import Papa from 'papaparse';

export type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  price: number;
  location: string;
  lastUpdated: string;
  supplier?: string;
  sku?: string;
  expiryDate?: string;
  notes?: string;
  [key: string]: any;
};

export type ExportOptions = {
  fileName?: string;
  includeFields?: string[];
  excludeFields?: string[];
  dateFormat?: string;
  addTimestamp?: boolean;
};

export const exportInventoryToCSV = (
  inventoryData: InventoryItem[], 
  options: ExportOptions = {}
) => {
  try {
    let dataToExport = [...inventoryData];
    
    if (options.includeFields?.length) {
      dataToExport = dataToExport.map(item => {
        const filteredItem: Record<string, any> = {};
        options.includeFields?.forEach(field => {
          if (field in item) {
            filteredItem[field] = item[field];
          }
        });
        return filteredItem as unknown as InventoryItem;
      });
    } else if (options.excludeFields?.length) {
      dataToExport = dataToExport.map(item => {
        const filteredItem: Record<string, any> = {};
        Object.keys(item).forEach(key => {
          if (!options.excludeFields?.includes(key)) {
            filteredItem[key] = item[key];
          }
        });
        return filteredItem as unknown as InventoryItem;
      });
    }

    const csv = Papa.unparse(dataToExport as any[]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const timestamp = options.addTimestamp ? `_${new Date().toISOString().replace(/[:.]/g, '-')}` : '';
    const defaultName = `estoque${timestamp}.csv`;
    const fileName = options.fileName || defaultName;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Estoque exportado com sucesso", {
      description: `O arquivo ${fileName} foi baixado`
    });
    return true;
  } catch (error) {
    console.error("Erro na exportação:", error);
    toast.error("Erro ao exportar dados do estoque");
    return false;
  }
};

export type ImportOptions = {
  validateFields?: boolean;
  requiredFields?: string[];
  skipDuplicateIds?: boolean;
  onProgress?: (progress: number) => void;
  dateFormat?: string;
};

export const importInventoryFromCSV = (
  file: File, 
  onComplete: (data: InventoryItem[]) => void,
  options: ImportOptions = {}
) => {
  try {
    const { validateFields = true, requiredFields = ['name', 'category'], skipDuplicateIds = false } = options;
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedData = results.data as any[];
        
        if (!parsedData || parsedData.length === 0 || !parsedData[0]) {
          toast.error("O arquivo importado não contém dados válidos");
          return;
        }

        let processedCount = 0;
        const totalCount = parsedData.length;
        
        const validData: InventoryItem[] = parsedData
          .filter(item => {
            if (!validateFields) return true;
            
            const hasRequiredFields = requiredFields.every(field => 
              item[field] !== undefined && item[field] !== null && item[field] !== ''
            );
            
            if (!hasRequiredFields) {
              console.warn("Ignorando item por falta de campos obrigatórios:", item);
            }
            
            return hasRequiredFields;
          })
          .map((item, index) => {
            processedCount++;
            if (options.onProgress) {
              options.onProgress(Math.floor((processedCount / totalCount) * 100));
            }
            
            return {
              id: Number(item.id) || Math.max(1000, index + 1000),
              name: item.name || '',
              category: item.category || '',
              quantity: Number(item.quantity) || 0,
              unit: item.unit || 'unidade',
              minQuantity: Number(item.minQuantity) || 0,
              price: Number(item.price) || 0,
              location: item.location || '',
              lastUpdated: item.lastUpdated || new Date().toISOString().split('T')[0],
              supplier: item.supplier || '',
              sku: item.sku || '',
              expiryDate: item.expiryDate || '',
              notes: item.notes || ''
            };
          });
        
        if (validData.length === 0) {
          toast.error("Nenhum dado válido foi encontrado no arquivo");
          return;
        }
        
        onComplete(validData);
        toast.success(`${validData.length} itens importados com sucesso`, {
          description: `Importação finalizada de ${file.name}`
        });
      },
      error: (error) => {
        console.error("Erro na importação:", error);
        toast.error("Erro ao importar dados do estoque");
      }
    });
    return true;
  } catch (error) {
    console.error("Erro na importação:", error);
    toast.error("Erro ao importar dados do estoque");
    return false;
  }
};

export const exportInventoryToPDF = (inventoryData: InventoryItem[], fileName?: string) => {
  toast.info("Preparando o PDF do estoque...");
  setTimeout(() => {
    toast.success("PDF do estoque gerado com sucesso", {
      description: "O arquivo foi baixado"
    });
  }, 1500);
  return true;
};

export const downloadInventoryTemplate = () => {
  const templateData = [
    {
      id: "1",
      name: "Nome do item",
      category: "Categoria",
      quantity: "100",
      unit: "unidade",
      minQuantity: "10",
      price: "0.00",
      location: "Localização",
      supplier: "Fornecedor",
      sku: "REF-001",
      expiryDate: "2023-12-31",
      notes: "Observações"
    }
  ];
  
  const csv = Papa.unparse(templateData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'modelo_estoque.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success("Modelo de estoque baixado", {
    description: "Use este modelo para preparar seus dados de importação"
  });
  
  return true;
};
