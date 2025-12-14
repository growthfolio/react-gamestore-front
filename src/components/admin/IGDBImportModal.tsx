import React, { useState } from 'react';
import {
  GameController,
  CloudArrowDown,
  X,
  CurrencyDollar,
  Package,
  Percent,
  CalendarBlank,
  Tag,
  Desktop,
  Star,
  Clock,
  Lightning,
  Info,
} from '@phosphor-icons/react';
import { IgdbSearchResult } from '../../services/igdb.service';

type ImportMode = 'pending' | 'active';

interface IGDBImportModalProps {
  game: IgdbSearchResult;
  onClose: () => void;
  onImportPending: () => void;
  onImportActive: (comercialData: {
    preco: number;
    estoque: number;
    desconto: number;
  }) => void;
  isLoading?: boolean;
}

export const IGDBImportModal: React.FC<IGDBImportModalProps> = ({
  game,
  onClose,
  onImportPending,
  onImportActive,
  isLoading = false,
}) => {
  const [mode, setMode] = useState<ImportMode>('pending');
  const [preco, setPreco] = useState<number>(0);
  const [estoque, setEstoque] = useState<number>(0);
  const [desconto, setDesconto] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'pending') {
      onImportPending();
    } else {
      onImportActive({ preco, estoque, desconto });
    }
  };

  const precoFinal = preco > 0 && desconto > 0 
    ? preco * (1 - desconto / 100) 
    : preco;

  const canActivate = preco > 0 && estoque >= 0;

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

          {/* Import Mode Selection */}
          <div className="p-6 border-b border-neutral-800">
            <h4 className="text-sm font-semibold text-neutral-300 mb-4">
              Modo de Importação
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pending Mode */}
              <button
                type="button"
                onClick={() => setMode('pending')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  mode === 'pending'
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={24} className={mode === 'pending' ? 'text-primary-400' : 'text-neutral-500'} />
                  <span className={`font-semibold ${mode === 'pending' ? 'text-primary-400' : 'text-neutral-300'}`}>
                    Pré-Cadastro
                  </span>
                  <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 text-xs rounded">
                    Recomendado
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Importa o jogo para revisão posterior. Você poderá definir preço e estoque na tela de pré-cadastros.
                </p>
              </button>

              {/* Active Mode */}
              <button
                type="button"
                onClick={() => setMode('active')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  mode === 'active'
                    ? 'border-accent-500 bg-accent-500/10'
                    : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Lightning size={24} className={mode === 'active' ? 'text-accent-400' : 'text-neutral-500'} />
                  <span className={`font-semibold ${mode === 'active' ? 'text-accent-400' : 'text-neutral-300'}`}>
                    Ativar Agora
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Importa e ativa o jogo imediatamente. Requer definir preço e estoque agora.
                </p>
              </button>
            </div>
          </div>

          {/* Commercial Data Form - Only for Active Mode */}
          {mode === 'active' && (
            <div className="p-6">
              <h4 className="text-sm font-semibold text-neutral-300 mb-4 flex items-center gap-2">
                <Package size={16} />
                Dados Comerciais
                <span className="text-accent-400">*</span>
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
                    required={mode === 'active'}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500 transition-colors"
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
                    value={estoque || ''}
                    onChange={(e) => setEstoque(Number(e.target.value))}
                    placeholder="0"
                    min="0"
                    required={mode === 'active'}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500 transition-colors"
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
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-accent-500 transition-colors"
                  />
                </div>
              </div>

              {/* Preview de Preço */}
              {preco > 0 && (
                <div className="mt-4 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
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
          )}

          {/* Info Box for Pending Mode */}
          {mode === 'pending' && (
            <div className="p-6">
              <div className="p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg flex gap-3">
                <Info size={20} className="text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-primary-300 font-medium mb-1">
                    O jogo será importado como pré-cadastro
                  </p>
                  <p className="text-xs text-primary-400/70">
                    Após a importação, acesse <strong>Admin → Pré-Cadastros</strong> para definir preço, 
                    estoque e ativar o produto para venda.
                  </p>
                </div>
              </div>
            </div>
          )}
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
          
          {mode === 'pending' ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-primary flex-1 justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Clock size={18} />
                  Importar como Pré-Cadastro
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !canActivate}
              className="flex-1 justify-center px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Lightning size={18} weight="fill" />
                  Importar e Ativar
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IGDBImportModal;
