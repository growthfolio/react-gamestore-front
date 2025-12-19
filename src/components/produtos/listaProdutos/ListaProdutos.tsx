import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import produtoService from "../../../services/produto.service";
import { MagnifyingGlass, GameController, Funnel, X, Plus, Heart, ShoppingCart, Star, SquaresFour, List } from "@phosphor-icons/react";
import { Produto } from "../../../models/produtos/Produto";
import { useAuth } from "../../../contexts/AuthContext";
import { useCarrinho } from "../../../contexts/CarrinhoContext";
import { useFavoritos } from "../../../contexts/FavoritosContext";
import { getProductUrl } from "../../../utils/productUrl";
import FormularioProduto from "../formularioProduto/FormularioProduto";
import DeletarProduto from "../deletarProdutos/DeletarProduto";
import FilterSidebar, { FilterState } from "../FilterSidebar";
import LoginSuggestionModal from "../../modals/LoginSuggestionModal";

function ListaProdutos() {
  const { isAdmin, isAuthenticated } = useAuth();
  const { adicionarItem } = useCarrinho();
  const { toggleFavorito, isFavorito } = useFavoritos();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState(searchParams.get('busca') || "");
  const [ordenacao, setOrdenacao] = useState("nome,asc");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState<number | undefined>(undefined);
  const [produtoParaDeletar, setProdutoParaDeletar] = useState<Produto | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginAction, setLoginAction] = useState<'favorite' | 'cart'>('cart');
  
  const [filters, setFilters] = useState<FilterState>({
    categoriaId: searchParams.get('categoria') || '',
    plataforma: searchParams.get('plataforma') || '',
    precoMin: searchParams.get('precoMin') || '',
    precoMax: searchParams.get('precoMax') || '',
    apenasPromocao: searchParams.get('ofertas') === 'true',
    avaliacaoMinima: 0,
  });

  const itensPorPagina = 12;

  async function buscarProdutos(pagina: number = 0) {
    try {
      setIsLoading(true);
      const params: any = { page: pagina, size: itensPorPagina, sort: ordenacao };
      
      if (busca.trim()) params.nome = busca;
      if (filters.categoriaId) params.categoriaId = Number(filters.categoriaId);
      
      const response = await produtoService.listar(params);
      let produtosFiltrados = response.content || [];
      
      // Filtros client-side
      if (filters.plataforma) {
        produtosFiltrados = produtosFiltrados.filter(p => p.plataforma === filters.plataforma);
      }
      if (filters.precoMin) {
        produtosFiltrados = produtosFiltrados.filter(p => p.preco >= parseFloat(filters.precoMin));
      }
      if (filters.precoMax) {
        produtosFiltrados = produtosFiltrados.filter(p => p.preco <= parseFloat(filters.precoMax));
      }
      if (filters.apenasPromocao) {
        produtosFiltrados = produtosFiltrados.filter(p => p.desconto && p.desconto > 0);
      }
      
      setProdutos(produtosFiltrados);
      setTotalPaginas(response.totalPages);
      setTotalElementos(response.totalElements);
      setPaginaAtual(response.number);
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    buscarProdutos(0);
  }, [filters, ordenacao]);

  useEffect(() => {
    const buscaParam = searchParams.get('busca');
    if (buscaParam) {
      setBusca(buscaParam);
      buscarProdutos(0);
    }
  }, [searchParams]);

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (busca) prev.set('busca', busca);
      else prev.delete('busca');
      return prev;
    });
    buscarProdutos(0);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    if (newFilters.categoriaId) params.set('categoria', newFilters.categoriaId);
    if (newFilters.plataforma) params.set('plataforma', newFilters.plataforma);
    if (newFilters.apenasPromocao) params.set('ofertas', 'true');
    if (busca) params.set('busca', busca);
    setSearchParams(params);
  };

  const limparFiltros = () => {
    setBusca("");
    setFilters({ categoriaId: '', plataforma: '', precoMin: '', precoMax: '', apenasPromocao: false, avaliacaoMinima: 0 });
    setOrdenacao("nome,asc");
    setSearchParams({});
  };

  const handleAddToCart = async (produto: Produto, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isAuthenticated) {
      setLoginAction('cart');
      setShowLoginModal(true);
      return;
    }
    try {
      await adicionarItem({ produtoId: produto.id, quantidade: 1 });
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    }
  };

  const handleToggleFavorito = async (produtoId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await toggleFavorito(produtoId);
    } catch (error) {
      console.error('Erro ao favoritar:', error);
    }
  };

  const hasActiveFilters = busca || filters.categoriaId || filters.plataforma || 
    filters.precoMin || filters.precoMax || filters.apenasPromocao;

  const ProductCard = ({ produto }: { produto: Produto }) => (
    <Link
      to={getProductUrl(produto)}
      className={`card-gaming overflow-hidden group hover:shadow-glow-md transition-all ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* Imagem */}
      <div className={`relative bg-neutral-800 overflow-hidden ${
        viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-[3/4]'
      }`}>
        {produto.imagens?.[0] ? (
          <img src={produto.imagens[0]} alt={produto.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <GameController size={48} className="text-neutral-600" />
          </div>
        )}
        
        {produto.desconto && produto.desconto > 0 && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-accent-500 text-neutral-900 text-xs font-bold rounded-full">
            -{produto.desconto}%
          </span>
        )}
        
        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => handleToggleFavorito(produto.id, e)}
            className={`p-2 rounded-full transition-all ${
              isFavorito(produto.id) ? 'bg-accent-500 text-neutral-900' : 'bg-neutral-800 text-neutral-300 hover:bg-accent-500 hover:text-neutral-900'
            }`}
          >
            <Heart size={20} weight={isFavorito(produto.id) ? 'fill' : 'regular'} />
          </button>
          <button
            onClick={(e) => handleAddToCart(produto, e)}
            className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-400 transition-all"
          >
            <ShoppingCart size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <h3 className="font-bold text-white mb-1 line-clamp-1 group-hover:text-primary-400 transition-colors">
          {produto.nome}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} weight="fill" className="text-yellow-400" />
          ))}
          <span className="text-xs text-neutral-500 ml-1">(4.5)</span>
        </div>
        
        <p className="text-xs text-neutral-400 mb-2">
          {produto.plataforma} {produto.desenvolvedor && `• ${produto.desenvolvedor}`}
        </p>

        <div className="flex items-end gap-2">
          {produto.desconto && produto.desconto > 0 ? (
            <>
              <span className="text-xs text-neutral-500 line-through">R$ {produto.preco.toFixed(2)}</span>
              <span className="text-lg font-bold text-accent-400">
                R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-accent-400">R$ {produto.preco.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );

  const SkeletonCard = () => (
    <div className="card-gaming overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-neutral-800" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-neutral-700 rounded w-3/4" />
        <div className="h-3 bg-neutral-700 rounded w-1/2" />
        <div className="h-5 bg-neutral-700 rounded w-1/3" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="heading-gamer text-2xl md:text-3xl flex items-center gap-3">
              <GameController className="text-primary-500" size={32} />
              Catálogo de Jogos
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              {totalElementos} jogos disponíveis
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button onClick={() => { setProdutoParaEditar(undefined); setShowFormModal(true); }} className="btn-primary flex items-center gap-2">
                <Plus size={20} />
                <span className="hidden sm:inline">Novo Produto</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Controls Bar */}
        <div className="card-gaming p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleBusca} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar jogos..."
                  className="w-full pl-12 pr-4 py-2.5 input-gaming"
                />
              </div>
              <button type="submit" className="btn-primary px-6">Buscar</button>
            </form>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Ordenação */}
              <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} className="select-gaming text-sm py-2.5">
                <option value="nome,asc">Nome (A-Z)</option>
                <option value="nome,desc">Nome (Z-A)</option>
                <option value="preco,asc">Menor Preço</option>
                <option value="preco,desc">Maior Preço</option>
              </select>

              {/* View Mode */}
              <div className="hidden md:flex border border-neutral-700 rounded-gaming overflow-hidden">
                <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>
                  <SquaresFour size={20} />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}>
                  <List size={20} />
                </button>
              </div>

              {/* Filter Toggle Mobile */}
              <button onClick={() => setShowFilters(true)} className="lg:hidden btn-ghost flex items-center gap-2">
                <Funnel size={20} />
                {hasActiveFilters && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
              </button>
            </div>
          </div>

          {/* Active Filters Chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-800 flex-wrap">
              <span className="text-xs text-neutral-500">Filtros ativos:</span>
              {busca && (
                <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs text-neutral-300 flex items-center gap-2">
                  "{busca}"
                  <button onClick={() => { setBusca(""); buscarProdutos(0); }}><X size={12} /></button>
                </span>
              )}
              {filters.categoriaId && (
                <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs text-neutral-300 flex items-center gap-2">
                  Categoria
                  <button onClick={() => handleFilterChange({ ...filters, categoriaId: '' })}><X size={12} /></button>
                </span>
              )}
              {filters.plataforma && (
                <span className="px-3 py-1 bg-neutral-800 rounded-full text-xs text-neutral-300 flex items-center gap-2">
                  {filters.plataforma}
                  <button onClick={() => handleFilterChange({ ...filters, plataforma: '' })}><X size={12} /></button>
                </span>
              )}
              {filters.apenasPromocao && (
                <span className="px-3 py-1 bg-accent-500/20 text-accent-400 rounded-full text-xs flex items-center gap-2">
                  Promoções
                  <button onClick={() => handleFilterChange({ ...filters, apenasPromocao: false })}><X size={12} /></button>
                </span>
              )}
              <button onClick={limparFiltros} className="text-xs text-error-400 hover:text-error-300 ml-2">
                Limpar tudo
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onClear={limparFiltros}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : produtos.length > 0 ? (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                  {produtos.map(produto => <ProductCard key={produto.id} produto={produto} />)}
                </div>

                {/* Pagination */}
                {totalPaginas > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      onClick={() => buscarProdutos(paginaAtual - 1)}
                      disabled={paginaAtual === 0}
                      className="btn-outline px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span className="text-neutral-400">
                      Página {paginaAtual + 1} de {totalPaginas}
                    </span>
                    <button
                      onClick={() => buscarProdutos(paginaAtual + 1)}
                      disabled={paginaAtual >= totalPaginas - 1}
                      className="btn-outline px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <GameController size={64} className="mx-auto text-neutral-700 mb-4" />
                <h3 className="text-xl font-semibold text-neutral-300 mb-2">Nenhum jogo encontrado</h3>
                <p className="text-neutral-500 mb-4">Tente ajustar os filtros ou buscar por outro termo</p>
                <button onClick={limparFiltros} className="btn-primary">Limpar Filtros</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showFormModal && (
        <FormularioProduto
          produtoId={produtoParaEditar}
          onClose={() => setShowFormModal(false)}
          onSaved={() => { setShowFormModal(false); buscarProdutos(paginaAtual); }}
        />
      )}

      {produtoParaDeletar && (
        <DeletarProduto
          produto={produtoParaDeletar}
          onClose={() => setProdutoParaDeletar(null)}
          onDeleted={() => { setProdutoParaDeletar(null); buscarProdutos(paginaAtual); }}
        />
      )}

      <LoginSuggestionModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        action={loginAction}
      />
    </div>
  );
}

export default ListaProdutos;
