import api from './api';
import { Produto } from '../models/produtos/Produto';

export interface ProdutoRequest {
  nome: string;
  descricao: string;
  preco: number;
  desconto?: number;
  estoque: number;
  plataforma: string;
  desenvolvedor: string;
  publisher: string;
  dataLancamento: string;
  imagens?: string[];
  categoriaId: number;
}

export type { Produto };

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

class ProdutoService {
  async listar(params?: {
    nome?: string;
    categoriaId?: number;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>('/produtos', { params });
    return response.data;
  }

  async buscarPorId(id: number): Promise<Produto> {
    const response = await api.get<Produto>(`/produtos/${id}`);
    return response.data;
  }

  async buscar(nome: string, page = 0, size = 20): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>('/produtos/buscar', {
      params: { nome, page, size }
    });
    return response.data;
  }

  async criar(dados: ProdutoRequest): Promise<Produto> {
    const response = await api.post<Produto>('/produtos', dados);
    return response.data;
  }

  async atualizar(id: number, dados: ProdutoRequest): Promise<Produto> {
    const response = await api.put<Produto>(`/produtos/${id}`, dados);
    return response.data;
  }

  async deletar(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`);
  }

  /**
   * Atualiza dados comerciais de um produto (preço, estoque, desconto, ativo)
   * Usado pelo admin após importar jogos da IGDB
   */
  async atualizarDadosComerciais(id: number, dados: {
    preco: number;
    estoque: number;
    desconto?: number;
    ativo?: boolean;
  }): Promise<Produto> {
    const response = await api.patch<Produto>(`/produtos/${id}/comercial`, dados);
    return response.data;
  }

  /**
   * Lista produtos pendentes de ativação (importados da IGDB, ativo=false)
   * Usado na tela de pré-cadastros
   */
  async listarPendentes(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>('/admin/produtos/pendentes', { params });
    return response.data;
  }

  /**
   * Conta produtos pendentes de ativação (para badge no menu)
   */
  async contarPendentes(): Promise<number> {
    const response = await api.get<PaginatedResponse<Produto>>('/admin/produtos/pendentes', { 
      params: { page: 0, size: 1 } 
    });
    return response.data.totalElements;
  }

  /**
   * Lista produtos com filtros avançados para admin
   */
  async listarAdmin(params?: {
    nome?: string;
    ativo?: boolean;
    semEstoque?: boolean;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<Produto>> {
    const response = await api.get<PaginatedResponse<Produto>>('/produtos', { params });
    return response.data;
  }
}

export default new ProdutoService();