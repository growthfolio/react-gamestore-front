import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import carrinhoService, { CarrinhoResumo, CarrinhoRequest } from '../services/carrinho.service';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { getErrorMessage } from '../utils/errorHandler';
import produtoService from '../services/produto.service';

interface LocalCartItem {
  produtoId: number;
  quantidade: number;
  nome?: string;
  preco?: number;
  desconto?: number;
  imagem?: string;
}

interface CarrinhoContextData {
  carrinho: CarrinhoResumo | null;
  itens: any[];
  localItens: LocalCartItem[];
  isLoading: boolean;
  adicionarItem: (dados: CarrinhoRequest) => Promise<void>;
  atualizarItem: (produtoId: number, quantidade: number) => Promise<void>;
  removerItem: (produtoId: number) => Promise<void>;
  limparCarrinho: () => Promise<void>;
  recarregarCarrinho: () => Promise<void>;
  totalItens: number;
  totalLocal: number;
  sincronizarCarrinhoLocal: () => Promise<void>;
}

const CarrinhoContext = createContext<CarrinhoContextData>({} as CarrinhoContextData);

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de um CarrinhoProvider');
  }
  return context;
};

const LOCAL_CART_KEY = 'gamestore_cart_local';

interface CarrinhoProviderProps {
  children: ReactNode;
}

export const CarrinhoProvider = ({ children }: CarrinhoProviderProps) => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [carrinho, setCarrinho] = useState<CarrinhoResumo | null>(null);
  const [localItens, setLocalItens] = useState<LocalCartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Carrega carrinho local do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_CART_KEY);
    if (saved) {
      try {
        setLocalItens(JSON.parse(saved));
      } catch {
        localStorage.removeItem(LOCAL_CART_KEY);
      }
    }
  }, []);

  // Salva carrinho local no localStorage
  useEffect(() => {
    if (localItens.length > 0) {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(localItens));
    } else {
      localStorage.removeItem(LOCAL_CART_KEY);
    }
  }, [localItens]);

  // Sincroniza carrinho local quando usuário loga
  useEffect(() => {
    if (isAuthenticated) {
      sincronizarCarrinhoLocal().then(() => recarregarCarrinho());
    } else {
      setCarrinho(null);
    }
  }, [isAuthenticated]);

  const sincronizarCarrinhoLocal = async () => {
    if (!isAuthenticated || localItens.length === 0) return;
    
    try {
      setIsLoading(true);
      for (const item of localItens) {
        try {
          await carrinhoService.adicionar({ produtoId: item.produtoId, quantidade: item.quantidade });
        } catch {
          // Ignora erros individuais
        }
      }
      setLocalItens([]);
      localStorage.removeItem(LOCAL_CART_KEY);
      toast.success('Carrinho sincronizado!', 'Seus itens foram adicionados ao carrinho.');
    } catch (error) {
      console.error('Erro ao sincronizar carrinho:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const recarregarCarrinho = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      const carrinhoData = await carrinhoService.obterResumo();
      setCarrinho(carrinhoData);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      setCarrinho(null);
    } finally {
      setIsLoading(false);
    }
  };

  const adicionarItemLocal = async (dados: CarrinhoRequest) => {
    try {
      const produto = await produtoService.buscarPorId(dados.produtoId);
      const existente = localItens.find(i => i.produtoId === dados.produtoId);
      
      if (existente) {
        setLocalItens(prev => prev.map(i => 
          i.produtoId === dados.produtoId 
            ? { ...i, quantidade: i.quantidade + dados.quantidade }
            : i
        ));
      } else {
        setLocalItens(prev => [...prev, {
          produtoId: dados.produtoId,
          quantidade: dados.quantidade,
          nome: produto.nome,
          preco: produto.preco,
          desconto: produto.desconto,
          imagem: produto.imagens?.[0]
        }]);
      }
      toast.success('Item adicionado!', 'Produto foi adicionado ao carrinho.');
    } catch (error) {
      toast.error('Erro', 'Não foi possível adicionar o item.');
      throw error;
    }
  };

  const adicionarItem = async (dados: CarrinhoRequest) => {
    if (!isAuthenticated) {
      return adicionarItemLocal(dados);
    }

    try {
      setIsLoading(true);
      await carrinhoService.adicionar(dados);
      await recarregarCarrinho();
      toast.success('Item adicionado!', 'Produto foi adicionado ao carrinho.');
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      toast.error('Erro ao adicionar', getErrorMessage(error, 'Não foi possível adicionar o item.'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarItem = async (produtoId: number, quantidade: number) => {
    if (!isAuthenticated) {
      if (quantidade <= 0) {
        setLocalItens(prev => prev.filter(i => i.produtoId !== produtoId));
      } else {
        setLocalItens(prev => prev.map(i => 
          i.produtoId === produtoId ? { ...i, quantidade } : i
        ));
      }
      return;
    }

    try {
      setIsLoading(true);
      await carrinhoService.atualizarQuantidade(produtoId, quantidade);
      await recarregarCarrinho();
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removerItem = async (produtoId: number) => {
    if (!isAuthenticated) {
      setLocalItens(prev => prev.filter(i => i.produtoId !== produtoId));
      toast.success('Item removido!', 'Produto foi removido do carrinho.');
      return;
    }

    try {
      setIsLoading(true);
      await carrinhoService.removerItem(produtoId);
      await recarregarCarrinho();
      toast.success('Item removido!', 'Produto foi removido do carrinho.');
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast.error('Erro ao remover', getErrorMessage(error, 'Não foi possível remover o item.'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const limparCarrinho = async () => {
    if (!isAuthenticated) {
      setLocalItens([]);
      return;
    }

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

  const totalItensCalc = isAuthenticated 
    ? (carrinho?.totalItens || 0) 
    : localItens.reduce((acc, i) => acc + i.quantidade, 0);

  const value: CarrinhoContextData = {
    carrinho,
    itens: carrinho?.itens || [],
    localItens,
    isLoading,
    adicionarItem,
    atualizarItem,
    removerItem,
    limparCarrinho,
    recarregarCarrinho,
    totalItens: totalItensCalc,
    totalLocal: localItens.reduce((acc, i) => acc + i.quantidade, 0),
    sincronizarCarrinhoLocal,
  };

  return <CarrinhoContext.Provider value={value}>{children}</CarrinhoContext.Provider>;
};
