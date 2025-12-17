/**
 * Tipos para mídia estruturada (imagens e vídeos)
 * Compatível com os DTOs do backend
 */

// ==================== IMAGENS ====================

export type TipoImagem = 'CAPA' | 'SCREENSHOT' | 'ARTWORK' | 'LOGO' | 'BANNER' | 'THUMBNAIL';

/**
 * URLs de imagem em múltiplos tamanhos (IGDB)
 */
export interface ImagemUrls {
  micro: string | null;          // 35x35 - para micro ícones
  thumb: string | null;          // 90x90 - para listas compactas
  coverSmall: string | null;     // 90x128
  coverBig: string | null;       // 264x374
  screenshotMed: string | null;  // 569x320
  screenshotBig: string | null;  // 889x500
  screenshotHuge: string | null; // 1280x720
  hd720: string | null;          // 1280x720
  hd1080: string | null;         // 1920x1080
  logoMed: string | null;        // 284x160
}

/**
 * Imagem de produto com metadados e URLs
 */
export interface ImagemMedia {
  id: number;
  tipo: TipoImagem;
  imagemPrincipal: boolean;
  ordem: number;
  larguraOriginal: number | null;
  alturaOriginal: number | null;
  imageIdIgdb: string | null;
  urlOriginal: string;
  urls: ImagemUrls | null;
}

// ==================== VÍDEOS ====================

export type TipoVideo = 'TRAILER' | 'GAMEPLAY' | 'REVIEW' | 'TEASER' | 'OUTRO';

/**
 * Thumbnails de vídeo do YouTube
 */
export interface VideoThumbs {
  defaultThumb: string | null;  // 120x90
  medium: string | null;        // 320x180
  high: string | null;          // 480x360
  standard: string | null;      // 640x480
  maxres: string | null;        // 1280x720
}

/**
 * URLs de vídeo (YouTube)
 */
export interface VideoUrls {
  embed: string | null;         // URL para iframe
  watch: string | null;         // URL para abrir no YouTube
  thumbnails: VideoThumbs | null;
}

/**
 * Vídeo de produto com metadados e URLs
 */
export interface VideoMedia {
  id: number;
  titulo: string;
  tipo: TipoVideo;
  ordem: number;
  videoId: string;
  urls: VideoUrls | null;
}

// ==================== PRODUTO DETALHE ====================

export interface MidiaCount {
  totalImagens: number;
  screenshots: number;
  artworks: number;
  videos: number;
}

export interface Midia {
  capa: ImagemMedia | null;
  imagens: ImagemMedia[];
  screenshots: ImagemMedia[];
  artworks: ImagemMedia[];
  videos: VideoMedia[];
  contagem: MidiaCount;
}

export interface PlataformaResumo {
  id: number;
  nome: string;
  abreviacao: string;
  slug: string;
}

export interface GeneroResumo {
  id: number;
  nome: string;
  slug: string;
}

export interface CategoriaDetalhe {
  id: number;
  tipo: string;
  icone: string;
  slug: string;
}

export interface OrigemExterna {
  origem: string;   // 'IGDB', 'STEAM', etc
  idExterno: string;
  urlExterna: string;
}

export type StatusJogo = 'RELEASED' | 'ALPHA' | 'BETA' | 'EARLY_ACCESS' | 'CANCELLED' | 'RUMORED' | 'DELISTED';

/**
 * Produto detalhado com mídia estruturada
 * Usado na página de detalhe do produto
 */
export interface ProdutoDetalhe {
  id: number;
  nome: string;
  slug: string;
  descricao: string;
  descricaoCompleta: string | null;
  preco: number;
  precoComDesconto: number;
  desconto: number;
  estoque: number;
  emEstoque: boolean;
  ativo: boolean;
  
  // Informações do jogo
  plataforma: string;
  desenvolvedor: string;
  publisher: string;
  dataLancamento: string;
  status: StatusJogo;
  
  // Ratings
  ratingIgdb: number | null;
  mediaAvaliacoes: number | null;
  totalAvaliacoes: number | null;
  totalVotosExternos: number | null;
  
  // Relacionamentos
  categoria: CategoriaDetalhe | null;
  plataformas: PlataformaResumo[];
  generos: GeneroResumo[];
  
  // Mídia estruturada
  midia: Midia;
  
  // Origem externa
  origemExterna: OrigemExterna | null;
}

// ==================== HELPERS ====================

/**
 * Obtém a melhor URL de imagem disponível para um contexto específico
 * @param imagem Objeto ImagemMedia
 * @param context Contexto de uso ('card', 'gallery', 'hero', 'thumb')
 */
export function getBestImageUrl(imagem: ImagemMedia | null, context: 'card' | 'gallery' | 'hero' | 'thumb' = 'card'): string | null {
  if (!imagem) return null;
  
  const urls = imagem.urls;
  if (!urls) return imagem.urlOriginal;
  
  switch (context) {
    case 'hero':
      return urls.hd1080 || urls.hd720 || urls.screenshotHuge || imagem.urlOriginal;
    case 'gallery':
      return urls.screenshotBig || urls.screenshotHuge || urls.hd720 || imagem.urlOriginal;
    case 'card':
      return urls.coverBig || urls.screenshotMed || imagem.urlOriginal;
    case 'thumb':
      return urls.thumb || urls.coverSmall || imagem.urlOriginal;
    default:
      return imagem.urlOriginal;
  }
}

/**
 * Obtém a thumbnail de vídeo para um contexto específico
 * Nota: maxres (1280x720) nem sempre está disponível no YouTube
 * para vídeos mais antigos, então fazemos fallback progressivo
 */
export function getBestVideoThumb(video: VideoMedia | null, context: 'small' | 'medium' | 'large' = 'medium'): string | null {
  if (!video) return null;
  
  const thumbs = video.urls?.thumbnails;
  
  // Fallback: construir URL diretamente do videoId se não houver thumbnails estruturadas
  const buildFallbackUrl = (quality: 'maxresdefault' | 'sddefault' | 'hqdefault' | 'mqdefault' | 'default') => {
    if (!video.videoId) return null;
    return `https://img.youtube.com/vi/${video.videoId}/${quality}.jpg`;
  };
  
  switch (context) {
    case 'large':
      // maxres nem sempre existe, então tentamos várias opções
      return thumbs?.maxres || thumbs?.standard || thumbs?.high || buildFallbackUrl('hqdefault');
    case 'medium':
      return thumbs?.high || thumbs?.medium || thumbs?.defaultThumb || buildFallbackUrl('mqdefault');
    case 'small':
      return thumbs?.medium || thumbs?.defaultThumb || buildFallbackUrl('default');
    default:
      return thumbs?.high || buildFallbackUrl('hqdefault');
  }
}
