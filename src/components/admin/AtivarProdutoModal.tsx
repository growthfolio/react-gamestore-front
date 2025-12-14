import React, { useState } from 'react';
import {
  GameController,
  CheckCircle,
  X,
  CurrencyDollar,
  Package,
  Percent,
  CalendarBlank,
  Tag,
  Star,
  Lightning,
  Warning,
} from '@phosphor-icons/react';
import { Produto } from '../../models/produtos/Produto';

interface AtivarProdutoModalProps {
  produto: Produto;
  onClose: () => void;
  onConfirm: (dados: {
    preco: number;
    estoque: number;
    desconto: number;
  }) => void;
  isLoading?: boolean;
}

export const AtivarProdutoModal: React.FC<AtivarProdutoModalProps> = ({
  produto,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [preco, setPreco] = useState<number>(produto.preco > 0 ? produto.preco : 0);
  const [estoque, setEstoque] = useState<number>(produto.estoque || 0);
  const [desconto, setDesconto] = useState<number>(produto.desconto || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ preco, estoque, desconto });
  };

  const precoFinal = preco > 0 && desconto > 0 
    ? preco * (1 - desconto / 100) 
    : preco;

  const canActivate = preco > 0;

  // Pega a imagem principal
  const imagemPrincipal = produto.imagens && produto.imagens.length > 0 
    ? produto.imagens[0] 
    : null;

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-accent-600 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <CheckCircle size={24} className="text-white" weight="fill" />
            <h2 className="text-xl font-bold text-white">Ativar Produto</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          {/* Product Preview */}
          <div className="p-6 border-b border-neutral-800">
            <div className="flex gap-6">
              {/* Cover Image */}
              <div className="flex-shrink-0">
                {imagemPrincipal ? (
                  <img
                    src={imagemPrincipal}
                    alt={produto.nome}
                    className="w-28 h-40 object-cover rounded-lg border border-neutral-700"
                  />
                ) : (
                  <div className="w-28 h-40 bg-neutral-800 rounded-lg border border-neutral-700 flex items-center justify-center">
                    <GameController size={36} className="text-neutral-600" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white mb-2">{produto.nome}</h3>
                
                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {produto.dataLancamento && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-neutral-800 rounded-lg text-xs text-neutral-400">
                      <CalendarBlank size={12} />
                      {produto.dataLancamento}
                    </span>
                  )}
                  {produto.mediaAvaliacoes > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-accent-500/20 rounded-lg text-xs text-accent-400">
                      <Star size={12} weight="fill" />
                      {produto.mediaAvaliacoes.toFixed(1)}
                    </span>
                  )}
                  {produto.categoria && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary-500/20 rounded-lg text-xs text-primary-400">
                      <Tag size={12} />
                      {produto.categoria.tipo}
                    </span>
                  )}
                </div>

                {/* Descrição */}
                {produto.descricao && (
                  <p className="text-sm text-neutral-400 line-clamp-2">
                    {produto.descricao}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Commercial Data Form */}
          <div className="p-6">
            <h4 className="text-sm font-semibold text-neutral-300 mb-4 flex items-center gap-2">
              <Package size={16} />
              Definir Dados Comerciais
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Preço */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-400 mb-2">
                  <CurrencyDollar size={16} />
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  value={preco || ''}
                  onChange={(e) => setPreco(Number(e.target.value))}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>

              {/* Estoque */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-400 mb-2">
                  <Package size={16} />
                  Estoque *
                </label>
                <input
                  type="number"
                  value={estoque}
                  onChange={(e) => setEstoque(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  required
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>

              {/* Desconto */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-400 mb-2">
                  <Percent size={16} />
                  Desconto (%)
                </label>
                <input
                  type="number"
                  value={desconto || ''}
                  onChange={(e) => setDesconto(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            {/* Preview de Preço */}
            {preco > 0 && (
              <div className="mt-4 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                <p className="text-sm text-neutral-400 mb-2">Preview de preço no catálogo:</p>
                <div className="flex items-end gap-3">
                  {desconto > 0 ? (
                    <>
                      <span className="text-neutral-500 line-through text-lg">
                        R$ {preco.toFixed(2)}
                      </span>
                      <span className="text-2xl font-bold text-green-400">
                        R$ {precoFinal.toFixed(2)}
                      </span>
                      <span className="px-2 py-1 bg-accent-500 text-neutral-900 text-xs font-bold rounded">
                        -{desconto}%
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-green-400">
                      R$ {preco.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Warning */}
            {!canActivate && (
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex gap-2">
                <Warning size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">
                  Defina um preço maior que zero para ativar o produto.
                </p>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 bg-neutral-800/30 border-t border-neutral-800 flex gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="btn-ghost flex-1 justify-center"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !canActivate}
            className="flex-1 justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Lightning size={18} weight="fill" />
                Ativar Produto
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AtivarProdutoModal;
