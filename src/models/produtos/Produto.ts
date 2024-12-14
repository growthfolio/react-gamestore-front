export default interface Produto {
    id: number;
    nome: string; // Nome do produto.
    descricao: string; // Descrição detalhada do produto.
    preco: number; // Preço do produto.
    desconto?: number; // Percentual de desconto (opcional).
    estoque: number; // Quantidade disponível em estoque.
    plataforma: string; // Ex.: "PlayStation", "Xbox", "PC", etc.
    categoriaId: number; // Relacionamento com uma categoria específica.
    desenvolvedor: string; // Nome do desenvolvedor do jogo.
    publisher: string; // Nome da publisher (distribuidora).
    dataLancamento: Date; // Data de lançamento do produto.
    imagens: string[]; // Lista de URLs para imagens do produto.
    ativo: boolean; // Indica se o produto está disponível para venda.
  }
  