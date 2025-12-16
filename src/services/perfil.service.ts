import api from './api';

export interface ConquistaDTO {
  codigo: string;
  nome: string;
  descricao: string;
  icone: string;
  desbloqueada: boolean;
  progresso: number;
  meta: number;
}

export interface GeneroFavoritoDTO {
  nome: string;
  quantidade: number;
  percentual: number;
}

export interface CompraResumoDTO {
  pedidoId: number;
  produtoNome: string;
  produtoImagem: string;
  data: string;
  valor: number;
}

export interface NivelUsuario {
  nome: string;
  descricao: string;
  ordem: number;
  comprasMinimas: number;
}

export interface PerfilStats {
  usuarioId: number;
  nickname: string;
  email: string;
  foto: string | null;
  membroDesde: string | null;
  
  // Estatísticas
  totalCompras: number;
  totalAvaliacoes: number;
  totalFavoritos: number;
  totalItensCarrinho: number;
  totalGasto: number;
  
  // Nível
  nivel: NivelUsuario;
  proximoNivel: NivelUsuario;
  comprasParaProximoNivel: number;
  progressoNivel: number;
  
  // Conquistas
  conquistas: ConquistaDTO[];
  totalConquistas: number;
  
  // Gêneros e compras
  generosFavoritos: GeneroFavoritoDTO[];
  ultimasCompras: CompraResumoDTO[];
}

class PerfilService {
  async getStats(): Promise<PerfilStats> {
    const response = await api.get<PerfilStats>('/perfil/stats');
    return response.data;
  }
}

export default new PerfilService();
