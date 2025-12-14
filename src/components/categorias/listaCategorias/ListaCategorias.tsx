import { useEffect, useState } from "react";
import Categoria from "../../../models/categorias/Categoria";
import categoriaService from "../../../services/categoria.service";
import igdbService from "../../../services/igdb.service";
import { useToast } from "../../../contexts/ToastContext";
import DeletarCategoria from "../deletarCategorias/DeletarCategoria";
import FormularioCategoria from "../formularioCategoria/FormularioCategoria";
import { 
  PencilSimple, 
  Trash, 
  Plus, 
  GameController, 
  CloudArrowDown,
  Tag,
  CheckCircle,
  XCircle
} from "@phosphor-icons/react";

function ListaCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [importandoIgdb, setImportandoIgdb] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [categoriaParaDeletar, setCategoriaParaDeletar] = useState<Categoria | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [categoriaParaEditar, setCategoriaParaEditar] = useState<number | undefined>(undefined);
  const itensPorPagina = 12;
  const toast = useToast();

  async function buscarCategorias() {
    try {
      setIsLoading(true);
      const response = await categoriaService.listar({ size: 100 });
      setCategorias(response.content);
    } catch (error: unknown) {
      console.error("Erro ao listar categorias:", error);
      toast.error("Erro", "Não foi possível carregar as categorias");
    } finally {
      setIsLoading(false);
    }
  }

  async function importarGenerosIgdb() {
    try {
      setImportandoIgdb(true);
      toast.info("Importando...", "Buscando gêneros da IGDB");
      
      const resultado = await igdbService.importAllGenres();
      
      toast.success(
        "Importação concluída!",
        `${resultado.criados} categorias criadas, ${resultado.jaExistentes} já existiam`
      );
      
      // Recarrega a lista
      await buscarCategorias();
    } catch (error: unknown) {
      console.error("Erro ao importar gêneros:", error);
      toast.error("Erro na importação", "Não foi possível importar os gêneros da IGDB");
    } finally {
      setImportandoIgdb(false);
    }
  }

  useEffect(() => {
    buscarCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cálculo para paginação
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const categoriasPaginadas = categorias.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(categorias.length / itensPorPagina);

  const irParaPaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const irParaProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="heading-gamer text-2xl md:text-3xl flex items-center gap-3">
              <Tag className="text-secondary-500" size={32} />
              Gerenciar Categorias
            </h1>
            <p className="text-neutral-400 mt-1">
              {categorias.length} categorias cadastradas
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Botão Importar do IGDB */}
            <button
              onClick={importarGenerosIgdb}
              disabled={importandoIgdb}
              className="btn-secondary flex items-center gap-2 disabled:opacity-50"
            >
              {importandoIgdb ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Importando...
                </>
              ) : (
                <>
                  <CloudArrowDown size={20} />
                  Importar do IGDB
                </>
              )}
            </button>
            
            {/* Botão Nova Categoria */}
            <button 
              onClick={() => {
                setCategoriaParaEditar(undefined);
                setShowFormModal(true);
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus size={20} />
              Nova Categoria
            </button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
            <p className="text-neutral-400">Carregando categorias...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && categorias.length === 0 && (
          <div className="card-gaming p-12 text-center">
            <Tag size={64} className="mx-auto text-neutral-600 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">
              Nenhuma categoria cadastrada
            </h2>
            <p className="text-neutral-400 mb-6">
              Importe os gêneros da IGDB ou crie categorias manualmente
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={importarGenerosIgdb}
                disabled={importandoIgdb}
                className="btn-secondary"
              >
                <CloudArrowDown size={18} />
                Importar do IGDB
              </button>
              <button 
                onClick={() => {
                  setCategoriaParaEditar(undefined);
                  setShowFormModal(true);
                }}
                className="btn-primary"
              >
                <Plus size={18} />
                Criar Categoria
              </button>
            </div>
          </div>
        )}

        {/* Grid de Categorias */}
        {!isLoading && categorias.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoriasPaginadas.map((categoria) => (
                <div
                  key={categoria.id}
                  className="card-gaming p-4 hover:border-primary-500/50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Ícone */}
                      <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center text-2xl">
                        {categoria.icone || <GameController size={24} className="text-neutral-400" />}
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors">
                          {categoria.tipo}
                        </h3>
                        <span className="text-xs text-neutral-500">
                          ID: {categoria.id}
                        </span>
                      </div>
                    </div>
                    
                    {/* Status */}
                    {categoria.ativo ? (
                      <CheckCircle size={20} className="text-green-500" weight="fill" />
                    ) : (
                      <XCircle size={20} className="text-red-500" weight="fill" />
                    )}
                  </div>
                  
                  {/* Descrição */}
                  <p className="text-sm text-neutral-400 mb-4 line-clamp-2 min-h-[40px]">
                    {categoria.descricao || "Sem descrição"}
                  </p>
                  
                  {/* Ações */}
                  <div className="flex gap-2 pt-3 border-t border-neutral-800">
                    <button
                      onClick={() => {
                        setCategoriaParaEditar(categoria.id);
                        setShowFormModal(true);
                      }}
                      className="btn-ghost flex-1 justify-center text-sm py-2"
                    >
                      <PencilSimple size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => setCategoriaParaDeletar(categoria)}
                      className="btn-ghost flex-1 justify-center text-sm py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash size={16} />
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
                <button
                  onClick={irParaPaginaAnterior}
                  disabled={paginaAtual === 1}
                  className={`px-6 py-2 rounded-gaming font-semibold transition-colors ${
                    paginaAtual === 1
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : "btn-secondary"
                  }`}
                >
                  ← Anterior
                </button>
                <span className="text-neutral-400">
                  Página {paginaAtual} de {totalPaginas}
                </span>
                <button
                  onClick={irParaProximaPagina}
                  disabled={paginaAtual === totalPaginas}
                  className={`px-6 py-2 rounded-gaming font-semibold transition-colors ${
                    paginaAtual === totalPaginas
                      ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      : "btn-secondary"
                  }`}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal de Exclusão */}
        {categoriaParaDeletar && (
          <DeletarCategoria
            categoria={categoriaParaDeletar}
            onClose={() => setCategoriaParaDeletar(null)}
            onDeleted={() => {
              setCategoriaParaDeletar(null);
              buscarCategorias();
            }}
          />
        )}

        {/* Modal de Formulário (Criar/Editar) */}
        {showFormModal && (
          <FormularioCategoria
            categoriaId={categoriaParaEditar}
            onClose={() => {
              setShowFormModal(false);
              setCategoriaParaEditar(undefined);
            }}
            onSaved={() => {
              setShowFormModal(false);
              setCategoriaParaEditar(undefined);
              buscarCategorias();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default ListaCategorias;
