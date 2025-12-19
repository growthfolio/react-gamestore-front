import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, X, GameController, Clock } from '@phosphor-icons/react';
import produtoService, { Produto } from '../../services/produto.service';
import { getProductUrl } from '../../utils/productUrl';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onClose?: () => void;
  isMobile?: boolean;
}

function SearchBar({ className = '', placeholder = 'Buscar jogos...', onClose, isMobile }: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Produto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved).slice(0, 5));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const response = await produtoService.listar({ nome: query, page: 0, size: 5 });
          setResults(response.content || []);
        } catch {
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const saveSearch = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveSearch(query.trim());
      navigate(`/produtos?busca=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery('');
      onClose?.();
    }
  };

  const handleSelectProduct = (produto: Produto) => {
    saveSearch(produto.nome);
    navigate(getProductUrl(produto));
    setIsOpen(false);
    setQuery('');
    onClose?.();
  };

  const handleRecentSearch = (term: string) => {
    setQuery(term);
    navigate(`/produtos?busca=${encodeURIComponent(term)}`);
    setIsOpen(false);
    onClose?.();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <MagnifyingGlass 
          size={20} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" 
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2.5 bg-neutral-800 border border-neutral-700 rounded-gaming text-neutral-100 placeholder-neutral-500 focus:border-primary-500 focus:outline-none transition-all ${isMobile ? 'text-base' : 'text-sm'}`}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {isOpen && (query.length >= 2 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-gaming shadow-card-gaming overflow-hidden z-50">
          {isLoading && (
            <div className="p-4 text-center text-neutral-400">
              <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs text-neutral-500 uppercase tracking-wide border-b border-neutral-800">
                Resultados
              </div>
              {results.map((produto) => (
                <button
                  key={produto.id}
                  onClick={() => handleSelectProduct(produto)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-800 transition-colors text-left"
                >
                  {produto.imagens?.[0] ? (
                    <img src={produto.imagens[0]} alt="" className="w-10 h-10 rounded object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center">
                      <GameController size={20} className="text-neutral-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-100 truncate">{produto.nome}</p>
                    <p className="text-xs text-accent-400 font-semibold">
                      R$ {produto.desconto ? (produto.preco * (1 - produto.desconto / 100)).toFixed(2) : produto.preco.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSubmit}
                className="w-full px-3 py-2.5 text-sm text-primary-400 hover:bg-neutral-800 transition-colors border-t border-neutral-800"
              >
                Ver todos os resultados para "{query}"
              </button>
            </div>
          )}

          {!isLoading && query.length >= 2 && results.length === 0 && (
            <div className="p-4 text-center text-neutral-400 text-sm">
              Nenhum resultado para "{query}"
            </div>
          )}

          {!isLoading && query.length < 2 && recentSearches.length > 0 && (
            <div>
              <div className="px-3 py-2 flex items-center justify-between border-b border-neutral-800">
                <span className="text-xs text-neutral-500 uppercase tracking-wide">Buscas recentes</span>
                <button onClick={clearRecent} className="text-xs text-neutral-500 hover:text-neutral-300">
                  Limpar
                </button>
              </div>
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentSearch(term)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-800 transition-colors text-left"
                >
                  <Clock size={16} className="text-neutral-500" />
                  <span className="text-sm text-neutral-300">{term}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
