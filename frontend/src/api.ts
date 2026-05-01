import axios from "axios";
import type { ApiResponse, LoginCredentials, RegisterData, CreateProductData, PaginationParams, ProductsResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const register = (data: RegisterData) => API.post<ApiResponse<{ user: unknown; token: string }>>("/auth/register", data);
export const login = (data: LoginCredentials) => API.post<ApiResponse<{ user: unknown; token: string }>>("/auth/login", data);
export const getMe = () => API.get<ApiResponse<{ user: unknown }>>("/auth/me");

export const getProducts = (params?: PaginationParams) => API.get<ProductsResponse>("/products", { params });
export const getProduct = (id: string) => API.get<ApiResponse<unknown>>(`/products/${id}`);
export const createProduct = (data: CreateProductData) => API.post<ApiResponse<unknown>>("/products", data);
export const updateProduct = (id: string, data: CreateProductData) => API.patch<ApiResponse<unknown>>(`/products/${id}`, data);
export const deleteProduct = (id: string) => API.delete<ApiResponse<unknown>>(`/products/${id}`);

export default API;
