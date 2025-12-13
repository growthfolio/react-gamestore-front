import api from './api';
import { PaginatedResponse } from './produto.service';
import Categoria from '../models/categorias/Categoria';

export interface CategoriaRequest {
  tipo: string;
  descricao: string;
  icone?: string;
}

export type { Categoria };

class CategoriaService {
  async listar(params?: {
    descricao?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PaginatedResponse<Categoria>> {
    const response = await api.get<PaginatedResponse<Categoria>>('/categorias', { params });
    return response.data;
  }

  async buscarPorId(id: number): Promise<Categoria> {
    const response = await api.get<Categoria>(`/categorias/${id}`);
    return response.data;
  }

  async criar(dados: CategoriaRequest): Promise<Categoria> {
    const response = await api.post<Categoria>('/categorias', dados);
    return response.data;
  }

  async atualizar(id: number, dados: CategoriaRequest): Promise<Categoria> {
    const response = await api.put<Categoria>(`/categorias/${id}`, dados);
    return response.data;
  }

  async deletar(id: number): Promise<void> {
    await api.delete(`/categorias/${id}`);
  }
}

export default new CategoriaService();