
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

// Input validation for auth
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 128;
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Input validation
      if (!validateEmail(email)) {
        const errorMessage = 'Email inválido';
        toast.error(errorMessage);
        return { error: { message: errorMessage } };
      }

      if (!validatePassword(password)) {
        const errorMessage = 'Senha deve ter entre 6 e 128 caracteres';
        toast.error(errorMessage);
        return { error: { message: errorMessage } };
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeString(email.toLowerCase());

      const { error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });
      
      if (error) {
        const currentLanguage = localStorage.getItem('language') || 'pt';
        const errorMessage = currentLanguage === 'en' ? 'Login error' : 'Erro ao fazer login';
        toast.error(errorMessage);
      } else {
        const currentLanguage = localStorage.getItem('language') || 'pt';
        const successMessage = currentLanguage === 'en' ? 'Login successful!' : 'Login realizado com sucesso!';
        toast.success(successMessage);
      }
      
      return { error };
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro interno. Tente novamente mais tarde.');
      return { error };
    }
  };

  const signUp = async (email: string, password: string, nomeCompleto: string) => {
    try {
      // Input validation
      if (!validateEmail(email)) {
        const errorMessage = 'Email inválido';
        toast.error(errorMessage);
        return { error: { message: errorMessage } };
      }

      if (!validatePassword(password)) {
        const errorMessage = 'Senha deve ter entre 6 e 128 caracteres';
        toast.error(errorMessage);
        return { error: { message: errorMessage } };
      }

      if (!validateName(nomeCompleto)) {
        const errorMessage = 'Nome deve ter entre 2 e 100 caracteres';
        toast.error(errorMessage);
        return { error: { message: errorMessage } };
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeString(email.toLowerCase());
      const sanitizedName = sanitizeString(nomeCompleto);

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome_completo: sanitizedName
          }
        }
      });
      
      if (error) {
        const currentLanguage = localStorage.getItem('language') || 'pt';
        const errorMessage = currentLanguage === 'en' ? 'Error creating account' : 'Erro ao criar conta';
        toast.error(errorMessage);
      } else {
        const currentLanguage = localStorage.getItem('language') || 'pt';
        const successMessage = currentLanguage === 'en' ? 'Account created successfully!' : 'Conta criada com sucesso!';
        const successDescription = currentLanguage === 'en' ? 'Check your email to confirm your account.' : 'Verifique seu email para confirmar a conta.';
        toast.success(successMessage, {
          description: successDescription
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Erro no signup:', error);
      toast.error('Erro interno. Tente novamente mais tarde.');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      const currentLanguage = localStorage.getItem('language') || 'pt';
      
      if (error) {
        const errorMessage = currentLanguage === 'en' ? 'Error logging out' : 'Erro ao sair';
        toast.error(errorMessage);
      } else {
        const successMessage = currentLanguage === 'en' ? 'Logout successful!' : 'Logout realizado com sucesso!';
        toast.success(successMessage);
      }
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro interno. Tente novamente mais tarde.');
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
