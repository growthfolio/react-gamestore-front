export default interface Categoria {
    id?: number;
    tipo: string; // Nome ou tipo da categoria, como "RPG", "Ação", etc.
    nome: string; // Alias para tipo (compatibilidade)
    descricao?: string; // Uma breve descrição da categoria.
    icone?: string; // URL ou referência ao ícone da categoria.
    ativo: boolean; // Indica se a categoria está ativa ou não.
    dataCriacao?: Date; // Data de criação da categoria.
  }
  