import React, { createContext, useContext, useState, useEffect } from 'react';
import { authHelpers, profileHelpers, supabase } from '../lib/supabase';

const AuthContext = createContext({});

// Mock data para desenvolvimento sem Supabase
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@cineteca.com',
    password: 'admin123',
    user_metadata: {
      full_name: 'Administrador',
      cpf: '000.000.000-00'
    }
  },
  {
    id: '2', 
    email: 'usuario@email.com',
    password: 'user123',
    user_metadata: {
      full_name: 'João Silva',
      cpf: '123.456.789-01'
    }
  }
];

const MOCK_PROFILES = [
  {
    id: '1',
    email: 'admin@cineteca.com',
    name: 'Administrador',
    cpf: '000.000.000-00',
    birth_date: '1990-01-01',
    phone: '(11) 99999-9999',
    role: 'admin'
  },
  {
    id: '2',
    email: 'usuario@email.com', 
    name: 'João Silva',
    cpf: '123.456.789-01',
    birth_date: '1995-05-15',
    phone: '(11) 98888-8888',
    role: 'user'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = await authHelpers.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Buscar perfil completo do usuário
          const { data: profileData, error } = await profileHelpers.getProfile(currentUser.id);
          if (profileData && !error) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = authHelpers.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        if (session?.user) {
          setUser(session.user);
          
          // Forçar busca do perfil por email (mais confiável)
          console.log('Buscando perfil por email:', session.user.email);
          const { data: profileByEmail } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', session.user.email)
            .single();
          
          console.log('Perfil encontrado por email:', profileByEmail);
          setProfile(profileByEmail);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Tentando fazer login com:', email);
      const { data, error } = await authHelpers.signIn(email, password);
      
      if (error) {
        console.error('Erro no login:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        console.log('Login bem-sucedido:', data.user.email);
        setUser(data.user);
        
        // Buscar perfil diretamente por email (mais confiável)
        console.log('Buscando perfil por email:', data.user.email);
        const { data: profileByEmail, error: emailError } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', data.user.email)
          .single();
        
        console.log('Perfil encontrado por email:', { profileByEmail, emailError });
        
        if (profileByEmail && !emailError) {
          console.log('Perfil carregado:', profileByEmail);
          setProfile(profileByEmail);
        } else {
          console.error('Erro ao buscar perfil por email:', emailError);
        }
        
        return { success: true, user: data.user };
      }

      return { success: false, error: 'Erro desconhecido no login' };
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const { email, password, ...profileData } = userData;
      
      // Registrar usuário no Supabase Auth
      const { data, error } = await authHelpers.signUp(email, password, {
        full_name: profileData.name,
        cpf: profileData.cpf
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // O perfil será criado automaticamente pelo trigger
        return { success: true, user: data.user, needsVerification: !data.user.email_confirmed_at };
      }

      return { success: false, error: 'Erro desconhecido no registro' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      console.log('Iniciando logout...');
      
      // Fazer logout no Supabase
      const { error } = await authHelpers.signOut();
      if (error) {
        console.error('Erro no logout do Supabase:', error);
      } else {
        console.log('Logout do Supabase realizado com sucesso');
      }
      
      // Limpar estado e localStorage independentemente do erro do Supabase
      setUser(null);
      setProfile(null);
      localStorage.removeItem('cineteca_user');
      localStorage.removeItem('cineteca_profile');
      
      console.log('Estados e localStorage limpos');
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      
      // Mesmo com erro, limpar os dados locais
      setUser(null);
      setProfile(null);
      localStorage.removeItem('cineteca_user');
      localStorage.removeItem('cineteca_profile');
      
      return { success: false, error: error.message };
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      if (!user?.id) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      if (supabase) {
        // Modo produção com Supabase
        const { data, error } = await profileHelpers.updateProfile(user.id, updatedData);
        
        if (error) {
          return { success: false, error: error.message };
        }

        if (data && data[0]) {
          setProfile(data[0]);
          return { success: true };
        }

        return { success: false, error: 'Erro ao atualizar perfil' };
      } else {
        // Modo desenvolvimento com mock
        const updatedProfile = { ...profile, ...updatedData };
        setProfile(updatedProfile);
        localStorage.setItem('cineteca_profile', JSON.stringify(updatedProfile));
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const isAdmin = () => {
    console.log('Verificando isAdmin:', { profile, role: profile?.role });
    return profile?.role === 'admin';
  };
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      setProfile,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAdmin,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};