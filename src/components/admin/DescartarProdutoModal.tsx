import React from 'react';
import {
  GameController,
  Trash,
  X,
  Warning,
  CalendarBlank,
  Tag,
} from '@phosphor-icons/react';
import { Produto } from '../../models/produtos/Produto';

interface DescartarProdutoModalProps {
  produto: Produto;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DescartarProdutoModal: React.FC<DescartarProdutoModalProps> = ({
  produto,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  // Pega a imagem principal
  const imagemPrincipal = produto.imagens && produto.imagens.length > 0 
    ? produto.imagens[0] 
    : null;

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Trash size={24} className="text-white" weight="fill" />
            <h2 className="text-xl font-bold text-white">Descartar Pré-Cadastro</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Preview */}
          <div className="flex gap-4 mb-6">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              {imagemPrincipal ? (
                <img
                  src={imagemPrincipal}
                  alt={produto.nome}
                  className="w-20 h-28 object-cover rounded-lg border border-neutral-700"
                />
              ) : (
                <div className="w-20 h-28 bg-neutral-800 rounded-lg border border-neutral-700 flex items-center justify-center">
                  <GameController size={28} className="text-neutral-600" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white mb-2 truncate">{produto.nome}</h3>
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-2">
                {produto.dataLancamento && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-400">
                    <CalendarBlank size={10} />
                    {produto.dataLancamento}
                  </span>
                )}
                {produto.categoria && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-500/20 rounded text-xs text-primary-400">
                    <Tag size={10} />
                    {produto.categoria.tipo}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
            <Warning size={24} className="text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-300 font-medium mb-1">
                Atenção: Esta ação é irreversível
              </p>
              <p className="text-xs text-red-400/70">
                O pré-cadastro será permanentemente removido do sistema. 
                Você poderá importar novamente o jogo da IGDB se necessário.
              </p>
            </div>
          </div>
        </div>

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
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Trash size={18} weight="fill" />
                Descartar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescartarProdutoModal;
