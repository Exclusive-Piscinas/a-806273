
import React, { useState } from 'react';
import { CultureDetailTable } from './CultureDetailTable';
import { Button } from './ui/button';
import { Plus, Download, Upload, Filter, Search, FileUp, Eye, Printer } from 'lucide-react';
import { Input } from './ui/input';
import { useCRM } from '../contexts/CRMContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';
import PreviewPrintButton from './common/PreviewPrintButton';

const GuadeloupeSpecificCrops = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { exportModuleData, importModuleData, getModuleData } = useCRM();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Get cultures data for preview/print - EMPTY INITIAL STATE
  const culturesData = [];

  const handleAddCulture = () => {
    setShowAddForm(true);
    console.log("Abertura do formulário de adição de piscina");
  };

  const handleExportData = async (format: 'csv' | 'pdf' = 'csv') => {
    console.log(`Exportação em andamento no formato ${format}...`);
    const success = await exportModuleData('cultures', format);
    
    if (success) {
      console.log(`Os dados das piscinas foram exportados em ${format.toUpperCase()}`);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(`Importação ${file.name} em andamento...`);
      const success = await importModuleData('cultures', file);
      
      if (success) {
        console.log("Importação bem-sucedida - Os dados das piscinas foram atualizados");
      }
    }
  };

  const filterOptions = [
    { value: 'all', label: 'Todas as piscinas' },
    { value: 'pequena', label: 'Piscinas Pequenas' },
    { value: 'media', label: 'Piscinas Médias' },
    { value: 'grande', label: 'Piscinas Grandes' },
    { value: 'olimpica', label: 'Piscinas Olímpicas' },
    { value: 'spa', label: 'Spas/Jacuzzis' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Gestão de Piscinas</h2>
          <p className="text-muted-foreground">Gerencie seus projetos e tipos de piscinas</p>
        </div>
        <div className="flex space-x-2">
          <PreviewPrintButton 
            data={culturesData}
            moduleName="cultures"
            title="Gestão de Piscinas"
            columns={[
              { key: "nome", header: "Nome" },
              { key: "tipo", header: "Tipo" },
              { key: "tamanho", header: "Tamanho" },
              { key: "status", header: "Status" }
            ]}
          />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="transition-colors hover:bg-gray-100">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
              <DropdownMenuItem onClick={() => handleExportData('csv')} className="cursor-pointer">
                Exportar CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportData('pdf')} className="cursor-pointer">
                Exportar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="transition-colors hover:bg-gray-100">
                <Upload className="mr-2 h-4 w-4" />
                Importar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
              <DropdownMenuItem onClick={handleImportClick} className="cursor-pointer">
                <FileUp className="mr-2 h-4 w-4" />
                Selecionar arquivo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
          />
          
          <Button 
            onClick={handleAddCulture} 
            className="transition-colors hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Piscina
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Pesquisar piscina..." 
            className="pl-10 transition-all focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <select 
            className={cn(
              "h-10 appearance-none pl-3 pr-10 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-white transition-all"
            )}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border p-6 mb-6 shadow-sm"
      >
        <CultureDetailTable 
          showAddForm={showAddForm} 
          setShowAddForm={setShowAddForm} 
          searchTerm={searchTerm}
          filterType={filterType}
        />
      </motion.div>
    </motion.div>
  );
};

export default GuadeloupeSpecificCrops;
