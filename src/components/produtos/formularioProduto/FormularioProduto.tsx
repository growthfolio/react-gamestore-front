import { useState, useEffect, ChangeEvent } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { Produto } from "../../../models/produtos/Produto";
import produtoService from "../../../services/produto.service";

function FormularioProduto() {
  const [produto, setProduto] = useState<Produto>({
    id: 0,
    nome: "",
    descricao: "",
    preco: 0,
    desconto: 0,
    estoque: 0,
    plataforma: "",
    categoria: { id: 0, tipo: "", icone: "" },
    desenvolvedor: "",
    publisher: "",
    dataLancamento: new Date().toISOString().split('T')[0],
    imagens: [],
    ativo: true,
    mediaAvaliacoes: 0,
    totalAvaliacoes: 0,
    precoComDesconto: 0,
    emEstoque: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
    plataforma: "",
    categoria: "",
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
      const produtoData = await produtoService.buscarPorId(Number(id));
      setProduto(produtoData);
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
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
      categoria: "",
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      const produtoRequest = {
        nome: produto.nome,
        descricao: produto.descricao,
        preco: Number(produto.preco),
        desconto: produto.desconto ? Number(produto.desconto) : undefined,
        estoque: Number(produto.estoque),
        plataforma: produto.plataforma,
        categoriaId: produto.categoria.id,
        desenvolvedor: produto.desenvolvedor,
        publisher: produto.publisher,
        dataLancamento: produto.dataLancamento,
        imagens: produto.imagens,
        ativo: produto.ativo,
      };

      if (id) {
        await produtoService.atualizar(Number(id), produtoRequest);
        alert("Produto atualizado com sucesso!");
      } else {
        await produtoService.criar(produtoRequest);
        alert("Produto cadastrado com sucesso!");
      }
      navigate("/produtos");
    } catch (error: unknown) {
      console.error("Erro ao salvar produto:", error);
      const mensagemErro =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : error instanceof Error
          ? error.message
          : "Erro ao salvar o produto.";
      alert(mensagemErro || "Erro ao salvar o produto.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto my-8 max-w-5xl px-4 bg-neutral-950 min-h-screen py-12">
      <h1 className="heading-gamer heading-xl text-center mb-8 text-glow-primary">
        {id ? "Editar Jogo" : "Cadastrar Jogo"}
      </h1>
      <form
        className="card-gaming p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={gerarNovoProduto}
      >
        {/* Nome */}
        <div>
          <label htmlFor="nome" className="label-gaming block mb-2">
            Nome do Jogo
          </label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={produto.nome}
            onChange={atualizarEstado}
            placeholder="Nome do Jogo"
            className={`input-gaming w-full ${
              errors.nome ? "input-error" : ""
            }`}
          />
          {errors.nome && <p className="body-sm text-error-400 mt-1">{errors.nome}</p>}
        </div>

        {/* Preço */}
        <div>
          <label htmlFor="preco" className="label-gaming block mb-2">
            Preço (R$)
          </label>
          <input
            type="number"
            name="preco"
            id="preco"
            value={produto.preco}
            onChange={atualizarEstado}
            placeholder="0.00"
            step="0.01"
            className={`input-gaming w-full ${
              errors.preco ? "input-error" : ""
            }`}
          />
          {errors.preco && (
            <p className="body-sm text-error-400 mt-1">{errors.preco}</p>
          )}
        </div>

        {/* Plataforma */}
        <div>
          <label htmlFor="plataforma" className="label-gaming block mb-2">
            Plataforma
          </label>
          <select
            name="plataforma"
            id="plataforma"
            value={produto.plataforma}
            onChange={atualizarEstado}
            className={`select-gaming w-full ${
              errors.plataforma ? "input-error" : ""
            }`}
          >
            <option value="">Selecione a plataforma</option>
            <option value="PC">PC</option>
            <option value="PlayStation 5">PlayStation 5</option>
            <option value="Xbox Series X/S">Xbox Series X/S</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
            <option value="Mobile">Mobile</option>
          </select>
          {errors.plataforma && (
            <p className="body-sm text-error-400 mt-1">{errors.plataforma}</p>
          )}
        </div>

        {/* Estoque */}
        <div>
          <label htmlFor="estoque" className="label-gaming block mb-2">
            Estoque
          </label>
          <input
            type="number"
            name="estoque"
            id="estoque"
            value={produto.estoque}
            onChange={atualizarEstado}
            placeholder="Quantidade em estoque"
            min="0"
            className={`input-gaming w-full ${
              errors.estoque ? "input-error" : ""
            }`}
          />
          {errors.estoque && (
            <p className="body-sm text-error-400 mt-1">{errors.estoque}</p>
          )}
        </div>

        {/* URLs Imagens */}
        <div className="col-span-full">
          <label htmlFor="imagens" className="label-gaming block mb-2">
            URLs das Imagens
          </label>
          <input
            type="text"
            name="imagens"
            id="imagens"
            value={produto.imagens.join(", ")}
            onChange={atualizarImagens}
            placeholder="https://exemplo.com/imagem1.jpg, https://exemplo.com/imagem2.jpg"
            className={`input-gaming w-full ${
              errors.imagens ? "input-error" : ""
            }`}
          />
          <p className="body-sm text-neutral-400 mt-1">Separe múltiplas URLs por vírgula</p>
          {errors.imagens && (
            <p className="body-sm text-error-400 mt-1">{errors.imagens}</p>
          )}
        </div>

        {/* Descrição */}
        <div className="col-span-full">
          <label htmlFor="descricao" className="label-gaming block mb-2">
            Descrição do Jogo
          </label>
          <textarea
            name="descricao"
            id="descricao"
            value={produto.descricao}
            onChange={atualizarEstado}
            placeholder="Descreva o jogo, sua história, gameplay e características..."
            rows={4}
            className={`textarea-gaming w-full ${
              errors.descricao ? "input-error" : ""
            }`}
          />
          {errors.descricao && (
            <p className="body-sm text-error-400 mt-1">{errors.descricao}</p>
          )}
        </div>

        {/* Ativo */}
        <div className="col-span-full">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="ativo"
              id="ativo"
              checked={produto.ativo}
              onChange={(e) =>
                setProduto({ ...produto, ativo: e.target.checked })
              }
              className="checkbox-gaming"
            />
            <span className="body-base text-neutral-300">Jogo ativo na loja</span>
          </label>
        </div>

        {/* Botão de envio */}
        <div className="col-span-full flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RotatingLines
                  strokeColor="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="24"
                  visible={true}
                />
                <span className="ml-2 cta-gaming">Salvando...</span>
              </>
            ) : (
              <span className="cta-gaming">{id ? "Atualizar Jogo" : "Cadastrar Jogo"}</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/produtos')}
            className="btn-outline flex-1"
          >
            <span className="cta-gaming">Cancelar</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioProduto;
