export interface ItemPedido {
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  descontoUnitario: number;
  subtotal: number;
}

export interface Pedido {
  id: number;
  status: string;
  valorTotal: number;
  dataCriacao: string;
  itens: ItemPedido[];
}
