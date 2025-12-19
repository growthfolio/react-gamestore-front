/**
 * Utilitário para gerar URLs de produtos
 */

export interface ProductUrlData {
  id: number;
  slug?: string;
  nome?: string;
}

/**
 * Gera URL do produto usando slug se disponível, senão usa ID
 */
export function getProductUrl(produto: ProductUrlData): string {
  if (produto.slug) {
    return `/produtos/${produto.slug}`;
  }
  
  // Fallback para ID (compatibilidade com produtos antigos)
  return `/produtos/${produto.id}`;
}

/**
 * Gera slug a partir do nome do produto (para casos onde não há slug)
 */
export function generateSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, '') // Remove hífens do início e fim
    .trim();
}
