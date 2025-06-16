
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
