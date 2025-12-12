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
    const dadosEnvio = {
      ...dados,
      email: dados.usuario // Adiciona email como cópia do usuario
    };
    const response = await api.post<Usuario>('/usuarios/cadastrar', dadosEnvio);
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
   * Verifica se o usuário é admin tentando acessar endpoint admin
   */
  async verificarSeEhAdmin(): Promise<boolean> {
    try {
      console.log('🔍 Testando acesso ao endpoint /usuarios/all...');
      const usuarios = await this.listarTodos();
      console.log('✅ Acesso permitido! Usuários encontrados:', usuarios.length);
      return true; // Se conseguiu acessar, é admin
    } catch (error: any) {
      console.log('❌ Acesso negado ao endpoint admin:', error.response?.status, error.message);
      return false; // Se deu erro 403, não é admin
    }
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

  /**
   * Busca dados completos do usuário atual
   */
  async buscarDadosCompletos(): Promise<Usuario | null> {
    const usuario = this.getUsuarioLogado();
    if (!usuario?.id) return null;
    
    try {
      // Tenta buscar por ID primeiro
      return await this.buscarPorId(usuario.id);
    } catch {
      // Se falhar, tenta buscar na lista de todos (pode funcionar melhor)
      try {
        const usuarios = await this.listarTodos();
        return usuarios.find(u => u.id === usuario.id) || null;
      } catch {
        return null;
      }
    }
  }

  /**
   * Força o usuário como admin (temporário - para quando backend está com problemas)
   */
  forcarComoAdmin(): void {
    const usuario = this.getUsuarioLogado();
    if (usuario) {
      const usuarioAdmin = { ...usuario, tipo: 'ADMIN' as const };
      localStorage.setItem('usuario', JSON.stringify(usuarioAdmin));
      console.log('👑 Usuário forçado como ADMIN');
      window.location.reload();
    }
  }
}

// Expor no window para debug
if (typeof window !== 'undefined') {
  (window as any).forcarAdmin = () => {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuario.id) {
      usuario.tipo = 'ADMIN';
      localStorage.setItem('usuario', JSON.stringify(usuario));
      console.log('👑 Forçado como ADMIN!');
      window.location.reload();
    } else {
      console.log('❌ Nenhum usuário logado');
    }
  };
}

export default new AuthService();
