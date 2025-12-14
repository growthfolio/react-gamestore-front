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

class IgdbService {
    async searchGames(nome?: string, page: number = 1, limit: number = 20): Promise<IgdbSearchResult[]> {
        const params: any = { page, limit };
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
}

export default new IgdbService();
