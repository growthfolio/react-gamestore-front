import { Link } from "react-router-dom";
import Categoria from "../../../models/categorias/Categoria";

interface CardCategoriaProps {
  categoria: Categoria;
}

function CardCategorias({ categoria }: CardCategoriaProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 py-4 px-6 hover:bg-gray-100 transition-colors">
      {/* Coluna: Tipo */}
      <div className="flex-1 text-gray-700 font-medium">
        <span>{categoria.tipo}</span>
      </div>

      {/* Coluna: Descrição */}
      <div className="flex-1 text-gray-500">
        <span>{categoria.descricao || "Sem descrição"}</span>
      </div>

      {/* Coluna: Status */}
      <div className="flex-1 text-center">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            categoria.ativo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {categoria.ativo ? "Ativo" : "Inativo"}
        </span>
      </div>

      {/* Coluna: Ações */}
      <div className="flex gap-2">
        <Link
          to={`/editarCategoria/${categoria.id}`}
          className="text-blue-500 hover:text-blue-700 transition-colors text-sm"
        >
          Editar
        </Link>
        <Link
          to={`/deletarCategoria/${categoria.id}`}
          className="text-red-500 hover:text-red-700 transition-colors text-sm"
        >
          Deletar
        </Link>
      </div>
    </div>
  );
}

export default CardCategorias;
