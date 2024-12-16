import { Link } from "react-router-dom";
import Produto from "../../../models/produtos/Produto";

interface CardProdutoProps {
  produto: Produto;
}

function CardProdutos({ produto }: CardProdutoProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 py-4 px-6 hover:bg-gray-100 transition-colors">
      {/* Coluna: Tipo */}
      <div className="flex-1 text-gray-700 font-medium">
        <span>{produto.nome}</span>
      </div>

      {/* Coluna: Descrição */}
      <div className="flex-1 text-gray-500">
        <span>{produto.descricao || "Sem descrição"}</span>
      </div>

      {/* Coluna: Status */}
      <div className="flex-1 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            produto.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {produto.ativo ? "Ativo" : "Inativo"}
        </span>
      </div>

      {/* Coluna: Ações */}
      <div className="flex gap-2">
        <Link
          to={`/editarProduto/${produto.id}`}
          className="text-blue-500 hover:text-blue-700 transition-colors text-sm"
        >
          Editar
        </Link>
        <Link
          to={`/deletarProduto/${produto.id}`}
          className="text-red-500 hover:text-red-700 transition-colors text-sm"
        >
          Deletar
        </Link>
      </div>
    </div>
  );
}

export default CardProdutos;
