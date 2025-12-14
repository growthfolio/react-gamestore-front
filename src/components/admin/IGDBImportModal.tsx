import React, { useState } from 'react';
import {
  GameController,
  CloudArrowDown,
  X,
  CurrencyDollar,
  Package,
  Percent,
  ToggleRight,
  CalendarBlank,
  Tag,
  Desktop,
  Star,
} from '@phosphor-icons/react';
import { IgdbSearchResult } from '../../services/igdb.service';

interface IGDBImportModalProps {
  game: IgdbSearchResult;
  onClose: () => void;
  onConfirm: (comercialData: {
    preco: number;
    estoque: number;
    desconto: number;
    ativo: boolean;
  }) => void;
  isLoading?: boolean;
}

export const IGDBImportModal: React.FC<IGDBImportModalProps> = ({
  game,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [preco, setPreco] = useState<number>(0);
  const [estoque, setEstoque] = useState<number>(0);
  const [desconto, setDesconto] = useState<number>(0);
  const [ativo, setAtivo] = useState<boolean>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ preco, estoque, desconto, ativo });
  };

  const precoFinal = preco > 0 && desconto > 0 
    ? preco * (1 - desconto / 100) 
    : preco;

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <CloudArrowDown size={24} className="text-white" weight="fill" />
            <h2 className="text-xl font-bold text-white">Importar Jogo da IGDB</h2>
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
          {/* Game Preview */}
          <div className="p-6 border-b border-neutral-800">
            <div className="flex gap-6">
              {/* Cover Image */}
              <div className="flex-shrink-0">
                {game.urlCapa ? (
                  <img
                    src={game.urlCapa}
                    alt={game.nome}
                    className="w-32 h-44 object-cover rounded-lg border border-neutral-700"
                  />
                ) : (
                  <div className="w-32 h-44 bg-neutral-800 rounded-lg border border-neutral-700 flex items-center justify-center">
                    <GameController size={40} className="text-neutral-600" />
                  </div>
                )}
              </div>

              {/* Game Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white mb-2">{game.nome}</h3>
                
                {/* Metadata */}
                <div className="flex flex-wrap gap-3 mb-3">
                  {game.dataLancamento && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-neutral-800 rounded-lg text-xs text-neutral-400">
                      <CalendarBlank size={14} />
                      {game.dataLancamento}
                    </span>
                  )}
                  {game.rating > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-accent-500/20 rounded-lg text-xs text-accent-400">
                      <Star size={14} weight="fill" />
                      {game.rating.toFixed(1)}
                    </span>
                  )}
                </div>

                {/* Plataformas */}
                {game.plataformas && game.plataformas.length > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <Desktop size={14} className="text-neutral-500" />
                    <span className="text-sm text-neutral-400">
                      {game.plataformas.slice(0, 4).join(', ')}
                      {game.plataformas.length > 4 && ` +${game.plataformas.length - 4}`}
                    </span>
                  </div>
                )}

                {/* Gêneros */}
                {game.generos && game.generos.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <Tag size={14} className="text-neutral-500" />
                    <div className="flex flex-wrap gap-1">
                      {game.generos.slice(0, 4).map((genero, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded text-xs"
                        >
                          {genero}
                        </span>
                      ))}
                      {game.generos.length > 4 && (
                        <span className="text-xs text-neutral-500">
                          +{game.generos.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Descrição */}
                {game.descricao && (
                  <p className="text-sm text-neutral-400 line-clamp-3">
                    {game.descricao}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Commercial Data Form */}
          <div className="p-6">
            <h4 className="text-sm font-semibold text-neutral-300 mb-4 flex items-center gap-2">
              <Package size={16} />
              Dados Comerciais
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  min="0"
                  required
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              {/* Estoque */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-400 mb-2">
                  <Package size={16} />
                  Estoque
                </label>
                <input
                  type="number"
                  value={estoque || ''}
                  onChange={(e) => setEstoque(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
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
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              {/* Ativo Toggle */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-400">
                  <ToggleRight size={16} />
                  Produto Ativo
                </label>
                <button
                  type="button"
                  onClick={() => setAtivo(!ativo)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    ativo ? 'bg-primary-500' : 'bg-neutral-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      ativo ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={ativo ? 'text-green-400 text-sm' : 'text-neutral-500 text-sm'}>
                  {ativo ? 'Sim' : 'Não'}
                </span>
              </div>
            </div>

            {/* Preview de Preço */}
            {preco > 0 && (
              <div className="mt-6 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                <p className="text-sm text-neutral-400 mb-2">Preview de preço:</p>
                <div className="flex items-end gap-3">
                  {desconto > 0 ? (
                    <>
                      <span className="text-neutral-500 line-through text-lg">
                        R$ {preco.toFixed(2)}
                      </span>
                      <span className="text-2xl font-bold text-accent-400">
                        R$ {precoFinal.toFixed(2)}
                      </span>
                      <span className="px-2 py-1 bg-accent-500 text-neutral-900 text-xs font-bold rounded">
                        -{desconto}%
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-accent-400">
                      R$ {preco.toFixed(2)}
                    </span>
                  )}
                </div>
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
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading || preco <= 0}
            className="btn-primary flex-1 justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <CloudArrowDown size={18} />
                Importar e Cadastrar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IGDBImportModal;
