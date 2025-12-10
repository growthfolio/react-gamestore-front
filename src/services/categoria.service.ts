import api from './api';
import Categoria from '../models/categorias/Categoria';

export interface CategoriaRequest {
  tipo: string;
  descricao?: string;
  icone?: string;
  ativo: boolean;
}

class CategoriaService {
  /**
   * Lista todas as categorias
   */
  async listar(): Promise<Categoria[]> {
    const response = await api.get<Categoria[]>('/categorias');
    return response.data;
  }

  /**
   * Busca categoria por ID
   */
  async buscarPorId(id: number): Promise<Categoria> {
    const response = await api.get<Categoria>(`/categorias/${id}`);
    return response.data;
  }

  /**
   * Cria nova categoria (apenas admin)
   */
  async criar(dados: CategoriaRequest): Promise<Categoria> {
    const response = await api.post<Categoria>('/categorias', dados);
    return response.data;
  }

  /**
   * Atualiza categoria (apenas admin)
   */
  async atualizar(id: number, dados: Partial<CategoriaRequest>): Promise<Categoria> {
    const response = await api.put<Categoria>(`/categorias/${id}`, dados);
    return response.data;
  }

  /**
   * Deleta categoria (apenas admin)
   */
  async deletar(id: number): Promise<void> {
    await api.delete(`/categorias/${id}`);
  }
}

export default new CategoriaService();
