import { create } from 'zustand';
import http from '@/services/http';

interface User {
  id: number;
  email: string;
  nome?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('cz_token'),
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // TODO: Substituir por chamada real da API quando backend estiver pronto
      // const response = await http.post('/auth/login', { email, password });
      
      // Mock do login por enquanto
      const mockResponse = {
        data: {
          token: 'mock_jwt_token_' + Date.now(),
          user: {
            id: 1,
            email,
            nome: email.split('@')[0],
          },
        },
      };

      const { token, user } = mockResponse.data;
      
      localStorage.setItem('cz_token', token);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw new Error('Credenciais inválidas');
    }
  },

  logout: () => {
    localStorage.removeItem('cz_token');
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem('cz_token');
    if (token) {
      // TODO: Validar token com o backend
      set({ isAuthenticated: true });
    } else {
      set({ isAuthenticated: false, user: null });
    }
  },
}));