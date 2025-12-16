import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import favoritosService, { Favorito } from '../services/favoritos.service';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import produtoService from '../services/produto.service';

interface LocalFavorito {
  produtoId: number;
  nome?: string;
  preco?: number;
  desconto?: number;
  imagem?: string;
}

interface FavoritosContextData {
  favoritos: Favorito[];
  localFavoritos: LocalFavorito[];
  isLoading: boolean;
  isFavorito: (produtoId: number) => boolean;
  toggleFavorito: (produtoId: number) => Promise<boolean>;
  recarregarFavoritos: () => Promise<void>;
  totalFavoritos: number;
  sincronizarFavoritosLocais: () => Promise<void>;
}

const FavoritosContext = createContext<FavoritosContextData>({} as FavoritosContextData);

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de um FavoritosProvider');
  }
  return context;
};

const LOCAL_FAV_KEY = 'gamestore_favoritos_local';

interface FavoritosProviderProps {
  children: ReactNode;
}

export const FavoritosProvider = ({ children }: FavoritosProviderProps) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [localFavoritos, setLocalFavoritos] = useState<LocalFavorito[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega favoritos locais
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_FAV_KEY);
    if (saved) {
      try {
        setLocalFavoritos(JSON.parse(saved));
      } catch {
        localStorage.removeItem(LOCAL_FAV_KEY);
      }
    }
  }, []);

  // Salva favoritos locais
  useEffect(() => {
    if (localFavoritos.length > 0) {
      localStorage.setItem(LOCAL_FAV_KEY, JSON.stringify(localFavoritos));
    } else {
      localStorage.removeItem(LOCAL_FAV_KEY);
    }
  }, [localFavoritos]);

  // Sincroniza ao logar
  useEffect(() => {
    if (isAuthenticated) {
      sincronizarFavoritosLocais().then(() => recarregarFavoritos());
    } else {
      setFavoritos([]);
    }
  }, [isAuthenticated]);

  const sincronizarFavoritosLocais = async () => {
    if (!isAuthenticated || localFavoritos.length === 0) return;
    
    try {
      for (const fav of localFavoritos) {
        try {
          await favoritosService.adicionar(fav.produtoId);
        } catch {
          // Ignora erros individuais
        }
      }
      setLocalFavoritos([]);
      localStorage.removeItem(LOCAL_FAV_KEY);
      toast.success('Favoritos sincronizados!', 'Seus favoritos foram salvos na sua conta.');
    } catch (error) {
      console.error('Erro ao sincronizar favoritos:', error);
    }
  };

  const recarregarFavoritos = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const response = await favoritosService.listar();
      setFavoritos(response.content || []);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      setFavoritos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorito = (produtoId: number): boolean => {
    if (isAuthenticated) {
      return favoritos.some((fav) => fav.produto.id === produtoId);
    }
    return localFavoritos.some((fav) => fav.produtoId === produtoId);
  };

  const toggleFavoritoLocal = async (produtoId: number): Promise<boolean> => {
    const jaEFavorito = localFavoritos.some(f => f.produtoId === produtoId);
    
    if (jaEFavorito) {
      setLocalFavoritos(prev => prev.filter(f => f.produtoId !== produtoId));
      return false;
    } else {
      try {
        const produto = await produtoService.buscarPorId(produtoId);
        setLocalFavoritos(prev => [...prev, {
          produtoId,
          nome: produto.nome,
          preco: produto.preco,
          desconto: produto.desconto,
          imagem: produto.imagens?.[0]
        }]);
        return true;
      } catch {
        return false;
      }
    }
  };

  const toggleFavorito = async (produtoId: number): Promise<boolean> => {
    if (!isAuthenticated) {
      return toggleFavoritoLocal(produtoId);
    }

    try {
      setIsLoading(true);
      const jaEFavorito = isFavorito(produtoId);
      
      if (jaEFavorito) {
        await favoritosService.remover(produtoId);
      } else {
        await favoritosService.adicionar(produtoId);
      }
      
      await recarregarFavoritos();
      return !jaEFavorito;
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const totalFavoritosCalc = isAuthenticated ? favoritos.length : localFavoritos.length;

  const value: FavoritosContextData = {
    favoritos,
    localFavoritos,
    isLoading,
    isFavorito,
    toggleFavorito,
    recarregarFavoritos,
    totalFavoritos: totalFavoritosCalc,
    sincronizarFavoritosLocais,
  };

  return <FavoritosContext.Provider value={value}>{children}</FavoritosContext.Provider>;
};
