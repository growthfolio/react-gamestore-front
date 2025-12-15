import { useState } from 'react';
import { X, ShoppingCart, Heart, Star, Eye } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { Produto } from '../../models/produtos/Produto';
import { useAuth } from '../../contexts/AuthContext';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useFavoritos } from '../../contexts/FavoritosContext';

interface ProductQuickViewProps {
  produto: Produto | null;
  isOpen: boolean;
  onClose: () => void;
  onLoginRequired: (action: 'favorite' | 'cart') => void;
}

const ProductQuickView = ({ produto, isOpen, onClose, onLoginRequired }: ProductQuickViewProps) => {
  const { isAuthenticated } = useAuth();
  const { adicionarItem } = useCarrinho();
  const { toggleFavorito, isFavorito } = useFavoritos();
  const [quantidade, setQuantidade] = useState(1);
  const [imagemAtual, setImagemAtual] = useState(0);

  if (!isOpen || !produto) return null;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      onLoginRequired('cart');
      return;
    }
    try {
      await adicionarItem({ produtoId: produto.id, quantidade });
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  const handleToggleFavorito = async () => {
    if (!isAuthenticated) {
      onLoginRequired('favorite');
      return;
    }
    try {
      await toggleFavorito(produto.id);
    } catch (error) {
      console.error('Erro ao favoritar:', error);
    }
  };

  const renderStars = (nota: number = 4.8) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        weight={i < nota ? 'fill' : 'regular'}
        className={i < nota ? 'text-yellow-400' : 'text-neutral-600'}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg border border-neutral-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-neutral-100">Preview Rápido</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Imagens */}
            <div className="space-y-4">
              <div className="aspect-video bg-neutral-800 rounded-lg overflow-hidden">
                {produto.imagens && produto.imagens.length > 0 ? (
                  <img
                    src={produto.imagens[imagemAtual]}
                    alt={produto.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-neutral-600 text-4xl">
                    🎮
                  </div>
                )}
              </div>

              {produto.imagens && produto.imagens.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {produto.imagens.slice(0, 4).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setImagemAtual(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-colors ${
                        imagemAtual === index ? 'border-primary-500' : 'border-neutral-700'
                      }`}
                    >
                      <img src={img} alt={`${produto.nome} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-neutral-100 mb-2">{produto.nome}</h1>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">{renderStars()}</div>
                  <span className="text-neutral-400 text-sm">(4.8)</span>
                </div>

                {produto.plataforma && (
                  <span className="inline-block bg-neutral-800 text-neutral-300 px-2 py-1 rounded text-sm mb-3">
                    {produto.plataforma}
                  </span>
                )}
              </div>

              {/* Preço */}
              <div className="bg-neutral-800 p-4 rounded-lg">
                {produto.desconto && produto.desconto > 0 ? (
                  <>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-neutral-500 line-through">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                      <span className="bg-accent-500 text-neutral-950 px-2 py-1 rounded text-sm font-bold">
                        -{produto.desconto}%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-accent-500">
                      R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}
                    </div>
                  </>
                ) : (
                  <div className="text-2xl font-bold text-accent-500">
                    R$ {produto.preco.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Descrição resumida */}
              <div>
                <p className="text-neutral-300 text-sm line-clamp-3">
                  {produto.descricao}
                </p>
              </div>

              {/* Estoque */}
              <div className="text-sm">
                {produto.estoque && produto.estoque > 0 ? (
                  <span className="text-success-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                    {produto.estoque} em estoque
                  </span>
                ) : (
                  <span className="text-error-500 font-bold">Esgotado</span>
                )}
              </div>

              {/* Ações */}
              {produto.ativo && produto.estoque > 0 && (
                <div className="space-y-3">
                  {/* Quantidade */}
                  <div className="flex items-center gap-3">
                    <label className="text-neutral-300 text-sm">Qtd:</label>
                    <div className="flex items-center border border-neutral-700 rounded overflow-hidden">
                      <button
                        onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                        className="px-2 py-1 hover:bg-neutral-800 text-neutral-300 transition-colors text-sm"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantidade}
                        onChange={(e) => setQuantidade(Math.max(1, Math.min(produto.estoque, Number(e.target.value))))}
                        className="w-12 text-center border-x border-neutral-700 bg-neutral-900 text-neutral-100 text-sm"
                        min="1"
                        max={produto.estoque}
                      />
                      <button
                        onClick={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))}
                        className="px-2 py-1 hover:bg-neutral-800 text-neutral-300 transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddToCart}
                      className="btn-primary flex-1 py-2 px-4 flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingCart size={18} weight="bold" />
                      {isAuthenticated ? 'Adicionar' : 'Login p/ Comprar'}
                    </button>

                    <button
                      onClick={handleToggleFavorito}
                      className={`p-2 rounded border-2 transition-colors ${
                        isAuthenticated && isFavorito(produto.id)
                          ? 'bg-red-500/10 border-red-500 text-red-500'
                          : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-red-500 hover:text-red-500'
                      }`}
                    >
                      <Heart size={18} weight={isAuthenticated && isFavorito(produto.id) ? 'fill' : 'regular'} />
                    </button>
                  </div>

                  {/* Link para detalhes completos */}
                  <Link
                    to={`/produtos/${produto.id}`}
                    onClick={onClose}
                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-2 px-4 rounded transition-colors border border-neutral-600 flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye size={18} />
                    Ver Detalhes Completos
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
