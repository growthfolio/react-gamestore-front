import api from './api';

export interface AvaliacaoRequest {
  produtoId: number;
  nota: number;
  comentario?: string;
}

export interface Avaliacao {
  id: number;
  nota: number;
  comentario?: string;
  usuario: {
    id: number;
    nome: string;
    foto?: string;
  };
  produto: {
    id: number;
    nome: string;
  };
  dataAvaliacao: string;
}

export interface MediaAvaliacao {
  media: number;
  total: number;
  distribuicao: {
    estrela5: number;
    estrela4: number;
    estrela3: number;
    estrela2: number;
    estrela1: number;
  };
}

class AvaliacaoService {
  /**
   * Cria nova avaliação
   */
  async criar(dados: AvaliacaoRequest): Promise<Avaliacao> {
    const response = await api.post<Avaliacao>('/avaliacoes', dados);
    return response.data;
  }

  /**
   * Busca avaliação por ID
   */
  async buscarPorId(id: number): Promise<Avaliacao> {
    const response = await api.get<Avaliacao>(`/avaliacoes/${id}`);
    return response.data;
  }

  /**
   * Lista avaliações de um produto
   */
  async listarPorProduto(produtoId: number): Promise<Avaliacao[]> {
    const response = await api.get<Avaliacao[]>(`/avaliacoes/produto/${produtoId}`);
    return response.data;
  }

  /**
   * Busca média de avaliações de um produto
   */
  async buscarMedia(produtoId: number): Promise<MediaAvaliacao> {
    const response = await api.get<MediaAvaliacao>(`/avaliacoes/produto/${produtoId}/media`);
    return response.data;
  }

  /**
   * Busca contagem de avaliações de um produto
   */
  async buscarContagem(produtoId: number): Promise<number> {
    const response = await api.get<{ total: number }>(`/avaliacoes/produto/${produtoId}/contagem`);
    return response.data.total;
  }

  /**
   * Atualiza avaliação
   */
  async atualizar(id: number, dados: Partial<AvaliacaoRequest>): Promise<Avaliacao> {
    const response = await api.put<Avaliacao>(`/avaliacoes/${id}`, dados);
    return response.data;
  }

  /**
   * Deleta avaliação
   */
  async deletar(id: number): Promise<void> {
    await api.delete(`/avaliacoes/${id}`);
  }
}

export default new AvaliacaoService();
