import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { Usuario, LoginRequest, CadastroRequest, LoginResponse } from '../services/auth.service';

interface AuthContextData {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (dados: LoginRequest) => Promise<LoginResponse>;
  cadastrar: (dados: CadastroRequest) => Promise<Usuario>;
  logout: () => void;
  atualizarUsuario: (id: number, dados: Partial<CadastroRequest>) => Promise<Usuario>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega usuário do localStorage ao iniciar
  useEffect(() => {
    const carregarUsuario = () => {
      const usuarioLogado = authService.getUsuarioLogado();
      setUsuario(usuarioLogado);
      setIsLoading(false);
    };

    carregarUsuario();
  }, []);

  const login = async (dados: LoginRequest): Promise<LoginResponse> => {
    const response = await authService.login(dados);
    setUsuario({
      id: response.id,
      nome: response.nome,
      usuario: response.usuario,
      foto: response.foto,
      tipo: response.tipo,
    });
    return response;
  };

  const cadastrar = async (dados: CadastroRequest): Promise<Usuario> => {
    const novoUsuario = await authService.cadastrar(dados);
    return novoUsuario;
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  const atualizarUsuario = async (id: number, dados: Partial<CadastroRequest>): Promise<Usuario> => {
    const usuarioAtualizado = await authService.atualizar(id, dados);
    setUsuario(usuarioAtualizado);
    return usuarioAtualizado;
  };

  const value: AuthContextData = {
    usuario,
    isAuthenticated: !!usuario,
    isAdmin: usuario?.tipo === 'ADMIN',
    isLoading,
    login,
    cadastrar,
    logout,
    atualizarUsuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
