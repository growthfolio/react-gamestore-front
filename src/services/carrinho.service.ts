import api from './api';
import Produto from '../models/produtos/Produto';

export interface CarrinhoItemRequest {
  produtoId: number;
  quantidade: number;
}

export interface CarrinhoItem {
  id: number;
  produto: Produto;
  quantidade: number;
  subtotal: number;
}

export interface Carrinho {
  itens: CarrinhoItem[];
  total: number;
  totalItens: number;
}

class CarrinhoService {
  /**
   * Busca carrinho do usuário logado
   */
  async buscar(): Promise<Carrinho> {
    const response = await api.get<Carrinho>('/carrinho');
    return response.data;
  }

  /**
   * Adiciona item ao carrinho
   */
  async adicionarItem(dados: CarrinhoItemRequest): Promise<CarrinhoItem> {
    const response = await api.post<CarrinhoItem>('/carrinho/item', dados);
    return response.data;
  }

  /**
   * Atualiza quantidade de um item
   */
  async atualizarItem(itemId: number, quantidade: number): Promise<CarrinhoItem> {
    const response = await api.put<CarrinhoItem>(`/carrinho/item/${itemId}`, { quantidade });
    return response.data;
  }

  /**
   * Remove item do carrinho
   */
  async removerItem(itemId: number): Promise<void> {
    await api.delete(`/carrinho/item/${itemId}`);
  }

  /**
   * Limpa todo o carrinho
   */
  async limpar(): Promise<void> {
    await api.delete('/carrinho');
  }
}

export default new CarrinhoService();
