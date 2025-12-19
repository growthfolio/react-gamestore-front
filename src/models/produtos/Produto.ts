export interface CategoriaResumo {
  id: number;
  tipo: string;
  icone: string;
}

export interface ProdutoResumo {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  precoComDesconto: number;
  plataforma: string;
  emEstoque: boolean;
  imagemPrincipal: string;
}

export interface Produto {
  id: number;
  nome: string; // Nome do produto.
  slug?: string; // URL amigável do produto.
  descricao: string; // Descrição detalhada do produto.
  preco: number; // Preço do produto.
  precoComDesconto: number;
  desconto: number; // Percentual de desconto.
  estoque: number; // Quantidade disponível em estoque.
  emEstoque: boolean;
  plataforma: string; // Ex.: "PlayStation", "Xbox", "PC", etc.
  categoria: CategoriaResumo; // Relacionamento com uma categoria específica.
  desenvolvedor: string; // Nome do desenvolvedor do jogo.
  publisher: string; // Nome da publisher (distribuidora).
  dataLancamento: string; // Data de lançamento do produto.
  imagens: string[]; // Lista de URLs para imagens do produto.
  ativo: boolean; // Indica se o produto está disponível para venda.
  mediaAvaliacoes: number;
  totalAvaliacoes: number;
}
