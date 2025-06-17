
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  FileText, 
  Download, 
  Upload, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  FileContract,
  Receipt,
  BarChart3
} from 'lucide-react';
import { DatePickerWithRange } from '../components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

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
      case 'contract': return <FileContract className="h-4 w-4" />;
      case 'invoice': return <Receipt className="h-4 w-4" />;
      case 'report': return <BarChart3 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Importar
        </Button>
        <Button onClick={handleAddDocument}>
          <Plus className="mr-2 h-4 w-4" />
          {t('documents.add')}
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
            className="pl-8"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getTypeIcon(doc.type)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{getTypeLabel(doc.type)}</Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {getStatusLabel(doc.status)}
                      </Badge>
                      {doc.client && (
                        <span className="text-sm text-gray-500">Cliente: {doc.client}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{new Date(doc.createdAt).toLocaleDateString('pt-BR')}</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDocument(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditDocument(doc)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDocument(doc)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-3">
            {searchTerm ? 'Nenhum documento encontrado' : 'Nenhum documento cadastrado'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm 
              ? 'Tente ajustar os termos de busca'
              : 'Comece adicionando seus primeiros documentos para organizar melhor seu negócio'
            }
          </p>
          {!searchTerm && (
            <Button onClick={handleAddDocument} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Primeiro Documento
            </Button>
          )}
        </div>
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
      label: t('documents.contracts'),
      content: <DocumentList />
    },
    {
      value: 'invoice',
      label: t('documents.invoices'),
      content: <DocumentList />
    },
    {
      value: 'report',
      label: t('documents.reports'),
      content: <DocumentList />
    }
  ];

  return (
    <PageLayout>
      <div className="p-6">
        <PageHeader 
          title={t('documents.title')}
          description={t('documents.subtitle')}
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
