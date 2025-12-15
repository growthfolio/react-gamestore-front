import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import produtoService from "../../../services/produto.service";
import categoriaService from "../../../services/categoria.service";
import { PencilSimple, Trash, MagnifyingGlass, GameController, Funnel, X, Plus, Eye } from "@phosphor-icons/react";
import { Produto } from "../../../models/produtos/Produto";
import Categoria from "../../../models/categorias/Categoria";
import { useAuth } from "../../../contexts/AuthContext";
import FormularioProduto from "../formularioProduto/FormularioProduto";
import DeletarProduto from "../deletarProdutos/DeletarProduto";
import ProductQuickView from "../ProductQuickView";
import LoginSuggestionModal from "../../modals/LoginSuggestionModal";

function ListaProdutos() {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [busca, setBusca] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [ordenacao, setOrdenacao] = useState("nome,asc");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState<number | undefined>(undefined);
  const [produtoParaDeletar, setProdutoParaDeletar] = useState<Produto | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [produtoQuickView, setProdutoQuickView] = useState<Produto | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginAction, setLoginAction] = useState<'favorite' | 'cart' | 'checkout'>('cart');
  const itensPorPagina = 12;

  async function buscarProdutos(pagina: number = 0, termoBusca: string = "", catId: string = "", sort: string = "nome,asc") {
    try {
      setIsLoading(true);
      
      let response;
      if (termoBusca.trim()) {
        response = await produtoService.listar({
          nome: termoBusca,
          page: pagina,
          size: itensPorPagina,
          sort,
        });
      } else if (catId) {
        response = await produtoService.listar({
          categoriaId: Number(catId),
          page: pagina,
          size: itensPorPagina,
          sort,
        });
      } else {
        response = await produtoService.listar({
          page: pagina,
          size: itensPorPagina,
          sort,
        });
      }

      setProdutos(response.content);
      setTotalPaginas(response.totalPages);
      setTotalElementos(response.totalElements);
      setPaginaAtual(response.number);
    } catch (error: unknown) {
      console.error("Erro ao listar produtos:", error);
      alert("Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  }

  async function carregarCategorias() {
    try {
      const response = await categoriaService.listar();
      setCategorias(response.content);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  }

  useEffect(() => {
    carregarCategorias();
    const catParam = searchParams.get('categoria');
    if (catParam) {
      setCategoriaId(catParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    buscarProdutos(0, busca, categoriaId, ordenacao);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaId]);

  const handleBusca = (e: React.FormEvent) => {
    e.preventDefault();
    buscarProdutos(0, busca, categoriaId, ordenacao);
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCatId = e.target.value;
    setCategoriaId(newCatId);
    if (newCatId) {
      setSearchParams({ categoria: newCatId });
    } else {
      setSearchParams({});
    }
  };

  const handleOrdenacao = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novaOrdenacao = e.target.value;
    setOrdenacao(novaOrdenacao);
    buscarProdutos(paginaAtual, busca, categoriaId, novaOrdenacao);
  };

  const handleQuickView = (produto: Produto) => {
    setProdutoQuickView(produto);
    setShowQuickView(true);
  };

  const handleLoginRequired = (action: 'favorite' | 'cart') => {
    setLoginAction(action);
    setShowLoginModal(true);
    setShowQuickView(false);
  };

  const irParaPaginaAnterior = () => {
    if (paginaAtual > 0) {
      buscarProdutos(paginaAtual - 1, busca, categoriaId, ordenacao);
    }
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas - 1) {
      buscarProdutos(paginaAtual + 1, busca, categoriaId, ordenacao);
    }
  };

  const limparFiltros = () => {
    setBusca("");
    setCategoriaId("");
    setPrecoMin("");
    setPrecoMax("");
    setOrdenacao("nome,asc");
    setSearchParams({});
    buscarProdutos(0, "", "", "nome,asc");
  };

  const hasActiveFilters = busca || categoriaId || precoMin || precoMax;

  // Filtrar produtos por preço (client-side já que a API pode não suportar)
  const produtosFiltrados = produtos.filter(produto => {
    const minOk = !precoMin || produto.preco >= parseFloat(precoMin);
    const maxOk = !precoMax || produto.preco <= parseFloat(precoMax);
    return minOk && maxOk;
  });

  return (
    <div className="min-h-screen bg-neutral-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="heading-gamer text-2xl md:text-3xl flex items-center gap-3">
            <GameController className="text-primary-500" size={32} />
            Catálogo de Jogos
          </h1>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => {
                  setProdutoParaEditar(undefined);
                  setShowFormModal(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                Novo Produto
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-ghost flex items-center gap-2 ${showFilters ? 'text-primary-400' : ''}`}
            >
              <Funnel size={20} />
              Filtros
              {hasActiveFilters && (
                <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="card-gaming p-6 mb-6 space-y-4">
          {/* Busca Principal */}
          <form onSubmit={handleBusca} className="flex gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass 
                size={20} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" 
              />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar jogos por nome..."
                className="w-full pl-12 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-gaming text-white placeholder-neutral-400 focus:border-primary-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-6"
            >
              Buscar
            </button>
          </form>

          {/* Filtros Avançados */}
          {showFilters && (
            <div className="pt-4 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Categoria
                </label>
                <select
                  value={categoriaId}
                  onChange={handleCategoriaChange}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-gaming text-white focus:border-primary-500 focus:outline-none"
                >
                  <option value="">Todas as categorias</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.tipo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preço Mínimo */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Preço Mínimo
                </label>
                <input
                  type="number"
                  value={precoMin}
                  onChange={(e) => setPrecoMin(e.target.value)}
                  placeholder="R$ 0"
                  min="0"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-gaming text-white placeholder-neutral-400 focus:border-primary-500 focus:outline-none"
                />
              </div>

              {/* Preço Máximo */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Preço Máximo
                </label>
                <input
                  type="number"
                  value={precoMax}
                  onChange={(e) => setPrecoMax(e.target.value)}
                  placeholder="R$ 999"
                  min="0"
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-gaming text-white placeholder-neutral-400 focus:border-primary-500 focus:outline-none"
                />
              </div>

              {/* Ordenação */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Ordenar por
                </label>
                <select
                  value={ordenacao}
                  onChange={handleOrdenacao}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-gaming text-white focus:border-primary-500 focus:outline-none"
                >
                  <option value="nome,asc">Nome (A-Z)</option>
                  <option value="nome,desc">Nome (Z-A)</option>
                  <option value="preco,asc">Menor Preço</option>
                  <option value="preco,desc">Maior Preço</option>
                </select>
              </div>
            </div>
          )}

          {/* Limpar Filtros */}
          {hasActiveFilters && (
            <div className="flex items-center gap-4 pt-4 border-t border-neutral-800">
              <button
                onClick={limparFiltros}
                className="btn-ghost text-sm flex items-center gap-2 text-red-400 hover:text-red-300"
              >
                <X size={16} />
                Limpar todos os filtros
              </button>
              <div className="flex gap-2 flex-wrap">
                {busca && (
                  <span className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-neutral-300 flex items-center gap-2">
                    Busca: "{busca}"
                    <button onClick={() => { setBusca(""); buscarProdutos(0, "", categoriaId, ordenacao); }}>
                      <X size={14} />
                    </button>
                  </span>
                )}
                {categoriaId && (
                  <span className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-neutral-300 flex items-center gap-2">
                    Categoria: {categorias.find(c => c.id.toString() === categoriaId)?.tipo}
                    <button onClick={() => { setCategoriaId(""); setSearchParams({}); }}>
                      <X size={14} />
                    </button>
                  </span>
                )}
                {precoMin && (
                  <span className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-neutral-300 flex items-center gap-2">
                    Min: R$ {precoMin}
                    <button onClick={() => setPrecoMin("")}>
                      <X size={14} />
                    </button>
                  </span>
                )}
                {precoMax && (
                  <span className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-neutral-300 flex items-center gap-2">
                    Max: R$ {precoMax}
                    <button onClick={() => setPrecoMax("")}>
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info de Resultados */}
        <div className="mb-4 text-neutral-400 text-sm">
          Mostrando {produtosFiltrados.length} de {totalElementos} jogos
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
            <p className="text-neutral-400">Carregando jogos...</p>
          </div>
        )}

        {/* Grid de Produtos */}
        {!isLoading && produtosFiltrados.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {produtosFiltrados.map((produto: Produto) => (
                <div
                  key={produto.id}
                  className="card-gaming overflow-hidden group hover:scale-[1.02] transition-transform"
                >
                  {/* Imagem */}
                  <div className="relative aspect-[3/4] bg-neutral-800 overflow-hidden">
                    {produto.imagens && produto.imagens.length > 0 ? (
                      <img
                        src={produto.imagens[0]}
                        alt={produto.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <GameController size={64} className="text-neutral-600" />
                      </div>
                    )}
                    
                    {/* Badge de Status */}
                    {!produto.ativo && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-red-500/90 text-white text-xs rounded-full">
                        Indisponível
                      </span>
                    )}
                    
                    {/* Desconto */}
                    {produto.desconto > 0 && (
                      <span className="absolute top-3 right-3 px-2 py-1 bg-accent-500 text-neutral-900 text-xs font-bold rounded-full">
                        -{produto.desconto}%
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-1 line-clamp-1 group-hover:text-primary-400 transition-colors">
                      {produto.nome}
                    </h3>
                    <p className="text-xs text-neutral-400 mb-3">
                      {produto.plataforma} • {produto.desenvolvedor}
                    </p>

                    {/* Preço */}
                    <div className="flex items-end gap-2 mb-4">
                      {produto.desconto > 0 ? (
                        <>
                          <span className="text-xs text-neutral-500 line-through">
                            R$ {produto.preco.toFixed(2)}
                          </span>
                          <span className="text-lg font-bold text-accent-400">
                            R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-accent-400">
                          R$ {produto.preco.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleQuickView(produto)}
                        className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex-1 justify-center text-sm py-2 px-3 rounded transition-colors border border-neutral-600 flex items-center gap-1"
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                      
                      <Link
                        to={`/produtos/${produto.id}`}
                        className="btn-primary flex-1 justify-center text-sm py-2"
                      >
                        Ver Detalhes
                      </Link>
                      
                      {isAdmin && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setProdutoParaEditar(produto.id);
                              setShowFormModal(true);
                            }}
                            className="btn-ghost p-2"
                            title="Editar"
                          >
                            <PencilSimple size={18} />
                          </button>
                          <button
                            onClick={() => setProdutoParaDeletar(produto)}
                            className="btn-ghost p-2 text-red-400 hover:text-red-300"
                            title="Excluir"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
              <button
                onClick={irParaPaginaAnterior}
                disabled={paginaAtual === 0}
                className={`px-6 py-2 rounded-gaming font-semibold transition-colors ${
                  paginaAtual === 0
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "btn-secondary"
                }`}
              >
                ← Anterior
              </button>
              <span className="text-neutral-400">
                Página {paginaAtual + 1} de {totalPaginas || 1}
              </span>
              <button
                onClick={irParaProximaPagina}
                disabled={paginaAtual === totalPaginas - 1 || totalPaginas === 0}
                className={`px-6 py-2 rounded-gaming font-semibold transition-colors ${
                  paginaAtual === totalPaginas - 1 || totalPaginas === 0
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "btn-secondary"
                }`}
              >
                Próxima →
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && produtosFiltrados.length === 0 && (
          <div className="card-gaming p-12 text-center">
            <GameController size={64} className="mx-auto text-neutral-600 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Nenhum jogo encontrado
            </h2>
            <p className="text-neutral-400 mb-6">
              Tente ajustar os filtros ou buscar por outro termo
            </p>
            {hasActiveFilters && (
              <button
                onClick={limparFiltros}
                className="btn-primary"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        )}

        {/* Modal de Formulário (Criar/Editar) */}
        {showFormModal && (
          <FormularioProduto
            produtoId={produtoParaEditar}
            onClose={() => {
              setShowFormModal(false);
              setProdutoParaEditar(undefined);
            }}
            onSaved={() => {
              setShowFormModal(false);
              setProdutoParaEditar(undefined);
              buscarProdutos(paginaAtual, busca, categoriaId, ordenacao);
            }}
          />
        )}

        {/* Modal de Exclusão */}
        {produtoParaDeletar && (
          <DeletarProduto
            produto={produtoParaDeletar}
            onClose={() => setProdutoParaDeletar(null)}
            onDeleted={() => {
              setProdutoParaDeletar(null);
              buscarProdutos(paginaAtual, busca, categoriaId, ordenacao);
            }}
          />
        )}

        {/* Preview Rápido */}
        <ProductQuickView
          produto={produtoQuickView}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
          onLoginRequired={handleLoginRequired}
        />

        {/* Modal de Sugestão de Login */}
        <LoginSuggestionModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          action={loginAction}
          productName={produtoQuickView?.nome}
        />
      </div>
    </div>
  );
}

export default ListaProdutos;
