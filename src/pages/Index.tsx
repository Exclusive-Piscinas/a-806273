
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Sprout, 
  Package, 
  Wallet, 
  BarChart2,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Waves,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageLayout from '@/components/layout/PageLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePools } from '@/hooks/use-pools';
import { useInventory } from '@/hooks/use-inventory';
import { useFinancial } from '@/hooks/use-financial';

const Index = () => {
  const { t } = useLanguage();
  const { pools, loading: poolsLoading } = usePools();
  const { items, lowStockItems, totalValue, loading: inventoryLoading } = useInventory();
  const { totalRevenue, totalExpenses, netProfit, transactions, loading: financialLoading } = useFinancial();

  const activePools = pools.filter(pool => ['orcamento', 'aprovado', 'em_construcao'].includes(pool.status));
  const pendingMaintenance = pools.filter(pool => pool.status === 'em_construcao');
  const pendingTransactions = transactions.filter(tx => tx.status === 'pendente');

  // Safe number formatting with fallbacks
  const formatCurrency = (value: number | undefined) => {
    return (value || 0).toLocaleString('pt-BR');
  };

  const formatPercentage = (value: number | undefined) => {
    return Math.round(value || 0);
  };

  return (
    <PageLayout>
      <div className="space-y-6 animate-enter">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Waves className="h-8 w-8 text-blue-600" />
            {t('dashboard.welcome')} - Exclusive Piscinas
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Sistema completo de gestão para seu negócio de piscinas
          </p>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Projetos Ativos</CardTitle>
              <MapPin className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{activePools.length}</div>
              <p className="text-xs text-blue-700 mt-1">
                {pools.length === 0 ? 'Nenhum projeto cadastrado' : `${pools.length} total de projetos`}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Em Construção</CardTitle>
              <Sprout className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{pendingMaintenance.length}</div>
              <p className="text-xs text-orange-700 mt-1">
                {pendingMaintenance.length === 0 ? 'Nenhuma obra em andamento' : 'Projetos em execução'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Valor do Estoque</CardTitle>
              <Package className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                R$ {formatCurrency(totalValue)}
              </div>
              <p className="text-xs text-purple-700 mt-1">
                {items.length} itens • {lowStockItems?.length || 0} em falta
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Lucro Líquido</CardTitle>
              <Wallet className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                R$ {formatCurrency(netProfit)}
              </div>
              <p className="text-xs text-green-700 mt-1">
                {pendingTransactions.length} transações pendentes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resumo Financeiro */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                <TrendingUp className="h-5 w-5" />
                Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                R$ {formatCurrency(totalRevenue)}
              </div>
              <p className="text-sm text-gray-600">Total de receitas pagas</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                <DollarSign className="h-5 w-5" />
                Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-2">
                R$ {formatCurrency(totalExpenses)}
              </div>
              <p className="text-sm text-gray-600">Total de despesas pagas</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                <BarChart2 className="h-5 w-5" />
                Margem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {totalRevenue && totalRevenue > 0 ? formatPercentage((netProfit || 0) / totalRevenue * 100) : 0}%
              </div>
              <p className="text-sm text-gray-600">Margem de lucro</p>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {t('dashboard.quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 border-blue-200">
                <Link to="/parcelles">
                  <Waves className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium">Gerenciar Projetos</span>
                  <span className="text-xs text-gray-500">Piscinas e orçamentos</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-orange-50 border-orange-200">
                <Link to="/cultures">
                  <Calendar className="h-6 w-6 text-orange-600" />
                  <span className="text-sm font-medium">Cronograma</span>
                  <span className="text-xs text-gray-500">Manutenções e obras</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 border-purple-200">
                <Link to="/inventaire">
                  <Package className="h-6 w-6 text-purple-600" />
                  <span className="text-sm font-medium">Controle de Estoque</span>
                  <span className="text-xs text-gray-500">Materiais e produtos</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 border-green-200">
                <Link to="/finances">
                  <Wallet className="h-6 w-6 text-green-600" />
                  <span className="text-sm font-medium">Gestão Financeira</span>
                  <span className="text-xs text-gray-500">Receitas e despesas</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alertas e Atividade Recente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Alertas e Notificações
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(lowStockItems?.length || 0) > 0 || pendingTransactions.length > 0 ? (
                <div className="space-y-3">
                  {(lowStockItems?.length || 0) > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          {lowStockItems?.length || 0} itens com estoque baixo
                        </p>
                        <p className="text-xs text-yellow-600">
                          Verifique o estoque de materiais
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {pendingTransactions.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          {pendingTransactions.length} transações pendentes
                        </p>
                        <p className="text-xs text-blue-600">
                          Atualize o status dos pagamentos
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600">
                    Nenhum alerta no momento. Seu sistema está funcionando perfeitamente!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Projetos Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pools.length > 0 ? (
                <div className="space-y-3">
                  {pools.slice(0, 3).map((pool) => (
                    <div key={pool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{pool.nome_cliente}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {pool.tipo_piscina}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(pool.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      <Badge className={`text-xs ${
                        pool.status === 'finalizado' ? 'bg-green-100 text-green-800' :
                        pool.status === 'em_construcao' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {pool.status === 'finalizado' ? 'Finalizado' :
                         pool.status === 'em_construcao' ? 'Em construção' :
                         pool.status === 'aprovado' ? 'Aprovado' :
                         pool.status === 'orcamento' ? 'Orçamento' : 'Cancelado'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">
                    Nenhum projeto cadastrado. Comece criando seu primeiro projeto de piscina!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
