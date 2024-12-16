import { useState, useEffect, ChangeEvent } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import Produto from "../../../models/produtos/Produto";
import { buscar, atualizar, cadastrar } from "../../../services/Services";

function FormularioProduto() {
  const [produto, setProduto] = useState<Produto>({
    id: 0,
    nome: "",
    descricao: "",
    preco: 0,
    desconto: undefined,
    estoque: 0,
    plataforma: "",
    categoriaId: 0,
    desenvolvedor: "",
    publisher: "",
    dataLancamento: new Date(),
    imagens: [],
    ativo: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
    plataforma: "",
    categoriaId: "",
    desenvolvedor: "",
    publisher: "",
    imagens: "",
  });
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) buscarPorId(id);
  }, [id]);

  async function buscarPorId(id: string) {
    try {
      await buscar(`/produtos/${id}`, setProduto);
    } catch (error) {
      alert("Erro ao carregar os dados do produto.");
    }
  }

  function validarFormulario() {
    let valid = true;
    const newErrors = {
      nome: "",
      descricao: "",
      preco: "",
      estoque: "",
      plataforma: "",
      categoriaId: "",
      desenvolvedor: "",
      publisher: "",
      imagens: "",
    };

    if (!produto.nome || produto.nome.length < 3) {
      newErrors.nome = "O nome deve ter pelo menos 3 caracteres.";
      valid = false;
    }

    if (produto.descricao && produto.descricao.length > 255) {
      newErrors.descricao = "A descrição não pode ultrapassar 255 caracteres.";
      valid = false;
    }

    if (produto.preco <= 0) {
      newErrors.preco = "O preço deve ser maior que zero.";
      valid = false;
    }

    if (produto.estoque < 0) {
      newErrors.estoque = "O estoque não pode ser negativo.";
      valid = false;
    }

    if (!produto.plataforma) {
      newErrors.plataforma = "A plataforma é obrigatória.";
      valid = false;
    }

    if (
      produto.imagens.some(
        (img) => !/^https?:\/\/.+\.(jpg|jpeg|png|svg)$/i.test(img)
      )
    ) {
      newErrors.imagens = "Todas as imagens devem ser URLs válidas de imagem.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  function atualizarEstado(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setProduto({ ...produto, [name]: value });
  }

  function atualizarImagens(e: ChangeEvent<HTMLInputElement>) {
    const urls = e.target.value.split(",").map((url) => url.trim());
    setProduto({ ...produto, imagens: urls });
  }

  async function gerarNovoProduto(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validarFormulario()) return;

    setIsLoading(true);
    try {
      if (id) {
        await atualizar(`/produtos`, produto, setProduto);
        alert("Produto atualizado com sucesso!");
      } else {
        await cadastrar(`/produtos`, produto, setProduto);
        alert("Produto cadastrado com sucesso!");
      }
      navigate("/produtos");
    } catch (error) {
      alert("Erro ao salvar o produto.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto my-8 max-w-5xl px-4">
      <h1 className="text-3xl text-center font-bold mb-6">
        {id ? "Editar Produto" : "Cadastrar Produto"}
      </h1>
      <form
        className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={gerarNovoProduto}
      >
        {/* Nome */}
        <div className="flex flex-col">
          <label htmlFor="nome" className="text-gray-700 font-medium">
            Nome
          </label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={produto.nome}
            onChange={atualizarEstado}
            placeholder="Nome do Produto"
            className={`border rounded p-2 focus:ring-2 ${
              errors.nome
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-indigo-400"
            }`}
          />
          {errors.nome && <p className="text-red-500 text-sm">{errors.nome}</p>}
        </div>

        {/* Preço */}
        <div className="flex flex-col">
          <label htmlFor="preco" className="text-gray-700 font-medium">
            Preço
          </label>
          <input
            type="number"
            name="preco"
            id="preco"
            value={produto.preco}
            onChange={atualizarEstado}
            placeholder="Preço"
            className={`border rounded p-2 focus:ring-2 ${
              errors.preco
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-indigo-400"
            }`}
          />
          {errors.preco && (
            <p className="text-red-500 text-sm">{errors.preco}</p>
          )}
        </div>

        {/* Plataforma */}
        <div className="flex flex-col">
          <label htmlFor="plataforma" className="text-gray-700 font-medium">
            Plataforma
          </label>
          <input
            type="text"
            name="plataforma"
            id="plataforma"
            value={produto.plataforma}
            onChange={atualizarEstado}
            placeholder="Plataforma"
            className={`border rounded p-2 focus:ring-2 ${
              errors.plataforma
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-indigo-400"
            }`}
          />
          {errors.plataforma && (
            <p className="text-red-500 text-sm">{errors.plataforma}</p>
          )}
        </div>

        {/* Estoque */}
        <div className="flex flex-col">
          <label htmlFor="estoque" className="text-gray-700 font-medium">
            Estoque
          </label>
          <input
            type="number"
            name="estoque"
            id="estoque"
            value={produto.estoque}
            onChange={atualizarEstado}
            placeholder="Estoque"
            className={`border rounded p-2 focus:ring-2 ${
              errors.estoque
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-indigo-400"
            }`}
          />
          {errors.estoque && (
            <p className="text-red-500 text-sm">{errors.estoque}</p>
          )}
        </div>

        {/* URLs Imagens */}
        <div className="col-span-full flex flex-col">
          <label htmlFor="imagens" className="text-gray-700 font-medium">
            Imagens
          </label>
          <input
            type="text"
            name="imagens"
            id="imagens"
            value={produto.imagens.join(", ")}
            onChange={atualizarImagens}
            placeholder="URLs das Imagens separadas por vírgula"
            className={`border rounded p-2 focus:ring-2 ${
              errors.imagens
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-indigo-400"
            }`}
          />
          {errors.imagens && (
            <p className="text-red-500 text-sm">{errors.imagens}</p>
          )}
        </div>

        {/* Descrição */}
        <div className="col-span-full flex flex-col">
          <label htmlFor="descricao" className="text-gray-700 font-medium">
            Descrição
          </label>
          <textarea
            name="descricao"
            id="descricao"
            value={produto.descricao}
            onChange={atualizarEstado}
            placeholder="Descrição do produto"
            rows={3}
            className={`border rounded p-2 focus:ring-2 ${
              errors.descricao
                ? "border-red-500 focus:ring-red-400"
                : "focus:ring-indigo-400"
            }`}
          />
          {errors.descricao && (
            <p className="text-red-500 text-sm">{errors.descricao}</p>
          )}
        </div>

        {/* Ativo */}
        <div className="col-span-full flex items-center">
          <input
            type="checkbox"
            name="ativo"
            id="ativo"
            checked={produto.ativo}
            onChange={(e) =>
              setProduto({ ...produto, ativo: e.target.checked })
            }
            className="mr-2"
          />
          <label htmlFor="ativo" className="text-gray-700 font-medium">
            Produto ativo
          </label>
        </div>

        {/* Botão de envio */}
        <div className="col-span-full flex justify-center">
          <button
            type="submit"
            className="w-full md:w-1/2 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
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
        </div>
      </form>
    </div>
  );
}

export default FormularioProduto;
