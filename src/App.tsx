import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/NavBar';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CarrinhoProvider } from './contexts/CarrinhoContext';
import { FavoritosProvider } from './contexts/FavoritosContext';
import { ToastProvider } from './contexts/ToastContext';

// Pages
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Cadastro from './pages/cadastro/Cadastro';
import DetalheProduto from './pages/detalheProduto/DetalheProduto';
import Favoritos from './pages/favoritos/Favoritos';
import Carrinho from './pages/carrinho/Carrinho';
import Perfil from './pages/perfil/Perfil';
import AdminIGDB from './pages/admin/igdb/AdminIGDB';
import AdminProdutos from './pages/admin/produtos/AdminProdutos';
import Checkout from './pages/checkout/Checkout';
import BrandingDemo from './pages/BrandingDemo';
import TypographyDemo from './pages/TypographyDemo';
import FormDemo from './components/forms/FormDemo';
import ToastDemo from './components/toast/ToastDemo';

// Categorias
import ListaCategorias from './components/categorias/listaCategorias/ListaCategorias';
import FormularioCategoria from './components/categorias/formularioCategoria/FormularioCategoria';
import DeletarCategoria from './components/categorias/deletarCategorias/DeletarCategoria';

// Produtos
import FormularioProduto from './components/produtos/formularioProduto/FormularioProduto';
import ListaProdutos from './components/produtos/listaProdutos/ListaProdutos';
import DeletarProduto from './components/produtos/deletarProdutos/DeletarProduto';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <AuthProvider>
          <CarrinhoProvider>
            <FavoritosProvider>
              <Navbar />
              <div className="min-h-[80vh]">
              <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/produtos" element={<ListaProdutos />} />
                <Route path="/produtos/:id" element={<DetalheProduto />} />
                <Route path="/favoritos" element={<Favoritos />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/perfil" 
                  element={
                    <ProtectedRoute>
                      <Perfil />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/branding" element={<BrandingDemo />} />
                <Route path="/typography" element={<TypographyDemo />} />
                <Route path="/forms" element={<FormDemo />} />
                <Route path="/toasts" element={<ToastDemo />} />

                {/* Rotas Protegidas - Admin */}
                <Route
                  path="/categorias"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ListaCategorias />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cadastrarCategoria"
                  element={
                    <ProtectedRoute requireAdmin>
                      <FormularioCategoria />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editarCategoria/:id"
                  element={
                    <ProtectedRoute requireAdmin>
                      <FormularioCategoria />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/deletarCategoria/:id"
                  element={
                    <ProtectedRoute requireAdmin>
                      <DeletarCategoria />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/igdb"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminIGDB />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/produtos"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminProdutos />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cadastrarProduto"
                  element={
                    <ProtectedRoute requireAdmin>
                      <FormularioProduto />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/editarProduto/:id"
                  element={
                    <ProtectedRoute requireAdmin>
                      <FormularioProduto />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/deletarProduto/:id"
                  element={
                    <ProtectedRoute requireAdmin>
                      <DeletarProduto />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              </div>
              <Footer />
            </FavoritosProvider>
          </CarrinhoProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;