import api from './api';

export type TipoBanner = 'PRODUTO' | 'CUSTOM' | 'CATEGORIA';

export interface Banner {
  id: number;
  titulo: string;
  subtitulo: string | null;
  urlImagem: string;
  tipo: TipoBanner;
  produtoId: number | null;
  produtoNome: string | null;
  produtoSlug: string | null;
  linkCustom: string | null;
  textoBotao: string | null;
  ordem: number;
  ativo: boolean;
  dataInicio: string | null;
  dataFim: string | null;
}

export interface BannerRequest {
  titulo: string;
  subtitulo?: string;
  urlImagem: string;
  tipo: TipoBanner;
  produtoId?: number;
  linkCustom?: string;
  textoBotao?: string;
  ordem?: number;
  ativo?: boolean;
  dataInicio?: string;
  dataFim?: string;
}

class BannerService {
  /**
   * Lista banners ativos para exibição pública (carousel da home)
   */
  async listarAtivos(): Promise<Banner[]> {
    const response = await api.get<Banner[]>('/api/banners/ativos');
    return response.data;
  }

  /**
   * Lista todos os banners (admin)
   */
  async listarTodos(): Promise<Banner[]> {
    const response = await api.get<Banner[]>('/api/banners');
    return response.data;
  }

  /**
   * Busca banner por ID (admin)
   */
  async buscarPorId(id: number): Promise<Banner> {
    const response = await api.get<Banner>(`/api/banners/${id}`);
    return response.data;
  }

  /**
   * Cria novo banner (admin)
   */
  async criar(data: BannerRequest): Promise<Banner> {
    const response = await api.post<Banner>('/api/banners', data);
    return response.data;
  }

  /**
   * Cria banner automaticamente a partir de um produto (admin)
   */
  async criarDeProduto(produtoId: number, subtitulo?: string): Promise<Banner> {
    const response = await api.post<Banner>(`/api/banners/produto/${produtoId}`, null, {
      params: subtitulo ? { subtitulo } : {}
    });
    return response.data;
  }

  /**
   * Atualiza banner existente (admin)
   */
  async atualizar(id: number, data: BannerRequest): Promise<Banner> {
    const response = await api.put<Banner>(`/api/banners/${id}`, data);
    return response.data;
  }

  /**
   * Deleta banner (admin)
   */
  async deletar(id: number): Promise<void> {
    await api.delete(`/api/banners/${id}`);
  }

  /**
   * Ativa/desativa banner (admin)
   */
  async toggleAtivo(id: number): Promise<Banner> {
    const response = await api.post<Banner>(`/api/banners/${id}/toggle`);
    return response.data;
  }

  /**
   * Reordena banners (admin)
   */
  async reordenar(bannerIds: number[]): Promise<void> {
    await api.post('/api/banners/reordenar', bannerIds);
  }
}

export default new BannerService();
