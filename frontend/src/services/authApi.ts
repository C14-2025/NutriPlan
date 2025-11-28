import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface LoginData {
  nome?: string;
  email: string;
  senha: string;
  idade?: number;
  peso?: number;
  altura?: number;
  objetivo?: string;
  sexo?: string;
  nivelAtividade?: string;
}

export interface AuthResponse {
  id: number;
  nome: string;
  email: string;
  idade?: number;
  peso?: number;
  altura?: number;
  objetivo?: string;
  sexo?: string;
  nivelAtividade?: string;
}

export const authApi = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    return response.data;
  },

  register: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response.data;
  }
};