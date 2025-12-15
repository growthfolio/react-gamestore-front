import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuração base da API
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request - Adiciona token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response - Trata erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Erro de resposta do servidor
      switch (error.response.status) {
        case 401:
          // Token inválido/expirado - só redireciona se havia token
          const token = localStorage.getItem('token');
          if (token) {
            // Verifica se é realmente token inválido (não apenas falta de permissão)
            const errorMessage = error.response.data?.message || '';
            if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('invalid')) {
              localStorage.removeItem('token');
              localStorage.removeItem('usuario');
              window.location.href = '/login';
            }
          }
          break;
        case 403:
          // Acesso negado - usuário logado mas sem permissão
          console.error('Acesso negado - sem permissão para este recurso');
          break;
        case 404:
          console.error('Recurso não encontrado');
          break;
        case 500:
          console.error('Erro interno do servidor');
          break;
        default:
          console.error('Erro na requisição:', error.response.data);
      }
    } else if (error.request) {
      // Requisição feita mas sem resposta
      console.error('Servidor não respondeu');
    } else {
      // Erro ao configurar a requisição
      console.error('Erro:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
