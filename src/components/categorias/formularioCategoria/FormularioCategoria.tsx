import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Categoria from "../../../models/categorias/Categoria";
import categoriaService from "../../../services/categoria.service";
import { useToast } from "../../../contexts/ToastContext";
import {
  Tag,
  FloppyDisk,
  X,
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
  "🌍",
  "❓",
  "🎱",
];

interface FormularioCategoriaProps {
  categoriaId?: number;
  onClose: () => void;
  onSaved: () => void;
}

function FormularioCategoria({ categoriaId, onClose, onSaved }: FormularioCategoriaProps) {
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

  const toast = useToast();
  const isEditing = !!categoriaId;

  async function buscarPorId(id: number) {
    try {
      setCarregando(true);
      const data = await categoriaService.buscarPorId(id);
      setCategoria(data);
    } catch (error) {
      console.error("Erro ao carregar categoria:", error);
      toast.error("Erro", "Não foi possível carregar a categoria");
      onClose();
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    if (categoriaId) buscarPorId(categoriaId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaId]);

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
        await categoriaService.atualizar(categoriaId!, dados);
        toast.success("Sucesso", "Categoria atualizada com sucesso");
      } else {
        await categoriaService.criar(dados);
        toast.success("Sucesso", "Categoria criada com sucesso");
      }
      onSaved();
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      toast.error("Erro", "Não foi possível salvar a categoria");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden shadow-2xl shadow-primary-500/10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-5 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" weight="bold" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {isEditing ? "Editar Categoria" : "Nova Categoria"}
                </h2>
                <p className="text-primary-100 text-sm">
                  {isEditing
                    ? "Atualize os dados da categoria"
                    : "Preencha os dados para criar"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-2 hover:bg-white/20 rounded-xl transition-all text-white disabled:opacity-50"
            >
              <X size={20} weight="bold" />
            </button>
          </div>
        </div>

        {/* Content */}
        {carregando ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
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
                className={`w-full px-4 py-3 bg-neutral-800 border rounded-xl text-white placeholder-neutral-500 focus:outline-none transition-colors ${
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
                className={`w-full px-4 py-3 bg-neutral-800 border rounded-xl text-white placeholder-neutral-500 focus:outline-none resize-none transition-colors ${
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
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-2xl flex-shrink-0">
                  {categoria.icone || "🎮"}
                </div>
                <input
                  type="text"
                  name="icone"
                  id="icone"
                  value={categoria.icone || ""}
                  onChange={atualizarEstado}
                  placeholder="Emoji ou URL"
                  className="flex-1 px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:border-primary-500 focus:outline-none"
                />
              </div>

              {/* Sugestões de emojis */}
              <div className="space-y-2">
                <p className="text-neutral-500 text-xs">Sugestões:</p>
                <div className="flex flex-wrap gap-1.5">
                  {EMOJI_SUGESTOES.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => selecionarEmoji(emoji)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
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
            <div className="flex gap-3 pt-4 border-t border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 
                           border border-neutral-600 hover:border-neutral-500
                           rounded-xl text-neutral-300 font-medium
                           transition-all duration-200 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-500 
                           rounded-xl text-white font-medium
                           flex items-center justify-center gap-2
                           transition-all duration-200 disabled:opacity-50
                           shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <FloppyDisk size={18} weight="bold" />
                    {isEditing ? "Atualizar" : "Criar"}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default FormularioCategoria;
