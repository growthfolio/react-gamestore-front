import api from './api';

export interface CadastroRequest {
  nome: string;
  usuario: string;
  senha: string;
  foto?: string;
}

export interface LoginRequest {
  usuario: string;
  senha: string;
}

export interface LoginResponse {
  id: number;
  nome: string;
  usuario: string;
  foto?: string;
  token: string;
  tipo: 'USER' | 'ADMIN';
}

export interface Usuario {
  id: number;
  nome: string;
  usuario: string;
  foto?: string;
  tipo: 'USER' | 'ADMIN';
  roles?: string[];
}

class AuthService {
  /**
   * Realiza o cadastro de um novo usuário
   */
  async cadastrar(dados: CadastroRequest): Promise<Usuario> {
    const response = await api.post<Usuario>('/usuarios/cadastrar', dados);
    return response.data;
  }

  /**
   * Realiza o login e armazena token no localStorage
   */
  async login(dados: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/usuarios/logar', dados);
    const { token, ...usuario } = response.data;
    
    // Armazena token e dados do usuário
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    
    return response.data;
  }

  /**
   * Realiza o logout
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Retorna o usuário logado
   */
  getUsuarioLogado(): Usuario | null {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  /**
   * Verifica se o usuário é admin
   */
  isAdmin(): boolean {
    const usuario = this.getUsuarioLogado();
    return !!(usuario?.tipo === 'ADMIN' || 
             usuario?.roles?.includes('ROLE_ADMIN') || 
             usuario?.roles?.includes('ADMIN'));
  }

  /**
   * Busca usuário por ID
   */
  async buscarPorId(id: number): Promise<Usuario> {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  }

  /**
   * Atualiza dados do usuário
   */
  async atualizar(id: number, dados: Partial<CadastroRequest>): Promise<Usuario> {
    const response = await api.put<Usuario>(`/usuarios/atualizar/${id}`, dados);
    
    // Atualiza localStorage se for o usuário logado
    const usuario = this.getUsuarioLogado();
    if (usuario && usuario.id === id) {
      localStorage.setItem('usuario', JSON.stringify({ ...usuario, ...response.data }));
    }
    
    return response.data;
  }

  /**
   * Lista todos os usuários (apenas para admin)
   */
  async listarTodos(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>('/usuarios/all');
    return response.data;
  }
}

export default new AuthService();
