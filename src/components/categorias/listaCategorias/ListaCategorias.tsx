import { useEffect, useState } from "react";
import { Dna } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Categoria from "../../../models/categorias/Categoria";
import { buscar } from "../../../services/Services";
import { PencilSimple, Trash } from "@phosphor-icons/react";

function ListaCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  async function buscarCategorias() {
    try {
      await buscar("/categorias", setCategorias);
    } catch (error: any) {
      alert("Erro ao listar as categorias");
    }
  }

  useEffect(() => {
    buscarCategorias();
  }, []);

  // Cálculo para paginação
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const categoriasPaginadas = categorias.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(categorias.length / itensPorPagina);

  // Funções para mudar página
  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  return (
    <>
      {categorias.length === 0 && (
        <div className="flex justify-center py-8">
          <Dna
            visible={true}
            height="100"
            width="100"
            ariaLabel="Carregando categorias"
          />
        </div>
      )}

      {categorias.length > 0 && (
        <div className="container mx-auto my-12">
          <h1 className="text-3xl font-bold text-center mb-8">Categorias</h1>

          {/* Tabela de Categorias */}
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Tipo</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Descrição</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categoriasPaginadas.map((categoria) => (
                <tr key={categoria.id} className="hover:bg-gray-100 transition-colors">
                  <td className="border border-gray-300 px-4 py-2">{categoria.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{categoria.tipo}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {categoria.descricao || "Sem descrição"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        categoria.ativo
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {categoria.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      {/* Botão Editar */}
                      <Link
                        to={`/editarCategoria/${categoria.id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                      <PencilSimple size={22} weight="light" />
                      </Link>

                      {/* Botão Deletar */}
                      <Link
                        to={`/deletarCategoria/${categoria.id}`}
                        className="text-red-500 hover:text-red-700"
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

export default ListaCategorias;
