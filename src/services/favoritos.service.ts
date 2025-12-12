import api from './api';
import { PaginatedResponse } from './produto.service';

export interface Favorito {
  id: number;
  dataAdicionado: string;
  produto: {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    precoComDesconto: number;
    plataforma: string;
    emEstoque: boolean;
    imagemPrincipal: string;
  };
}

class FavoritosService {
  async listar(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PaginatedResponse<Favorito>> {
    const response = await api.get<PaginatedResponse<Favorito>>('/favoritos', { params });
    return response.data;
  }

  async adicionar(produtoId: number): Promise<void> {
    await api.post(`/favoritos/produto/${produtoId}`);
  }

  async remover(produtoId: number): Promise<void> {
    await api.delete(`/favoritos/produto/${produtoId}`);
  }

  async verificar(produtoId: number): Promise<boolean> {
    try {
      const response = await api.get<boolean>(`/favoritos/produto/${produtoId}/verificar`);
      return response.data;
    } catch {
      return false;
    }
  }

  async contar(): Promise<number> {
    const response = await api.get<number>('/favoritos/contagem');
    return response.data;
  }
}

export default new FavoritosService();