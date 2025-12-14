import api from './api';

export interface UsuarioUpdate {
    nome: string;
    usuario: string;
    senha: string;
    foto?: string;
}

export interface Usuario {
    id: number;
    nome: string;
    usuario: string;
    foto?: string;
    tipo?: string;
}

const usuarioService = {
    /**
     * Buscar usuário por ID
     */
    buscarPorId: async (id: number): Promise<Usuario> => {
        const response = await api.get(`/usuarios/${id}`);
        return response.data;
    },

    /**
     * Atualizar dados do usuário
     * Nota: A API requer senha para atualização
     */
    atualizar: async (id: number, dados: UsuarioUpdate): Promise<Usuario> => {
        const response = await api.put(`/usuarios/atualizar/${id}`, dados);
        return response.data;
    },

    /**
     * Atualizar apenas senha do usuário
     */
    atualizarSenha: async (id: number, senhaAtual: string, novaSenha: string): Promise<void> => {
        await api.patch(`/usuarios/${id}/senha`, {
            senhaAtual,
            novaSenha
        });
    }
};

export default usuarioService;
