import api from './api';
import Produto from '../models/produtos/Produto';

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface ProdutoRequest {
  nome: string;
  descricao: string;
  preco: number;
  desconto?: number;
  estoque: number;
  plataforma: string;
  categoriaId: number;
  desenvolvedor: string;
  publisher: string;
  dataLancamento: Date;
  imagens: string[];
  ativo: boolean;
}

class ProdutoService {
  /**
   * Lista produtos com paginação
   */
  async listar(params?: PaginationParams): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>('/produtos', { params });
    return response.data;
  }

  /**
   * Busca produto por ID
   */
  async buscarPorId(id: number): Promise<Produto> {
    const response = await api.get<Produto>(`/produtos/${id}`);
    return response.data;
  }

  /**
   * Busca produtos por nome
   */
  async buscarPorNome(nome: string, params?: PaginationParams): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>('/produtos/buscar', {
      params: { nome, ...params },
    });
    return response.data;
  }

  /**
   * Busca produtos por categoria
   */
  async buscarPorCategoria(categoriaId: number, params?: PaginationParams): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>(`/produtos/categoria/${categoriaId}`, {
      params,
    });
    return response.data;
  }

  /**
   * Cria novo produto (apenas admin)
   */
  async criar(dados: ProdutoRequest): Promise<Produto> {
    const response = await api.post<Produto>('/produtos', dados);
    return response.data;
  }

  /**
   * Atualiza produto (apenas admin)
   */
  async atualizar(id: number, dados: Partial<ProdutoRequest>): Promise<Produto> {
    const response = await api.put<Produto>(`/produtos/${id}`, dados);
    return response.data;
  }

  /**
   * Deleta produto (apenas admin)
   */
  async deletar(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`);
  }
}

export default new ProdutoService();
