import api from './api';
import Produto from '../models/produtos/Produto';

export interface Favorito {
  id: number;
  produto: Produto;
  dataFavorito: string;
}

class FavoritoService {
  /**
   * Adiciona produto aos favoritos
   */
  async adicionar(produtoId: number): Promise<Favorito> {
    const response = await api.post<Favorito>(`/favoritos/produto/${produtoId}`);
    return response.data;
  }

  /**
   * Remove produto dos favoritos
   */
  async remover(produtoId: number): Promise<void> {
    await api.delete(`/favoritos/produto/${produtoId}`);
  }

  /**
   * Lista todos os favoritos do usuário
   */
  async listar(): Promise<Favorito[]> {
    const response = await api.get<Favorito[]>('/favoritos');
    return response.data;
  }

  /**
   * Verifica se produto está nos favoritos
   */
  async verificar(produtoId: number): Promise<boolean> {
    const response = await api.get<{ favorito: boolean }>(`/favoritos/produto/${produtoId}/verificar`);
    return response.data.favorito;
  }

  /**
   * Busca contagem total de favoritos
   */
  async contagem(): Promise<number> {
    const response = await api.get<{ total: number }>('/favoritos/contagem');
    return response.data.total;
  }

  /**
   * Toggle favorito (adiciona ou remove)
   */
  async toggle(produtoId: number): Promise<boolean> {
    const isFavorito = await this.verificar(produtoId);
    
    if (isFavorito) {
      await this.remover(produtoId);
      return false;
    } else {
      await this.adicionar(produtoId);
      return true;
    }
  }
}

export default new FavoritoService();
