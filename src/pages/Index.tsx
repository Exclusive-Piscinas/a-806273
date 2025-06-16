
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Droplets, Package, BarChart2 } from 'lucide-react';
import PageLayout from "@/components/layout/PageLayout";
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  const quickActions = [
    {
      title: t('dashboard.viewPools'),
      description: 'Gerencie suas piscinas de fibra',
      icon: MapPin,
      path: '/parcelles',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: t('dashboard.addMaintenance'),
      description: 'Adicione nova manutenção',
      icon: Droplets,
      path: '/cultures',
      color: 'bg-cyan-500 hover:bg-cyan-600'
    },
    {
      title: t('dashboard.manageInventory'),
      description: 'Controle produtos e equipamentos',
      icon: Package,
      path: '/inventaire',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: t('dashboard.viewReports'),
      description: 'Visualize relatórios de vendas',
      icon: BarChart2,
      path: '/statistiques',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.quickActions')}</CardTitle>
            <CardDescription>
              Acesse rapidamente as principais funcionalidades do sistema de piscinas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.path}>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all duration-200"
                  >
                    <div className={`p-3 rounded-full ${action.color} text-white`}>
                      <action.icon size={24} />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-sm text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Index;
