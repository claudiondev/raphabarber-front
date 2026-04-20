import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000, // Evita requisições pendentes infinitas
});

// Injeta o token em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepta erros globais (Ex: Token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Uso de optional chaining para evitar erro caso error.response seja undefined
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      
      const isPublicPage = ['/', '/login', '/cadastro'].includes(window.location.pathname);
      if (!isPublicPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;