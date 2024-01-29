import { Link } from 'react-router-dom'
import Categoria from '../../../models/categorias/Categoria'

interface CardCategoriaProps {
  categoria: Categoria
}

function CardCategorias({categoria}: CardCategoriaProps) {
return (
  <div className='border border-dark-40/80 shadow-md shadow-dark-40/50 flex flex-col rounded-2xl overflow-hidden justify-between'>
    <header className='py-2 px-6 border border-dark-40/80 bg-dark-30/30 text-dark-60 font-bold text-2xl text-center'>Categoria</header>
    <p className='p-8 text-3xl text-dark-60 bg-dark-30/30 h-full text-center'>{categoria.tipo}</p>
    <div className="flex">
      <Link to={`/editarCategoria/${categoria.id}`} className='w-full border border-dark-40/80 text-dark-60 bg-dark-30/30 hover:bg-dark-50/30 flex items-center justify-center py-2'>
        <button>Editar</button>
      </Link>
      <Link to={`/deletarCategoria/${categoria.id}`} className='border border-dark-40/80 text-dark-60 bg-dark-30/30 hover:bg-dark-50/30 w-full flex items-center justify-center'>
        <button>Deletar</button>
      </Link>
    </div>
  </div>
)
}

export default CardCategorias