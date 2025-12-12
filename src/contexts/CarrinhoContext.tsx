import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import carrinhoService, { Carrinho, CarrinhoItemRequest } from '../services/carrinho.service';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CarrinhoContextData {
  carrinho: Carrinho | null;
  itens: any[];
  isLoading: boolean;
  adicionarItem: (dados: CarrinhoItemRequest) => Promise<void>;
  atualizarItem: (itemId: number, quantidade: number) => Promise<void>;
  removerItem: (itemId: number) => Promise<void>;
  limparCarrinho: () => Promise<void>;
  recarregarCarrinho: () => Promise<void>;
  totalItens: number;
}

const CarrinhoContext = createContext<CarrinhoContextData>({} as CarrinhoContextData);

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
};

interface CarrinhoProviderProps {
  children: ReactNode;
}

export const CarrinhoProvider = ({ children }: CarrinhoProviderProps) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [carrinho, setCarrinho] = useState<Carrinho | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega carrinho ao autenticar
  useEffect(() => {
    if (isAuthenticated) {
      recarregarCarrinho();
    } else {
      setCarrinho(null);
    }
  }, [isAuthenticated]);

  const recarregarCarrinho = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const carrinhoData = await carrinhoService.buscar();
      setCarrinho(carrinhoData);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const adicionarItem = async (dados: CarrinhoItemRequest) => {
    try {
      setIsLoading(true);
      await carrinhoService.adicionarItem(dados);
      await recarregarCarrinho();
      toast.success('Item adicionado!', 'Produto foi adicionado ao carrinho.');
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast.error('Erro ao adicionar', 'Não foi possível adicionar o item.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarItem = async (itemId: number, quantidade: number) => {
    try {
      setIsLoading(true);
      await carrinhoService.atualizarItem(itemId, quantidade);
      await recarregarCarrinho();
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removerItem = async (itemId: number) => {
    try {
      setIsLoading(true);
      await carrinhoService.removerItem(itemId);
      await recarregarCarrinho();
      toast.success('Item removido!', 'Produto foi removido do carrinho.');
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast.error('Erro ao remover', 'Não foi possível remover o item.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const limparCarrinho = async () => {
    try {
      setIsLoading(true);
      await carrinhoService.limpar();
      setCarrinho(null);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: CarrinhoContextData = {
    carrinho,
    itens: carrinho?.itens || [],
    isLoading,
    adicionarItem,
    atualizarItem,
    removerItem,
    limparCarrinho,
    recarregarCarrinho,
    totalItens: carrinho?.totalItens || 0,
  };

  return <CarrinhoContext.Provider value={value}>{children}</CarrinhoContext.Provider>;
};
