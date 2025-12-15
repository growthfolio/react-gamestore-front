import api from './api';

export interface CadastroRequest {
  nickname: string;
  email: string;
  senha: string;
  foto?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  id: number;
  nickname: string;
  email: string;
  foto?: string;
  token: string;
  roles: string[];
}

export interface Usuario {
  id: number;
  nickname: string;
  email: string;
  foto?: string;
  tipo: 'USER' | 'ADMIN';
  roles?: string[];
}

class AuthService {
  async cadastrar(dados: CadastroRequest): Promise<Usuario> {
    const response = await api.post<Usuario>('/usuarios/cadastrar', dados);
    return response.data;
  }

  async login(dados: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/usuarios/logar', dados);
    const { token, roles, ...usuarioData } = response.data;
    
    const tipo = roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER';

    const usuario: Usuario = {
        ...usuarioData,
        tipo,
        roles
    };

    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsuarioLogado(): Usuario | null {
    const usuarioStr = localStorage.getItem('usuario');
    return usuarioStr ? JSON.parse(usuarioStr) : null;
  }

  isAdmin(): boolean {
    const usuario = this.getUsuarioLogado();
    return !!(usuario?.tipo === 'ADMIN' || 
             usuario?.roles?.includes('ROLE_ADMIN') || 
             usuario?.roles?.includes('ADMIN'));
  }

  async verificarSeEhAdmin(): Promise<boolean> {
    try {
      const usuarios = await this.listarTodos();
      return usuarios.length > 0;
    } catch {
      return false;
    }
  }

  async buscarPorId(id: number): Promise<Usuario> {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  }

  async atualizar(id: number, dados: Partial<CadastroRequest>): Promise<Usuario> {
    const response = await api.put<Usuario>(`/usuarios/atualizar/${id}`, dados);
    
    const usuario = this.getUsuarioLogado();
    if (usuario && usuario.id === id) {
      localStorage.setItem('usuario', JSON.stringify({ ...usuario, ...response.data }));
    }
    
    return response.data;
  }

  async listarTodos(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>('/usuarios/all');
    return response.data;
  }

  async buscarDadosCompletos(): Promise<Usuario | null> {
    const usuario = this.getUsuarioLogado();
    if (!usuario?.id) return null;
    
    try {
      return await this.buscarPorId(usuario.id);
    } catch {
      try {
        const usuarios = await this.listarTodos();
        return usuarios.find(u => u.id === usuario.id) || null;
      } catch {
        return null;
      }
    }
  }

  forcarComoAdmin(): void {
    const usuario = this.getUsuarioLogado();
    if (usuario) {
      const usuarioAdmin = { ...usuario, tipo: 'ADMIN' as const };
      localStorage.setItem('usuario', JSON.stringify(usuarioAdmin));
      window.location.reload();
    }
  }
}

export default new AuthService();
