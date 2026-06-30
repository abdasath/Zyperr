import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    // Get token from zustand persisted storage
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        const token = parsed?.state?.user?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on unauthorized
      try {
        useAuthStore.getState().logout();
      } catch {
        // ignore if outside react context
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ============================================
// API HELPERS
// ============================================

export const moviesApi = {
  getAll: (params?: Record<string, any>) => api.get("/movies", { params }),
  getByType: (contentType: "MOVIE" | "WEB_SERIES" | "ANIME", params?: Record<string, any>) =>
    api.get("/movies", { params: { contentType, ...params } }),
  getFeatured: () => api.get("/movies/featured"),
  getBanner: () => api.get("/movies/banner"),
  getTrending: () => api.get("/movies/trending"),
  getGenres: () => api.get("/movies/genres"),
  getById: (id: string) => api.get(`/movies/${id}`),
  create: (data: any) => api.post("/movies", data),
  update: (id: string, data: any) => api.put(`/movies/${id}`, data),
  delete: (id: string) => api.delete(`/movies/${id}`),
};

export const watchlistApi = {
  get: () => api.get("/watchlist"),
  add: (movieId: string) => api.post("/watchlist", { movieId }),
  remove: (movieId: string) => api.delete(`/watchlist/${movieId}`),
  check: (movieId: string) => api.get(`/watchlist/check/${movieId}`),
};

export const authApi = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),
  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),
  googleLogin: (token: string, intent: 'login' | 'register') => api.post("/auth/google", { token, intent }),
  me: () => api.get("/auth/me"),
};
