
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  FileText, 
  Download, 
  Upload, 
  Plus, 
  Search,
  Eye,
  Edit,
  Trash2,
  File,
  Receipt,
  BarChart3,
  Calendar,
  User
} from 'lucide-react';
import { DatePickerWithRange } from '../components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import usePageMetadata from '../hooks/use-page-metadata';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'invoice' | 'report';
  status: 'active' | 'pending' | 'archived';
  createdAt: string;
  size: string;
  client?: string;
}

const DocumentsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { t } = useLanguage();

  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Documentos',
    defaultDescription: 'Gerencie contratos, faturas e relatórios'
  });

  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Contrato - Piscina Residencial Silva',
      type: 'contract',
      status: 'active',
      createdAt: '2024-01-15',
      size: '2.3 MB',
      client: 'João Silva'
    },
    {
      id: '2',
      name: 'Fatura #2024-001',
      type: 'invoice',
      status: 'pending',
      createdAt: '2024-01-14',
      size: '1.2 MB',
      client: 'Maria Santos'
    },
    {
      id: '3',
      name: 'Relatório Mensal - Janeiro 2024',
      type: 'report',
      status: 'active',
      createdAt: '2024-01-13',
      size: '5.1 MB'
    }
  ]);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.client?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || doc.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'contract': return 'Contrato';
      case 'invoice': return 'Fatura';
      case 'report': return 'Relatório';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contract': return <File className="h-5 w-5" />;
      case 'invoice': return <Receipt className="h-5 w-5" />;
      case 'report': return <BarChart3 className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'archived': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'archived': return 'Arquivado';
      default: return status;
    }
  };

  const handleAddDocument = () => {
    console.log('Adicionar novo documento');
  };

  const handleViewDocument = (doc: Document) => {
    console.log('Visualizar documento:', doc);
  };

  const handleEditDocument = (doc: Document) => {
    console.log('Editar documento:', doc);
  };

  const handleDeleteDocument = (doc: Document) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      console.log('Excluir documento:', doc);
    }
  };

  const renderTabActions = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Importar
        </Button>
        <Button onClick={handleAddDocument} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Documento
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
            placeholder="Pesquisar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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

  const DocumentList = () => (
    <div className="space-y-4">
      {filteredDocuments.length > 0 ? (
        filteredDocuments.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                      {getTypeIcon(doc.type)}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{doc.name}</h3>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className={getStatusColor(doc.status)}>
                          {getStatusLabel(doc.status)}
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                          {getTypeLabel(doc.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(doc.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{doc.size}</span>
                        </div>
                        {doc.client && (
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{doc.client}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDocument(doc)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditDocument(doc)}
                      className="text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-200"
        >
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            {searchTerm ? 'Nenhum documento encontrado' : 'Nenhum documento cadastrado'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
            {searchTerm 
              ? 'Tente ajustar os termos de busca para encontrar o documento desejado'
              : 'Comece adicionando seus primeiros documentos para organizar melhor seu negócio'
            }
          </p>
          {!searchTerm && (
            <Button onClick={handleAddDocument} size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Primeiro Documento
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );

  const tabs: TabItem[] = [
    {
      value: 'all',
      label: 'Todos os Documentos',
      content: <DocumentList />
    },
    {
      value: 'contract',
      label: 'Contratos',
      content: <DocumentList />
    },
    {
      value: 'invoice',
      label: 'Faturas',
      content: <DocumentList />
    },
    {
      value: 'report',
      label: 'Relatórios',
      content: <DocumentList />
    }
  ];

  return (
    <PageLayout>
      <div className="p-6 space-y-6">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          actions={renderTabActions()}
          icon={<FileText className="h-6 w-6" />}
          filterArea={renderFilterArea()}
        />

        <TabContainer 
          tabs={tabs} 
          defaultValue={activeTab} 
          onValueChange={setActiveTab} 
        />
      </div>
    </PageLayout>
  );
};

export default DocumentsPage;
