/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { Usuario, LoginRequest, CadastroRequest, LoginResponse } from '../services/auth.service';
import { useToast } from './ToastContext';
import { getErrorMessage, ErrorMessages } from '../utils/errorHandler';

interface AuthContextData {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (dados: LoginRequest) => Promise<LoginResponse>;
  cadastrar: (dados: CadastroRequest) => Promise<Usuario>;
  logout: () => void;
  atualizarUsuario: (id: number, dados: Partial<CadastroRequest>) => Promise<Usuario>;
  forcarComoAdmin: () => void;
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
  const toast = useToast();

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
    try {
      const response = await authService.login(dados);
      
      const tipo = response.roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER';
      
      setUsuario({
        id: response.id,
        nome: response.nome,
        usuario: response.usuario,
        foto: response.foto,
        tipo,
        roles: response.roles
      });
      
      toast.success('Login realizado!', `Bem-vindo, ${response.nome}!`);
      return response;
    } catch (error) {
      toast.error('Falha no login', getErrorMessage(error, ErrorMessages.loginFailed));
      throw error;
    }
  };

  const cadastrar = async (dados: CadastroRequest): Promise<Usuario> => {
    try {
      const novoUsuario = await authService.cadastrar(dados);
      toast.success('Cadastro realizado!', 'Sua conta foi criada com sucesso.');
      return novoUsuario;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, 'Não foi possível criar sua conta.');
      toast.error('Erro no cadastro', errorMessage);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
    toast.info('Logout realizado', 'Até a próxima!');
  };

  const atualizarUsuario = async (id: number, dados: Partial<CadastroRequest>): Promise<Usuario> => {
    const usuarioAtualizado = await authService.atualizar(id, dados);
    setUsuario(usuarioAtualizado);
    return usuarioAtualizado;
  };

  const forcarComoAdmin = () => {
    authService.forcarComoAdmin();
    const usuarioAtualizado = authService.getUsuarioLogado();
    setUsuario(usuarioAtualizado);
  };

  const value: AuthContextData = {
    usuario,
    isAuthenticated: !!usuario,
    isAdmin: usuario?.tipo === 'ADMIN' || 
             usuario?.roles?.includes('ROLE_ADMIN') || 
             usuario?.roles?.includes('ADMIN') ||
             authService.isAdmin(),
    isLoading,
    login,
    cadastrar,
    logout,
    atualizarUsuario,
    forcarComoAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
