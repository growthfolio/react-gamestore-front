import api from './api';

export interface CarrinhoRequest {
  produtoId: number;
  quantidade: number;
}

export interface CarrinhoItem {
  id: number;
  produtoId: number;
  produtoNome: string;
  produtoImagem: string;
  plataforma: string;
  precoUnitario: number;
  descontoUnitario: number;
  precoComDesconto: number;
  quantidade: number;
  subtotal: number;
  disponivelEstoque: boolean;
  estoqueDisponivel: number;
  dataAdicionado: string;
}

export interface CarrinhoResumo {
  itens: CarrinhoItem[];
  totalItens: number;
  totalProdutos: number;
  subtotal: number;
  descontoTotal: number;
  total: number;
}

class CarrinhoService {
  async obterResumo(): Promise<CarrinhoResumo> {
    const response = await api.get<CarrinhoResumo>('/carrinho');
    return response.data;
  }

  async adicionar(dados: CarrinhoRequest): Promise<void> {
    await api.post('/carrinho', dados);
  }

  async atualizarQuantidade(produtoId: number, quantidade: number): Promise<void> {
    await api.patch(`/carrinho/produto/${produtoId}`, null, {
      params: { quantidade }
    });
  }

  async removerItem(produtoId: number): Promise<void> {
    await api.delete(`/carrinho/produto/${produtoId}`);
  }

  async limpar(): Promise<void> {
    await api.delete('/carrinho');
  }

  async contarItens(): Promise<number> {
    const response = await api.get<number>('/carrinho/contagem');
    return response.data;
  }
}

export default new CarrinhoService();