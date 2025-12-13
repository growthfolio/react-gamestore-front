import { Link } from "react-router-dom";
import { Produto } from "../../../models/produtos/Produto";

interface CardProdutoProps {
  produto: Produto;
}

function CardProdutos({ produto }: CardProdutoProps) {
  return (
    <div className="card-gaming p-6 mb-4">
      <div className="flex items-center justify-between">
        {/* Nome do Jogo */}
        <div className="flex-1">
          <h3 className="heading-sm text-primary-400 mb-1">{produto.nome}</h3>
          <p className="body-base text-neutral-400 line-clamp-2">
            {produto.descricao || "Sem descrição"}
          </p>
        </div>

        {/* Status */}
        <div className="flex-shrink-0 mx-6">
          <span
            className={`badge-gaming px-3 py-1 rounded-full ${
              produto.ativo 
                ? "bg-success-500 text-white" 
                : "bg-error-500 text-white"
            }`}
          >
            {produto.ativo ? "ATIVO" : "INATIVO"}
          </span>
        </div>

        {/* Ações */}
        <div className="flex gap-3">
          <Link
            to={`/editarProduto/${produto.id}`}
            className="body-sm text-primary-400 hover:text-primary-300 transition-colors font-medium"
          >
            Editar
          </Link>
          <Link
            to={`/deletarProduto/${produto.id}`}
            className="body-sm text-error-500 hover:text-error-400 transition-colors font-medium"
          >
            Deletar
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CardProdutos;
