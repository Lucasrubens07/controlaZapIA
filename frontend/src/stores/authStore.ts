import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: localStorage.getItem('cz_token'),
      isAuthenticated: !!localStorage.getItem('cz_token'),
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Credenciais inválidas');
          }
          
          if (data.success && data.data) {
            const { token, user } = data.data;
            
            localStorage.setItem('cz_token', token);
            set({ 
              token, 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            throw new Error(data.message || 'Erro no login');
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        localStorage.removeItem('cz_token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },
      
      setUser: (user: User) => {
        set({ user });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('cz_token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok && data.success && data.data?.user) {
            set({ 
              user: data.data.user, 
              isAuthenticated: true 
            });
          } else {
            // Token inválido, fazer logout
            get().logout();
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          // Em caso de erro, fazer logout
          get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      }),
    }
  )
);