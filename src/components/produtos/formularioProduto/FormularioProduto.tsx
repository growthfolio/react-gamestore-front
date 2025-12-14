import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Produto } from "../../../models/produtos/Produto";
import Categoria from "../../../models/categorias/Categoria";
import produtoService from "../../../services/produto.service";
import categoriaService from "../../../services/categoria.service";
import { useToast } from "../../../contexts/ToastContext";
import { getErrorMessage, ErrorMessages } from "../../../utils/errorHandler";
import {
  GameController,
  FloppyDisk,
  X,
  TextT,
  CurrencyDollar,
  Package,
  Desktop,
  Tag,
  CalendarBlank,
  Buildings,
  Image,
  TextAlignLeft,
  Percent,
  ToggleRight,
} from "@phosphor-icons/react";

interface FormularioProdutoProps {
  produtoId?: number;
  onClose: () => void;
  onSaved: () => void;
}

function FormularioProduto({ produtoId, onClose, onSaved }: FormularioProdutoProps) {
  const [produto, setProduto] = useState<Partial<Produto>>({
    nome: "",
    descricao: "",
    preco: 0,
    desconto: 0,
    estoque: 0,
    plataforma: "",
    categoria: { id: 0, tipo: "", icone: "" },
    desenvolvedor: "",
    publisher: "",
    dataLancamento: new Date().toISOString().split("T")[0],
    imagens: [],
    ativo: true,
  });
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  const isEditing = !!produtoId;

  useEffect(() => {
    carregarCategorias();
    if (produtoId) {
      buscarPorId(produtoId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produtoId]);

  async function carregarCategorias() {
    try {
      const response = await categoriaService.listar({ size: 100 });
      setCategorias(response.content);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  }

  async function buscarPorId(id: number) {
    try {
      setIsLoadingData(true);
      const produtoData = await produtoService.buscarPorId(id);
      setProduto(produtoData);
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
      toast.error("Erro", getErrorMessage(error, ErrorMessages.loadFailed('produto')));
    } finally {
      setIsLoadingData(false);
    }
  }

  function validarFormulario(): boolean {
    const newErrors: Record<string, string> = {};

    if (!produto.nome || produto.nome.length < 3) {
      newErrors.nome = "O nome deve ter pelo menos 3 caracteres";
    }

    if (!produto.preco || produto.preco <= 0) {
      newErrors.preco = "O preço deve ser maior que zero";
    }

    if (!produto.plataforma) {
      newErrors.plataforma = "Selecione uma plataforma";
    }

    if (produto.estoque !== undefined && produto.estoque < 0) {
      newErrors.estoque = "O estoque não pode ser negativo";
    }

    if (!produto.categoria?.id) {
      newErrors.categoria = "Selecione uma categoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function atualizarEstado(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  }

  function atualizarCategoria(e: ChangeEvent<HTMLSelectElement>) {
    const categoriaId = Number(e.target.value);
    const categoriaSelecionada = categorias.find((c) => c.id === categoriaId);
    if (categoriaSelecionada) {
      setProduto({ ...produto, categoria: categoriaSelecionada });
    }
    if (errors.categoria) {
      setErrors({ ...errors, categoria: "" });
    }
  }

  function atualizarImagens(e: ChangeEvent<HTMLInputElement>) {
    const urls = e.target.value
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url);
    setProduto({ ...produto, imagens: urls });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validarFormulario()) return;

    setIsLoading(true);
    try {
      const produtoRequest = {
        nome: produto.nome!,
        descricao: produto.descricao || "",
        preco: Number(produto.preco),
        desconto: produto.desconto ? Number(produto.desconto) : 0,
        estoque: Number(produto.estoque),
        plataforma: produto.plataforma!,
        categoriaId: produto.categoria!.id,
        desenvolvedor: produto.desenvolvedor || "",
        publisher: produto.publisher || "",
        dataLancamento: produto.dataLancamento || new Date().toISOString().split("T")[0],
        imagens: produto.imagens || [],
        ativo: produto.ativo ?? true,
      };

      if (isEditing) {
        await produtoService.atualizar(produtoId!, produtoRequest);
        toast.success("Sucesso!", "Produto atualizado com sucesso");
      } else {
        await produtoService.criar(produtoRequest);
        toast.success("Sucesso!", "Produto cadastrado com sucesso");
      }
      onSaved();
    } catch (error: unknown) {
      console.error("Erro ao salvar produto:", error);
      const action = isEditing ? 'atualizar' : 'cadastrar';
      toast.error("Erro", getErrorMessage(error, ErrorMessages.createFailed(`produto (${action})`)));
    } finally {
      setIsLoading(false);
    }
  }

  const PLATAFORMAS = [
    "PC",
    "PlayStation 5",
    "PlayStation 4",
    "Xbox Series X/S",
    "Xbox One",
    "Nintendo Switch",
    "Mobile",
  ];

  if (isLoadingData) {
    return (
      <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <GameController size={24} className="text-white" weight="fill" />
            <h2 className="text-xl font-bold text-white">
              {isEditing ? "Editar Produto" : "Novo Produto"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                <TextT size={16} />
                Nome do Produto *
              </label>
              <input
                type="text"
                name="nome"
                value={produto.nome || ""}
                onChange={atualizarEstado}
                placeholder="Ex: The Legend of Zelda"
                className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors ${
                  errors.nome ? "border-red-500" : "border-neutral-700"
                }`}
              />
              {errors.nome && (
                <p className="text-red-400 text-sm mt-1">{errors.nome}</p>
              )}
            </div>

            {/* Preço */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                <CurrencyDollar size={16} />
                Preço (R$) *
              </label>
              <input
                type="number"
                name="preco"
                value={produto.preco || ""}
                onChange={atualizarEstado}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors ${
                  errors.preco ? "border-red-500" : "border-neutral-700"
                }`}
              />
              {errors.preco && (
                <p className="text-red-400 text-sm mt-1">{errors.preco}</p>
              )}
            </div>

            {/* Desconto */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                <Percent size={16} />
                Desconto (%)
              </label>
              <input
                type="number"
                name="desconto"
                value={produto.desconto || ""}
                onChange={atualizarEstado}
                placeholder="0"
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Estoque */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                <Package size={16} />
                Estoque
              </label>
              <input
                type="number"
                name="estoque"
                value={produto.estoque || ""}
                onChange={atualizarEstado}
                placeholder="0"
                min="0"
                className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors ${
                  errors.estoque ? "border-red-500" : "border-neutral-700"
                }`}
              />
              {errors.estoque && (
                <p className="text-red-400 text-sm mt-1">{errors.estoque}</p>
              )}
            </div>

            {/* Plataforma */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                <Desktop size={16} />
                Plataforma *
              </label>
              <select
                name="plataforma"
                value={produto.plataforma || ""}
                onChange={atualizarEstado}
                className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors ${
                  errors.plataforma ? "border-red-500" : "border-neutral-700"
                }`}
              >
                <option value="">Selecione a plataforma</option>
                {PLATAFORMAS.map((plat) => (
                  <option key={plat} value={plat}>
                    {plat}
                  </option>
                ))}
              </select>
              {errors.plataforma && (
                <p className="text-red-400 text-sm mt-1">{errors.plataforma}</p>
              )}
            </div>

            {/* Categoria */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                <Tag size={16} />
                Categoria *
              </label>
              <select
                value={produto.categoria?.id || ""}
                onChange={atualizarCategoria}
                className={`w-full px-4 py-3 bg-neutral-800 border rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors ${
                  errors.categoria ? "border-red-500" : "border-neutral-700"
                }`}
              >
                <option value="">Selecione a categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icone} {cat.tipo}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <p className="text-red-400 text-sm mt-1">{errors.categoria}</p>
              )}
            </div>

            {/* Desenvolvedor */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                <Buildings size={16} />
                Desenvolvedor
              </label>
              <input
                type="text"
                name="desenvolvedor"
                value={produto.desenvolvedor || ""}
                onChange={atualizarEstado}
                placeholder="Ex: Nintendo"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Publisher */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                <Buildings size={16} />
                Publisher
              </label>
              <input
                type="text"
                name="publisher"
                value={produto.publisher || ""}
                onChange={atualizarEstado}
                placeholder="Ex: Nintendo"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Data de Lançamento */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                <CalendarBlank size={16} />
                Data de Lançamento
              </label>
              <input
                type="date"
                name="dataLancamento"
                value={produto.dataLancamento || ""}
                onChange={atualizarEstado}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            {/* Ativo */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                <ToggleRight size={16} />
                Produto Ativo
              </label>
              <button
                type="button"
                onClick={() => setProduto({ ...produto, ativo: !produto.ativo })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  produto.ativo ? "bg-primary-500" : "bg-neutral-700"
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    produto.ativo ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={produto.ativo ? "text-green-400" : "text-neutral-500"}>
                {produto.ativo ? "Sim" : "Não"}
              </span>
            </div>

            {/* URLs das Imagens - Full Width */}
            <div className="col-span-full">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                <Image size={16} />
                URLs das Imagens
              </label>
              <input
                type="text"
                value={produto.imagens?.join(", ") || ""}
                onChange={atualizarImagens}
                placeholder="https://exemplo.com/img1.jpg, https://exemplo.com/img2.jpg"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <p className="text-neutral-500 text-xs mt-1">
                Separe múltiplas URLs por vírgula
              </p>
            </div>

            {/* Descrição - Full Width */}
            <div className="col-span-full">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2">
                <TextAlignLeft size={16} />
                Descrição
              </label>
              <textarea
                name="descricao"
                value={produto.descricao || ""}
                onChange={atualizarEstado}
                placeholder="Descreva o jogo, sua história, gameplay e características..."
                rows={4}
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
              />
            </div>
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
            disabled={isLoading}
            className="btn-primary flex-1 justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <FloppyDisk size={18} />
                {isEditing ? "Atualizar" : "Cadastrar"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormularioProduto;
