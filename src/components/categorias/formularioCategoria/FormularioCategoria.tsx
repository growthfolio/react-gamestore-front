import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Categoria from "../../../models/categorias/Categoria";
import categoriaService from "../../../services/categoria.service";
import { useToast } from "../../../contexts/ToastContext";
import {
  Tag,
  FloppyDisk,
  ArrowLeft,
  TextT,
  TextAlignLeft,
  Image,
} from "@phosphor-icons/react";

// Lista de emojis sugeridos para categorias
const EMOJI_SUGESTOES = [
  "🎮",
  "⚔️",
  "🔫",
  "🗺️",
  "♟️",
  "🧩",
  "🏎️",
  "⚽",
  "🥊",
  "🛩️",
  "🍄",
  "👾",
  "👻",
  "🎵",
  "🎨",
  "🃏",
  "🏰",
  "🎯",
  "🎲",
  "🗡️",
  "👆",
  "��",
  "❓",
  "🎱",
];

function FormularioCategoria() {
  const [categoria, setCategoria] = useState<Partial<Categoria>>({
    tipo: "",
    descricao: "",
    ativo: true,
    icone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [errors, setErrors] = useState({
    tipo: "",
    descricao: "",
    icone: "",
  });

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const isEditing = !!id;

  async function buscarPorId(categoriaId: string) {
    try {
      setCarregando(true);
      const data = await categoriaService.buscarPorId(Number(categoriaId));
      setCategoria(data);
    } catch (error) {
      console.error("Erro ao carregar categoria:", error);
      toast.error("Erro", "Não foi possível carregar a categoria");
      navigate("/categorias");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (id) buscarPorId(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function validarFormulario(): boolean {
    let valid = true;
    const newErrors = { tipo: "", descricao: "", icone: "" };

    if (!categoria.tipo || categoria.tipo.trim().length < 3) {
      newErrors.tipo = "O tipo deve ter pelo menos 3 caracteres";
      valid = false;
    }

    if (categoria.descricao && categoria.descricao.length > 255) {
      newErrors.descricao = "A descrição não pode ultrapassar 255 caracteres";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  function atualizarEstado(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
    // Limpa erro do campo quando usuário digita
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  }

  function selecionarEmoji(emoji: string) {
    setCategoria({ ...categoria, icone: emoji });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validarFormulario()) return;

    setIsLoading(true);
    try {
      const dados = {
        tipo: categoria.tipo!,
        descricao: categoria.descricao || "",
        icone: categoria.icone || "",
      };

      if (isEditing) {
        await categoriaService.atualizar(Number(id), dados);
        toast.success("Sucesso", "Categoria atualizada com sucesso");
      } else {
        await categoriaService.criar(dados);
        toast.success("Sucesso", "Categoria criada com sucesso");
      }
      navigate("/categorias");
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      toast.error("Erro", "Não foi possível salvar a categoria");
    } finally {
      setIsLoading(false);
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/categorias" className="btn-ghost p-2">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="heading-gamer text-2xl md:text-3xl flex items-center gap-3">
              <Tag className="text-secondary-500" size={28} />
              {isEditing ? "Editar Categoria" : "Nova Categoria"}
            </h1>
            <p className="text-neutral-400 mt-1">
              {isEditing
                ? "Atualize os dados da categoria"
                : "Preencha os dados para criar uma nova categoria"}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="card-gaming p-6 space-y-6">
          {/* Tipo */}
          <div>
            <label
              htmlFor="tipo"
              className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2"
            >
              <TextT size={16} />
              Nome da Categoria *
            </label>
            <input
              type="text"
              name="tipo"
              id="tipo"
              value={categoria.tipo || ""}
              onChange={atualizarEstado}
              placeholder="Ex: Ação, RPG, Aventura..."
              className={`w-full px-4 py-3 bg-neutral-800 border rounded-gaming text-white placeholder-neutral-400 focus:outline-none transition-colors ${
                errors.tipo
                  ? "border-red-500 focus:border-red-500"
                  : "border-neutral-700 focus:border-primary-500"
              }`}
            />
            {errors.tipo && (
              <p className="text-red-400 text-sm mt-1">{errors.tipo}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label
              htmlFor="descricao"
              className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2"
            >
              <TextAlignLeft size={16} />
              Descrição
            </label>
            <textarea
              name="descricao"
              id="descricao"
              value={categoria.descricao || ""}
              onChange={atualizarEstado}
              placeholder="Descrição opcional da categoria..."
              rows={3}
              className={`w-full px-4 py-3 bg-neutral-800 border rounded-gaming text-white placeholder-neutral-400 focus:outline-none resize-none transition-colors ${
                errors.descricao
                  ? "border-red-500 focus:border-red-500"
                  : "border-neutral-700 focus:border-primary-500"
              }`}
            />
            {errors.descricao && (
              <p className="text-red-400 text-sm mt-1">{errors.descricao}</p>
            )}
            <p className="text-neutral-500 text-xs mt-1">
              {categoria.descricao?.length || 0}/255 caracteres
            </p>
          </div>

          {/* Ícone */}
          <div>
            <label
              htmlFor="icone"
              className="flex items-center gap-2 text-sm font-medium text-neutral-300 mb-2"
            >
              <Image size={16} />
              Ícone
            </label>

            {/* Preview do ícone */}
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-3xl">
                {categoria.icone || "🎮"}
              </div>
              <input
                type="text"
                name="icone"
                id="icone"
                value={categoria.icone || ""}
                onChange={atualizarEstado}
                placeholder="Emoji ou URL de imagem"
                className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-gaming text-white placeholder-neutral-400 focus:border-primary-500 focus:outline-none"
              />
            </div>

            {/* Sugestões de emojis */}
            <div className="space-y-2">
              <p className="text-neutral-500 text-xs">Sugestões:</p>
              <div className="flex flex-wrap gap-2">
                {EMOJI_SUGESTOES.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => selecionarEmoji(emoji)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                      categoria.icone === emoji
                        ? "bg-primary-500/20 border-2 border-primary-500"
                        : "bg-neutral-800 border border-neutral-700 hover:border-neutral-600"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4 border-t border-neutral-800">
            <Link to="/categorias" className="btn-ghost flex-1 justify-center">
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 justify-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <FloppyDisk size={18} />
                  {isEditing ? "Atualizar" : "Criar Categoria"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioCategoria;
