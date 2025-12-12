import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import favoritosService, { Favorito } from '../services/favoritos.service';
import { useAuth } from './AuthContext';

interface FavoritosContextData {
  favoritos: Favorito[];
  isLoading: boolean;
  isFavorito: (produtoId: number) => boolean;
  toggleFavorito: (produtoId: number) => Promise<boolean>;
  recarregarFavoritos: () => Promise<void>;
  totalFavoritos: number;
}

const FavoritosContext = createContext<FavoritosContextData>({} as FavoritosContextData);

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de um FavoritosProvider');
  }
  return context;
};

interface FavoritosProviderProps {
  children: ReactNode;
}

export const FavoritosProvider = ({ children }: FavoritosProviderProps) => {
  const { isAuthenticated } = useAuth();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega favoritos ao autenticar
  useEffect(() => {
    if (isAuthenticated) {
      recarregarFavoritos();
    } else {
      setFavoritos([]);
    }
  }, [isAuthenticated]);

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
    return favoritos.some((fav) => fav.produto.id === produtoId);
  };

  const toggleFavorito = async (produtoId: number): Promise<boolean> => {
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

  const value: FavoritosContextData = {
    favoritos,
    isLoading,
    isFavorito,
    toggleFavorito,
    recarregarFavoritos,
    totalFavoritos: favoritos.length,
  };

  return <FavoritosContext.Provider value={value}>{children}</FavoritosContext.Provider>;
};
