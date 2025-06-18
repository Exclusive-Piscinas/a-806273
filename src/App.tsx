
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import ParcelsPage from "./pages/ParcelsPage";
import ParcelsDetailsPage from "./pages/ParcelsDetailsPage";
import CropsPage from "./pages/CropsPage";
import InventoryPage from "./pages/InventoryPage";
import FinancePage from "./pages/FinancePage";
import StatsPage from "./pages/StatsPage";
import DocumentsPage from "./pages/DocumentsPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { CRMProvider } from "./contexts/CRMContext";
import { StatisticsProvider } from "./contexts/StatisticsContext";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { trackPageView } from "./utils/analytics";

const routes = [
  { path: "/auth", element: <AuthPage />, protected: false },
  { path: "/", element: <Index />, protected: true },
  { path: "/parcelles", element: <ParcelsPage />, protected: true },
  { path: "/parcelles/:id", element: <ParcelsDetailsPage />, protected: true },
  { path: "/cultures", element: <CropsPage />, protected: true },
  { path: "/inventaire", element: <InventoryPage />, protected: true },
  { path: "/finances", element: <FinancePage />, protected: true },
  { path: "/statistiques", element: <StatisticsProvider><StatsPage /></StatisticsProvider>, protected: true },
  { path: "/documentos", element: <DocumentsPage />, protected: true },
  { path: "/rapports", element: <Navigate to="/documentos" replace />, protected: true },
  { path: "/parametres", element: <Navigate to="/" replace />, protected: true },
  { path: "/dashboard", element: <Navigate to="/" replace />, protected: true },
  { path: "*", element: <NotFound />, protected: false }
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

const RouterChangeHandler = () => {
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
      
      const currentPath = window.location.pathname;
      const pageName = currentPath === '/' ? 'painel' : currentPath.replace(/^\//, '');
      trackPageView(pageName);
    } catch (error) {
      console.error('Error in RouterChangeHandler:', error);
    }
  }, [location.pathname]);
  
  return null;
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <AppSettingsProvider>
              <CRMProvider>
                <BrowserRouter>
                  <TooltipProvider>
                    <RouterChangeHandler />
                    <Routes>
                      {routes.map((route) => (
                        <Route 
                          key={route.path} 
                          path={route.path} 
                          element={
                            route.protected ? (
                              <ProtectedRoute>{route.element}</ProtectedRoute>
                            ) : (
                              route.element
                            )
                          } 
                        />
                      ))}
                    </Routes>
                    <Toaster />
                  </TooltipProvider>
                </BrowserRouter>
              </CRMProvider>
            </AppSettingsProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
