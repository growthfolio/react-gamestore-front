import { useEffect, useState } from "react";
import { Dna } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { buscar } from "../../../services/Services";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import Produto from "../../../models/produtos/Produto";

function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  async function buscarProdutos() {
    try {
      await buscar("/produtos", setProdutos);
    } catch (error: any) {
      alert("Erro ao listar as produtos");
    }
  }

  useEffect(() => {
    buscarProdutos();
  }, []);

  // Cálculo para paginação
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const produtosPaginadas = produtos.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(produtos.length / itensPorPagina);

  // Funções para mudar página
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  return (
    <>
      {produtos.length === 0 && (
        <div className="flex justify-center py-8">
          <Dna
            visible={true}
            height="100"
            width="100"
            ariaLabel="Carregando produtos"
          />
        </div>
      )}

      {produtos.length > 0 && (
        <div className="container mx-auto my-12">
          <h1 className="text-3xl font-bold text-center mb-8">Produtos</h1>

          {/* Tabela de Produtos */}
          <table className="w-full border-collapse border border-gray-300">
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
              {produtosPaginadas.map((produto, index) => (
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
                      {/* Botão Editar */}
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


          {/* Paginação */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={irParaPaginaAnterior}
              disabled={paginaAtual === 1}
              className={`px-4 py-2 rounded ${
                paginaAtual === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              Anterior
            </button>
            <span className="text-gray-700">
              Página {paginaAtual} de {totalPaginas}
            </span>
            <button
              onClick={irParaProximaPagina}
              disabled={paginaAtual === totalPaginas}
              className={`px-4 py-2 rounded ${
                paginaAtual === totalPaginas
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ListaProdutos;
