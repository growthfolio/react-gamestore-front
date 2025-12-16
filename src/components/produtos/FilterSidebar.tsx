import { useState, useEffect } from 'react';
import { X, Funnel, Star, Tag, GameController, CurrencyDollar } from '@phosphor-icons/react';
import categoriaService, { Categoria } from '../../services/categoria.service';

export interface FilterState {
  categoriaId: string;
  plataforma: string;
  precoMin: string;
  precoMax: string;
  apenasPromocao: boolean;
  avaliacaoMinima: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const PLATAFORMAS = ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch'];

function FilterSidebar({ filters, onChange, onClear, isOpen, onClose }: FilterSidebarProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    categoriaService.listar()
      .then(res => setCategorias(res.content || []))
      .catch(() => setCategorias([]));
  }, []);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = filters.categoriaId || filters.plataforma || filters.precoMin || 
    filters.precoMax || filters.apenasPromocao || filters.avaliacaoMinima > 0;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categorias */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-200 mb-3">
          <GameController size={18} className="text-primary-400" />
          Categoria
        </h3>
        <select
          value={filters.categoriaId}
          onChange={(e) => updateFilter('categoriaId', e.target.value)}
          className="w-full select-gaming text-sm"
        >
          <option value="">Todas as categorias</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.tipo}</option>
          ))}
        </select>
      </div>

      {/* Plataforma */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-200 mb-3">
          <Tag size={18} className="text-secondary-400" />
          Plataforma
        </h3>
        <div className="space-y-2">
          {PLATAFORMAS.map(plat => (
            <label key={plat} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="plataforma"
                checked={filters.plataforma === plat}
                onChange={() => updateFilter('plataforma', filters.plataforma === plat ? '' : plat)}
                className="radio-gaming"
              />
              <span className="text-sm text-neutral-300 group-hover:text-neutral-100">{plat}</span>
            </label>
          ))}
        </div>
        {filters.plataforma && (
          <button 
            onClick={() => updateFilter('plataforma', '')}
            className="text-xs text-primary-400 hover:text-primary-300 mt-2"
          >
            Limpar plataforma
          </button>
        )}
      </div>

      {/* Faixa de Preço */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-200 mb-3">
          <CurrencyDollar size={18} className="text-accent-400" />
          Faixa de Preço
        </h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            value={filters.precoMin}
            onChange={(e) => updateFilter('precoMin', e.target.value)}
            className="w-full input-gaming text-sm py-2"
            min="0"
          />
          <span className="text-neutral-500">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.precoMax}
            onChange={(e) => updateFilter('precoMax', e.target.value)}
            className="w-full input-gaming text-sm py-2"
            min="0"
          />
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {[50, 100, 200, 300].map(val => (
            <button
              key={val}
              onClick={() => updateFilter('precoMax', String(val))}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                filters.precoMax === String(val)
                  ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                  : 'border-neutral-700 text-neutral-400 hover:border-neutral-600'
              }`}
            >
              Até R${val}
            </button>
          ))}
        </div>
      </div>

      {/* Apenas Promoções */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className={`relative w-11 h-6 rounded-full transition-colors ${
            filters.apenasPromocao ? 'bg-accent-500' : 'bg-neutral-700'
          }`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              filters.apenasPromocao ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </div>
          <span className="text-sm text-neutral-300 group-hover:text-neutral-100">
            Apenas promoções
          </span>
        </label>
      </div>

      {/* Avaliação Mínima */}
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-200 mb-3">
          <Star size={18} weight="fill" className="text-yellow-400" />
          Avaliação Mínima
        </h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="avaliacao"
                checked={filters.avaliacaoMinima === rating}
                onChange={() => updateFilter('avaliacaoMinima', filters.avaliacaoMinima === rating ? 0 : rating)}
                className="radio-gaming"
              />
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} weight={i < rating ? 'fill' : 'regular'} 
                    className={i < rating ? 'text-yellow-400' : 'text-neutral-600'} />
                ))}
                <span className="text-xs text-neutral-400 ml-1">ou mais</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Limpar Filtros */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="w-full py-2.5 text-sm text-error-500 border border-error-500/30 rounded-gaming hover:bg-error-500/10 transition-colors"
        >
          Limpar todos os filtros
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 card-gaming p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2 font-semibold text-neutral-100">
              <Funnel size={20} className="text-primary-400" />
              Filtros
            </h2>
            {hasActiveFilters && (
              <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                Ativos
              </span>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/80 z-40 lg:hidden" onClick={onClose} />
          <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-neutral-900 z-50 lg:hidden overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h2 className="flex items-center gap-2 font-semibold text-neutral-100">
                <Funnel size={20} className="text-primary-400" />
                Filtros
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-gaming">
                <X size={24} className="text-neutral-300" />
              </button>
            </div>
            <div className="p-4">
              <FilterContent />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default FilterSidebar;
