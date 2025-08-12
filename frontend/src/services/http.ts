import axios from 'axios';

// Configuração da instância Axios
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cz_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log do erro para debugging
    console.error('API Error:', error.response?.data || error.message);
    
    // Tratamento específico para erro 401 (não autorizado)
    if (error.response?.status === 401) {
      localStorage.removeItem('cz_token');
      window.location.href = '/login';
    }
    
    // Estrutura padronizada de erro
    const errorResponse = {
      success: false,
      message: error.response?.data?.message || 'Erro de conexão com o servidor',
      status: error.response?.status || 500,
      data: null,
    };
    
    return Promise.reject(errorResponse);
  }
);

export default http;