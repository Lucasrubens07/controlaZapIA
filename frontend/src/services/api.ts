import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Criar instância do axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos de dados
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category_id: string;
  category?: Category;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  created_at: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
}

// Serviços da API
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
};

export const transactionService = {
  getAll: async (params?: {
    startDate?: string;
    endDate?: string;
    category_id?: string;
    type?: 'income' | 'expense';
  }) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },
  create: async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },
  update: async (id: string, transaction: Partial<Transaction>) => {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },
};

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  create: async (category: Omit<Category, 'id' | 'created_at'>) => {
    const response = await api.post('/categories', category);
    return response.data;
  },
  update: async (id: string, category: Partial<Category>) => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const dashboardService = {
  getSummary: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get('/dashboard/summary', { params });
    return response.data;
  },
  getChartData: async (params?: {
    startDate?: string;
    endDate?: string;
    type?: 'category' | 'monthly';
  }) => {
    const response = await api.get('/dashboard/charts', { params });
    return response.data;
  },
};