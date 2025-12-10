import { useEffect, useState } from "react";
import { Dna } from "react-loader-spinner";
import { Link, useSearchParams } from "react-router-dom";
import produtoService from "../../../services/produto.service";
import categoriaService from "../../../services/categoria.service";
import { PencilSimple, Trash, MagnifyingGlass } from "@phosphor-icons/react";
import Produto from "../../../models/produtos/Produto";
import Categoria from "../../../models/categorias/Categoria";
import { useAuth } from "../../../contexts/AuthContext";

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
  const itensPorPagina = 12;

  async function buscarProdutos(pagina: number = 0, termoBusca: string = "", catId: string = "", sort: string = "nome,asc") {
    try {
      setIsLoading(true);
      
      let response;
      if (termoBusca.trim()) {
        response = await produtoService.buscarPorNome(termoBusca, {
          page: pagina,
          size: itensPorPagina,
          sort,
        });
      } else if (catId) {
        response = await produtoService.buscarPorCategoria(Number(catId), {
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
    } catch (error: any) {
      console.error("Erro ao listar produtos:", error);
      alert("Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  }

  async function carregarCategorias() {
    try {
      const cats = await categoriaService.listar();
      setCategorias(cats);
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
  }, []);

  useEffect(() => {
    buscarProdutos(0, busca, categoriaId, ordenacao);
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

  return (
    <div className="container mx-auto my-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Catálogo de Produtos</h1>

      {/* Barra de Busca e Filtros */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center">
        {/* Busca */}
        <form onSubmit={handleBusca} className="flex gap-2 flex-1 max-w-md w-full">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produtos..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <MagnifyingGlass size={20} weight="bold" />
            Buscar
          </button>
        </form>

        {/* Filtro por Categoria */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <label className="text-gray-700 font-medium">Categoria:</label>
          <select
            value={categoriaId}
            onChange={handleCategoriaChange}
            className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <label className="text-gray-700 font-medium">Ordenar:</label>
          <select
            value={ordenacao}
            onChange={handleOrdenacao}
            className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="nome,asc">Nome (A-Z)</option>
            <option value="nome,desc">Nome (Z-A)</option>
            <option value="preco,asc">Menor Preço</option>
            <option value="preco,desc">Maior Preço</option>
          </select>
        </div>
      </div>

      {/* Info de Resultados */}
      <div className="mb-4 text-gray-600">
        Mostrando {produtos.length} de {totalElementos} produtos
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Dna visible={true} height="100" width="100" ariaLabel="Carregando produtos" />
        </div>
      )}

      {/* Tabela de Produtos */}
      {!isLoading && produtos.length > 0 && (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full border-collapse border border-gray-300 bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Preço</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Estoque</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Plataforma</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Desenvolvedor</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto: Produto, index: number) => (
                <tr
                  key={produto.id}
                  className={`transition-colors ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="border border-gray-300 px-4 py-2">{produto.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{produto.nome}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {produto.preco.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{produto.estoque}</td>
                  <td className="border border-gray-300 px-4 py-2">{produto.plataforma}</td>
                  <td className="border border-gray-300 px-4 py-2">{produto.desenvolvedor}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        produto.ativo
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {produto.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      {/* Botão Editar - Apenas Admin */}
                      {isAdmin && (
                        <>
                          <Link
                            to={`/editarProduto/${produto.id}`}
                            className="text-blue-500 hover:text-blue-700"
                            title="Editar"
                          >
                            <PencilSimple size={22} weight="light" />
                          </Link>

                          {/* Botão Deletar */}
                          <Link
                            to={`/deletarProduto/${produto.id}`}
                            className="text-red-500 hover:text-red-700"
                            title="Excluir"
                          >
                            <Trash size={22} weight="light" />
                          </Link>
                        </>
                      )}
                      
                      {/* Link Ver Detalhes - Todos */}
                      <Link
                        to={`/produtos/${produto.id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* Paginação */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
            <button
              onClick={irParaPaginaAnterior}
              disabled={paginaAtual === 0}
              className={`px-6 py-2 rounded-lg font-semibold ${
                paginaAtual === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              ← Anterior
            </button>
            <span className="text-gray-700 font-medium">
              Página {paginaAtual + 1} de {totalPaginas}
            </span>
            <button
              onClick={irParaProximaPagina}
              disabled={paginaAtual === totalPaginas - 1}
              className={`px-6 py-2 rounded-lg font-semibold ${
                paginaAtual === totalPaginas - 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Próxima →
            </button>
          </div>
        </>
      )}

      {/* Empty State */}
      {!isLoading && produtos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
          {busca && (
            <button
              onClick={() => {
                setBusca("");
                buscarProdutos(0, "", ordenacao);
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 underline"
            >
              Limpar busca
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ListaProdutos;
