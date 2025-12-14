import api from './api';

export interface IgdbSearchResult {
    igdbId: number;
    nome: string;
    slug: string;
    descricao: string;
    dataLancamento: string;
    rating: number;
    urlCapa: string;
    plataformas: string[];
    generos: string[];
    jaImportado: boolean;
    produtoIdLocal?: number;
}

export interface IgdbImportStatus {
    produtoId: number;
    nome: string;
    igdbId: number;
    mensagem: string;
}

export interface IgdbGenreImportResult {
    mensagem: string;
    totalEncontrados: number;
    criados: number;
    jaExistentes: number;
}

class IgdbService {
    async searchGames(nome?: string, page: number = 1, limit: number = 20): Promise<IgdbSearchResult[]> {
        const params: Record<string, unknown> = { page, limit };
        if (nome) params.nome = nome;
        
        const response = await api.get<IgdbSearchResult[]>('/admin/igdb/search', {
            params
        });
        return response.data;
    }

    async importGame(igdbId: number): Promise<IgdbImportStatus> {
        const response = await api.post<IgdbImportStatus>(`/admin/igdb/import/${igdbId}`);
        return response.data;
    }

    /**
     * Importa todos os gêneros da IGDB como categorias
     * Gêneros já existentes são ignorados
     */
    async importAllGenres(): Promise<IgdbGenreImportResult> {
        const response = await api.post<IgdbGenreImportResult>('/admin/igdb/import/genres');
        return response.data;
    }
}

export default new IgdbService();
