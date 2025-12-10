import { useState, useEffect, ChangeEvent } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import Categoria from "../../../models/categorias/Categoria";
import { buscar, atualizar, cadastrar } from "../../../services/Services";

function FormularioCategoria() {
  const [categoria, setCategoria] = useState<Categoria>({
    tipo: "",
    nome: "",
    descricao: "",
    ativo: true,
    icone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    tipo: "",
    descricao: "",
    icone: "",
  });
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  async function buscarPorId(id: string) {
    try {
      await buscar(`/categorias/${id}`, setCategoria);
    } catch (error) {
      alert("Erro ao carregar os dados da categoria.");
    }
  }

  useEffect(() => {
    if (id) buscarPorId(id);
  }, [id]);

  function validarFormulario() {
    let valid = true;
    const newErrors = { tipo: "", descricao: "", icone: "" };

    if (!categoria.tipo || categoria.tipo.length < 3) {
      newErrors.tipo = "O tipo deve ter pelo menos 3 caracteres.";
      valid = false;
    }

    if (categoria.descricao && categoria.descricao.length > 255) {
      newErrors.descricao = "A descrição não pode ultrapassar 255 caracteres.";
      valid = false;
    }

    if (categoria.icone && !/^https?:\/\/.+\.(jpg|jpeg|png|svg)$/i.test(categoria.icone)) {
      newErrors.icone = "O ícone deve ser uma URL válida de imagem (jpg, png, svg).";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
  }

  async function gerarNovaCategoria(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validarFormulario()) return;

    setIsLoading(true);
    try {
      if (id) {
        await atualizar(`/categorias`, categoria, setCategoria);
        alert("Categoria atualizada com sucesso!");
      } else {
        await cadastrar(`/categorias`, categoria, setCategoria);
        alert("Categoria cadastrada com sucesso!");
      }
      navigate("/categorias");
    } catch (error) {
      alert("Erro ao salvar a categoria.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto my-8 max-w-lg">
      <h1 className="text-3xl text-center font-bold mb-6">
        {id ? "Editar Categoria" : "Cadastrar Categoria"}
      </h1>
      <form
        className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-6"
        onSubmit={gerarNovaCategoria}
      >
        {/* Tipo da Categoria */}
        <div className="flex flex-col">
          <label htmlFor="tipo" className="text-gray-700 font-medium">
            Tipo da Categoria
          </label>
          <input
            type="text"
            name="tipo"
            id="tipo"
            value={categoria.tipo}
            onChange={atualizarEstado}
            placeholder="Digite o tipo da categoria"
            className={`border rounded p-2 focus:outline-none focus:ring-2 ${
              errors.tipo ? "border-red-500 focus:ring-red-400" : "focus:ring-indigo-400"
            }`}
          />
          {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo}</p>}
        </div>

        {/* Descrição */}
        <div className="flex flex-col">
          <label htmlFor="descricao" className="text-gray-700 font-medium">
            Descrição (Opcional)
          </label>
          <textarea
            name="descricao"
            id="descricao"
            value={categoria.descricao}
            onChange={atualizarEstado}
            placeholder="Digite uma descrição para a categoria (opcional)"
            className={`border rounded p-2 focus:outline-none focus:ring-2 ${
              errors.descricao
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-indigo-400"
            }`}
          />
          {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao}</p>}
        </div>

        {/* Ícone */}
        <div className="flex flex-col">
          <label htmlFor="icone" className="text-gray-700 font-medium">
            URL do Ícone (Opcional)
          </label>
          <input
            type="text"
            name="icone"
            id="icone"
            value={categoria.icone}
            onChange={atualizarEstado}
            placeholder="https://exemplo.com/imagem.png"
            className={`border rounded p-2 focus:outline-none focus:ring-2 ${
              errors.icone ? "border-red-500 focus:ring-red-400" : "focus:ring-indigo-400"
            }`}
          />
          {errors.icone && <p className="text-red-500 text-sm">{errors.icone}</p>}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="ativo"
            id="ativo"
            checked={categoria.ativo}
            onChange={(e) => setCategoria({ ...categoria, ativo: e.target.checked })}
            className="w-5 h-5"
          />
          <label htmlFor="ativo" className="text-gray-700 font-medium">
            Categoria Ativa
          </label>
        </div>

        {/* Botão de envio */}
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            />
          ) : (
            <span>{id ? "Atualizar" : "Cadastrar"}</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default FormularioCategoria;
