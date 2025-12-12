import api from './api';

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

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  precoComDesconto: number;
  desconto: number;
  estoque: number;
  emEstoque: boolean;
  plataforma: string;
  desenvolvedor: string;
  publisher: string;
  dataLancamento: string;
  imagens: string[];
  ativo: boolean;
  categoria: {
    id: number;
    tipo: string;
    icone: string;
  };
  mediaAvaliacoes: number;
  totalAvaliacoes: number;
}

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
}

export default new ProdutoService();