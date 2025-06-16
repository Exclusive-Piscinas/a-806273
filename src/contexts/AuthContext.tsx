
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nomeCompleto: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      // Get current language from localStorage for toast messages
      const currentLanguage = localStorage.getItem('language') || 'pt';
      const errorMessage = currentLanguage === 'en' ? 'Login error' : 'Erro ao fazer login';
      toast.error(errorMessage, {
        description: error.message
      });
    } else {
      const currentLanguage = localStorage.getItem('language') || 'pt';
      const successMessage = currentLanguage === 'en' ? 'Login successful!' : 'Login realizado com sucesso!';
      toast.success(successMessage);
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, nomeCompleto: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          nome_completo: nomeCompleto
        }
      }
    });
    
    if (error) {
      const currentLanguage = localStorage.getItem('language') || 'pt';
      const errorMessage = currentLanguage === 'en' ? 'Error creating account' : 'Erro ao criar conta';
      toast.error(errorMessage, {
        description: error.message
      });
    } else {
      const currentLanguage = localStorage.getItem('language') || 'pt';
      const successMessage = currentLanguage === 'en' ? 'Account created successfully!' : 'Conta criada com sucesso!';
      const successDescription = currentLanguage === 'en' ? 'Check your email to confirm your account.' : 'Verifique seu email para confirmar a conta.';
      toast.success(successMessage, {
        description: successDescription
      });
    }
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    const currentLanguage = localStorage.getItem('language') || 'pt';
    
    if (error) {
      const errorMessage = currentLanguage === 'en' ? 'Error logging out' : 'Erro ao sair';
      toast.error(errorMessage, {
        description: error.message
      });
    } else {
      const successMessage = currentLanguage === 'en' ? 'Logout successful!' : 'Logout realizado com sucesso!';
      toast.success(successMessage);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
