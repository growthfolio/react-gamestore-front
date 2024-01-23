import { Link } from "react-router-dom"



function NavBar() {
 

    return (
      <>
       <div className='w-full bg-indigo-800 text-white flex justify-center py-4'>
            <div className="container flex justify-between text-lg">
              <Link to='/home' className='text-2xl font-bold uppercase'>Energy Games</Link>
  
              <div className='flex gap-4'>
               <Link to='/home' className='hover:underline'>Home</Link>
                <div className='hover:underline'>Produtos</div>
                <Link to='/categorias' className='hover:underline'>Categorias</Link>
                <Link to='/cadastrarCategoria' className='hover:underline'>Cad. Categoria</Link>
                <div className='hover:underline'>Sair</div>
              </div>
            </div>
          </div>
      </>
    )
  }
  
  export default NavBar