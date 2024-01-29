import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/NavBar'

import Home from './pages/home/Home'
import ListaCategorias from './components/categorias/listaCategorias/ListaCategorias'
import FormularioCategoria from './components/categorias/formularioCategoria/FormularioCategoria'
import DeletarCategoria from './components/categorias/deletarCategorias/DeletarCategoria'

function App() {
  return (
    <>
       <BrowserRouter>
      <Navbar />
      <div className="min-h-[80vh] bg-dark-20">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Categorias" element={<ListaCategorias />} />
        <Route path="/cadastrarCategoria" element={<FormularioCategoria />} />
  
        <Route path="/editarcategoria/:id" element={<FormularioCategoria />} />   {/* :id = é uma variavel que vem pela url do Front, que represenda o id do item que vai ser editado */}
        <Route path="/deletarCategoria/:id" element={<DeletarCategoria />} />
        </Routes>
      </div>

      <Footer />
      </BrowserRouter>
    </>

  );
}
export default App;