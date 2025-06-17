
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FinancialSummary from '../components/finance/FinancialSummary';
import FinancialDataFilter from '../components/finance/FinancialDataFilter';
import FinancialTracking from '../components/FinancialTracking';
import { motion } from 'framer-motion';
import { useFinancial } from '@/hooks/use-financial';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileBarChart, TrendingUp, Calculator } from 'lucide-react';
import { EditableField } from '@/components/ui/editable-field';

const FinancePage = () => {
  const [pageTitle, setPageTitle] = useState('Controle Financeiro - Exclusive Piscinas');
  const [pageDescription, setPageDescription] = useState('Gerencie receitas, despesas e fluxo de caixa da empresa');
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'reports'>('overview');
  const [timeFrame, setTimeFrame] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const { 
    transactions, 
    loading, 
    totalRevenue, 
    totalExpenses, 
    netProfit,
    refetch 
  } = useFinancial();

  const categories = [
    'all',
    'Vendas de Piscinas',
    'Materiais',
    'Mão de Obra',
    'Equipamentos',
    'Marketing',
    'Administrativo',
    'Manutenção'
  ];

  const handleTitleChange = (value: string | number) => {
    setPageTitle(String(value));
  };

  const handleDescriptionChange = (value: string | number) => {
    setPageDescription(String(value));
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setTimeFrame('month');
    setCategoryFilter('all');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 overflow-y-auto"
      >
        <div className="p-6">
          <motion.header 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold mb-2">
              <EditableField
                value={pageTitle}
                onSave={handleTitleChange}
                className="inline-block"
              />
            </h1>
            <p className="text-muted-foreground text-lg">
              <EditableField
                value={pageDescription}
                onSave={handleDescriptionChange}
                className="inline-block"
              />
            </p>
          </motion.header>

          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md flex items-center text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Visão Geral
            </button>
            
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-md flex items-center text-sm transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Transações
            </button>
            
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-md flex items-center text-sm transition-colors ${
                activeTab === 'reports'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <FileBarChart className="h-4 w-4 mr-2" />
              Relatórios
            </button>
          </div>

          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <FinancialDataFilter
                timeFrame={timeFrame}
                setTimeFrame={setTimeFrame}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
                onRefresh={handleRefresh}
                onClearFilters={handleClearFilters}
              />
              
              <FinancialSummary
                totalIncome={totalRevenue}
                totalExpenses={totalExpenses}
                period={timeFrame === 'month' ? 'este mês' : timeFrame === 'year' ? 'este ano' : ''}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Calculator className="h-5 w-5 mr-2 text-blue-600" />
                      Vendas de Piscinas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground mb-4">
                        Adicione suas primeiras vendas para começar a visualizar os dados
                      </p>
                      <Button 
                        onClick={() => setActiveTab('transactions')}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Venda
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                      Projetos em Andamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground mb-4">
                        Acompanhe o progresso financeiro dos seus projetos
                      </p>
                      <p className="text-2xl font-bold text-muted-foreground">0</p>
                      <p className="text-xs text-muted-foreground mt-1">projetos ativos</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <FileBarChart className="h-5 w-5 mr-2 text-purple-600" />
                      Margem de Lucro
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-3xl font-bold text-green-600">
                        {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0'}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">margem atual</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FinancialTracking />
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Relatórios Financeiros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileBarChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Relatórios em Desenvolvimento
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Esta seção estará disponível em breve com relatórios detalhados
                    </p>
                    <Button 
                      onClick={() => setActiveTab('transactions')}
                      variant="outline"
                    >
                      Adicionar Dados Primeiro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FinancePage;
