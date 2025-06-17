
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Navbar
    'nav.dashboard': 'Painel Principal',
    'nav.pools': 'Piscinas',
    'nav.maintenance': 'Manutenções',
    'nav.inventory': 'Estoque',
    'nav.finance': 'Financeiro',
    'nav.reports': 'Relatórios',
    'nav.documents': 'Documentos',
    'nav.settings': 'Configurações',
    'nav.user': 'Usuário',
    'nav.logout': 'Sair',
    'nav.toggleTheme': 'Alternar tema',
    'nav.toggleNav': 'Alternar navegação',
    
    // Auth
    'auth.welcome': 'Bem-vindo ao Exclusive Piscinas',
    'auth.subtitle': 'Sistema de Gestão de Piscinas de Fibra',
    'auth.email': 'Email',
    'auth.password': 'Senha',
    'auth.fullName': 'Nome Completo',
    'auth.login': 'Entrar',
    'auth.register': 'Criar Conta',
    'auth.loginTitle': 'Fazer Login',
    'auth.registerTitle': 'Criar Nova Conta',
    'auth.switchToRegister': 'Não tem uma conta? Cadastre-se',
    'auth.switchToLogin': 'Já tem uma conta? Entre aqui',
    'auth.loading': 'Carregando...',
    'auth.loginSuccess': 'Login realizado com sucesso!',
    'auth.registerSuccess': 'Conta criada com sucesso!',
    'auth.registerSuccessDesc': 'Verifique seu email para confirmar a conta.',
    'auth.loginError': 'Erro ao fazer login',
    'auth.registerError': 'Erro ao criar conta',
    'auth.logoutSuccess': 'Logout realizado com sucesso!',
    'auth.logoutError': 'Erro ao sair',
    
    // Dashboard
    'dashboard.welcome': 'Bem-vindo ao seu painel de piscinas',
    'dashboard.subtitle': 'Gerencie suas piscinas e operações de forma eficiente',
    'dashboard.quickActions': 'Ações Rápidas',
    'dashboard.viewPools': 'Ver Piscinas',
    'dashboard.addMaintenance': 'Adicionar Manutenção',
    'dashboard.manageInventory': 'Gerenciar Estoque',
    'dashboard.viewReports': 'Ver Relatórios',
    
    // Finance
    'finance.title': 'Gestão Financeira',
    'finance.subtitle': 'Controle completo das finanças da sua empresa de piscinas',
    'finance.summary': 'Resumo Financeiro',
    'finance.income': 'Receitas',
    'finance.expenses': 'Despesas',
    'finance.balance': 'Saldo',
    'finance.tracking': 'Controle de Transações',
    'finance.budget': 'Planejamento Orçamentário',
    'finance.forecast': 'Previsões Financeiras',
    'finance.filters': 'Filtros',
    'finance.period': 'Período',
    'finance.category': 'Categoria',
    'finance.allPeriods': 'Todos os períodos',
    'finance.currentMonth': 'Mês atual',
    'finance.currentQuarter': 'Trimestre atual',
    'finance.currentYear': 'Ano atual',
    'finance.customPeriod': 'Período personalizado',
    'finance.allCategories': 'Todas as categorias',
    'finance.refresh': 'Atualizar',
    'finance.clear': 'Limpar',
    'finance.activeFilters': 'filtros ativos',
    'finance.totalIncome': 'Total de receitas',
    'finance.totalExpenses': 'Total de despesas',
    'finance.previousPeriod': 'período anterior',
    'finance.compared': 'comparado ao',
    
    // Inventory
    'inventory.title': 'Gestão de Estoque',
    'inventory.subtitle': 'Controle de materiais e equipamentos para piscinas',
    'inventory.items': 'Itens',
    'inventory.pools': 'Piscinas',
    'inventory.maintenance': 'Manutenção',
    'inventory.add': 'Adicionar Item',
    'inventory.search': 'Pesquisar',
    'inventory.export': 'Exportar',
    'inventory.import': 'Importar',
    'inventory.template': 'Baixar Modelo',
    
    // Pools
    'pools.title': 'Gestão de Piscinas',
    'pools.subtitle': 'Gerencie projetos e tipos de piscinas',
    'pools.projects': 'Projetos de Piscinas',
    'pools.add': 'Adicionar Piscina',
    'pools.search': 'Pesquisar piscina...',
    'pools.filter': 'Filtrar',
    'pools.all': 'Todas as piscinas',
    
    // Maintenance
    'maintenance.title': 'Manutenções',
    'maintenance.subtitle': 'Acompanhe e gerencie manutenções das piscinas',
    'maintenance.schedule': 'Programar Manutenção',
    'maintenance.history': 'Histórico',
    'maintenance.alerts': 'Alertas',
    
    // Documents
    'documents.title': 'Documentos',
    'documents.subtitle': 'Gerencie documentos e contratos da empresa',
    'documents.contracts': 'Contratos',
    'documents.invoices': 'Faturas',
    'documents.reports': 'Relatórios',
    'documents.add': 'Adicionar Documento',
    
    // Statistics
    'stats.title': 'Estatísticas e Análises',
    'stats.subtitle': 'Visualize dados do seu negócio de piscinas',
    'stats.performance': 'Indicadores',
    'stats.sales': 'Vendas',
    'stats.detailed': 'Detalhado',
    'stats.export': 'Exportar',
    'stats.sync': 'Sincronizar',
    'stats.alerts': 'Alertas',
    
    // Language selector
    'language.select': 'Idioma',
    'language.portuguese': 'Português',
    'language.english': 'English',
  },
  en: {
    // Navbar
    'nav.dashboard': 'Dashboard',
    'nav.pools': 'Pools',
    'nav.maintenance': 'Maintenance',
    'nav.inventory': 'Inventory',
    'nav.finance': 'Finance',
    'nav.reports': 'Reports',
    'nav.documents': 'Documents',
    'nav.settings': 'Settings',
    'nav.user': 'User',
    'nav.logout': 'Logout',
    'nav.toggleTheme': 'Toggle theme',
    'nav.toggleNav': 'Toggle navigation',
    
    // Auth
    'auth.welcome': 'Welcome to Exclusive Piscinas',
    'auth.subtitle': 'Fiberglass Pool Management System',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.login': 'Login',
    'auth.register': 'Create Account',
    'auth.loginTitle': 'Login',
    'auth.registerTitle': 'Create New Account',
    'auth.switchToRegister': "Don't have an account? Sign up",
    'auth.switchToLogin': 'Already have an account? Sign in',
    'auth.loading': 'Loading...',
    'auth.loginSuccess': 'Login successful!',
    'auth.registerSuccess': 'Account created successfully!',
    'auth.registerSuccessDesc': 'Check your email to confirm your account.',
    'auth.loginError': 'Login error',
    'auth.registerError': 'Error creating account',
    'auth.logoutSuccess': 'Logout successful!',
    'auth.logoutError': 'Error logging out',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to your pool management panel',
    'dashboard.subtitle': 'Efficiently manage your pools and operations',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.viewPools': 'View Pools',
    'dashboard.addMaintenance': 'Add Maintenance',
    'dashboard.manageInventory': 'Manage Inventory',
    'dashboard.viewReports': 'View Reports',
    
    // Finance
    'finance.title': 'Financial Management',
    'finance.subtitle': 'Complete control of your pool company finances',
    'finance.summary': 'Financial Summary',
    'finance.income': 'Income',
    'finance.expenses': 'Expenses',
    'finance.balance': 'Balance',
    'finance.tracking': 'Transaction Tracking',
    'finance.budget': 'Budget Planning',
    'finance.forecast': 'Financial Forecast',
    'finance.filters': 'Filters',
    'finance.period': 'Period',
    'finance.category': 'Category',
    'finance.allPeriods': 'All periods',
    'finance.currentMonth': 'Current month',
    'finance.currentQuarter': 'Current quarter',
    'finance.currentYear': 'Current year',
    'finance.customPeriod': 'Custom period',
    'finance.allCategories': 'All categories',
    'finance.refresh': 'Refresh',
    'finance.clear': 'Clear',
    'finance.activeFilters': 'active filters',
    'finance.totalIncome': 'Total income',
    'finance.totalExpenses': 'Total expenses',
    'finance.previousPeriod': 'previous period',
    'finance.compared': 'compared to',
    
    // Language selector
    'language.select': 'Language',
    'language.portuguese': 'Português',
    'language.english': 'English',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
