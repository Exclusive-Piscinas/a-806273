
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Sprout, 
  Package, 
  Wallet, 
  BarChart2, 
  Menu, 
  X,
  Sun,
  Moon,
  ChevronRight,
  Settings,
  FileText,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const navItems = [
    { title: t('nav.dashboard'), path: '/', icon: Home },
    { title: t('nav.pools'), path: '/parcelles', icon: MapPin },
    { title: t('nav.maintenance'), path: '/cultures', icon: Sprout },
    { title: t('nav.inventory'), path: '/inventaire', icon: Package },
    { title: t('nav.finance'), path: '/finances', icon: Wallet },
    { title: t('nav.reports'), path: '/statistiques', icon: BarChart2 },
    { title: t('nav.documents'), path: '/documentos', icon: FileText },
    { title: t('nav.settings'), path: '/parametres', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={toggleSidebar} 
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all active:scale-95 dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label={t('nav.toggleNav')}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:relative md:translate-x-0 flex flex-col h-full overflow-y-auto`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/exclusive-logo.svg" alt="Exclusive Piscinas" className="h-10 w-auto" />
            </Link>
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('nav.toggleTheme')}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <LanguageSelector />
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
                isActive(item.path) 
                  ? 'bg-blue-600/10 text-blue-600 font-medium' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-blue-600' : ''}`} />
              <span>{item.title}</span>
              
              {isActive(item.path) && (
                <div className="ml-auto flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                  <ChevronRight className="h-4 w-4 text-blue-600 ml-1" />
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 px-3 py-2 mb-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{t('nav.user')}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button 
            onClick={signOut}
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            {t('nav.logout')}
          </Button>
        </div>
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
