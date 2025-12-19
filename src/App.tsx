import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/NavBar';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import BackToTop from './components/ui/BackToTop';
import CookieConsent from './components/ui/CookieConsent';

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
import AdminPreCadastros from './pages/admin/preCadastros/AdminPreCadastros';
import Checkout from './pages/checkout/Checkout';
import CheckoutSuccess from './pages/checkout/CheckoutSuccess';
import CheckoutCancel from './pages/checkout/CheckoutCancel';
import Pedidos from './pages/pedidos/Pedidos';

// Páginas Institucionais
import Sobre from './pages/institucional/Sobre';
import FAQ from './pages/institucional/FAQ';
import Contato from './pages/institucional/Contato';

// Categorias
import ListaCategorias from './components/categorias/listaCategorias/ListaCategorias';

// Produtos
import ListaProdutos from './components/produtos/listaProdutos/ListaProdutos';

// Demo Components
import ScrollbarDemo from './components/ScrollbarDemo';
import RedirectOldProductUrl from './components/RedirectOldProductUrl';

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
                <Route path="/produtos/:slug" element={<DetalheProduto />} />
                <Route path="/favoritos" element={<Favoritos />} />
                <Route path="/carrinho" element={<Carrinho />} />
                
                {/* Redirect para URLs antigas com ID */}
                <Route path="/produto/:id" element={<RedirectOldProductUrl />} />
                
                {/* Demo Route - Remover em produção */}
                <Route path="/scrollbar-demo" element={<ScrollbarDemo />} />
                
                {/* Páginas Institucionais */}
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/politica-privacidade" element={<Sobre />} />
                <Route path="/termos-uso" element={<Sobre />} />
                <Route path="/trocas-devolucoes" element={<FAQ />} />
                <Route path="/como-comprar" element={<FAQ />} />
                
                {/* Rotas Protegidas - Usuário */}
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/checkout/success" 
                  element={
                    <ProtectedRoute>
                      <CheckoutSuccess />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/checkout/cancel" 
                  element={
                    <ProtectedRoute>
                      <CheckoutCancel />
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
                <Route 
                  path="/pedidos" 
                  element={
                    <ProtectedRoute>
                      <Pedidos />
                    </ProtectedRoute>
                  } 
                />

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
                  path="/admin/igdb"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminIGDB />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/pre-cadastros"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminPreCadastros />
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
              </Routes>
              </div>
              <Footer />
              <BackToTop />
              <CookieConsent />
            </FavoritosProvider>
          </CarrinhoProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
