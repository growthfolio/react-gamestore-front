import { Link, useNavigate } from "react-router-dom";
import { SignOut, SignIn, UserCircle, ShoppingCart, Heart, Package, Clock, List } from "@phosphor-icons/react";
import { useAuth } from "../../contexts/AuthContext";
import { useCarrinho } from "../../contexts/CarrinhoContext";
import { useFavoritos } from "../../contexts/FavoritosContext";
import { useState, useEffect } from "react";
import ProdutoService from "../../services/produto.service";
import SearchBar from "../search/SearchBar";
import MobileMenu from "./MobileMenu";

function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, usuario, logout } = useAuth();
  const { totalItens } = useCarrinho();
  const { totalFavoritos } = useFavoritos();
  const [pendentesCount, setPendentesCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      ProdutoService.contarPendentes()
        .then(count => setPendentesCount(count))
        .catch(() => setPendentesCount(0));
    }
  }, [isAdmin]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-gaming text-white text-center py-2 px-4">
        <p className="text-sm font-medium">
          🎮 <span className="font-accent">FRETE GRÁTIS</span> em compras acima de R$ 199 | Use o cupom <span className="font-accent text-accent-400">GAMER10</span> e ganhe 10% OFF
        </p>
      </div>

      <div className="w-full bg-neutral-950 border-b border-neutral-800 shadow-card-gaming sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center py-3 px-4 lg:px-6">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center group-hover:shadow-glow-md transition-all">
              <span className="font-accent font-bold text-white">G</span>
            </div>
            <span className="heading-sm text-glow-primary group-hover:text-primary-300 transition-colors hidden sm:block">
              Game<span className="text-primary-400">Store</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-6">
            <SearchBar placeholder="Buscar jogos, categorias..." />
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/home" className="cta-gaming text-sm hover:text-primary-400 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800">
              Home
            </Link>
            <Link to="/produtos" className="cta-gaming text-sm hover:text-accent-400 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800">
              Jogos
            </Link>

            {/* Admin Links */}
            {isAdmin && (
              <>
                <Link to="/categorias" className="cta-gaming text-sm hover:text-secondary-400 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800">
                  Categorias
                </Link>
                <Link to="/admin/igdb" className="cta-gaming text-sm hover:text-secondary-400 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800">
                  IGDB
                </Link>
                <Link to="/admin/pre-cadastros" className="relative cta-gaming text-sm hover:text-secondary-400 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800 flex items-center gap-1">
                  <Clock size={16} weight="bold" />
                  Pendentes
                  {pendentesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-neutral-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {pendentesCount > 99 ? '99+' : pendentesCount}
                    </span>
                  )}
                </Link>
                <Link to="/admin/produtos" className="cta-gaming text-sm hover:text-secondary-400 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800">
                  Estoque
                </Link>
              </>
            )}

            {/* Favoritos - Sempre visível */}
            <Link to="/favoritos" className="relative hover:text-accent-400 py-2 px-3 rounded-gaming transition-all flex items-center hover:bg-neutral-800" title="Favoritos">
              <Heart size={22} weight="bold" />
              {totalFavoritos > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-neutral-900 label-gaming rounded-full h-5 w-5 flex items-center justify-center shadow-glow-neon">
                  {totalFavoritos}
                </span>
              )}
            </Link>

            {/* Carrinho - Sempre visível */}
            <Link to="/carrinho" className="relative hover:text-primary-400 py-2 px-3 rounded-gaming transition-all flex items-center hover:bg-neutral-800" title="Carrinho">
              <ShoppingCart size={22} weight="bold" />
              {totalItens > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white label-gaming rounded-full h-5 w-5 flex items-center justify-center shadow-glow-sm">
                  {totalItens}
                </span>
              )}
            </Link>

            {/* User Section */}
            {isAuthenticated ? (
              <>
                <Link to="/pedidos" className="hover:text-accent-400 py-2 px-3 rounded-gaming transition-all flex items-center hover:bg-neutral-800" title="Meus Pedidos">
                  <Package size={22} weight="bold" />
                </Link>
                <Link to="/perfil" className="hover:text-secondary-400 py-2 px-3 rounded-gaming transition-all flex items-center gap-2 hover:bg-neutral-800" title={usuario?.nickname}>
                  <UserCircle size={22} weight="bold" />
                  <span className="hidden xl:inline body-sm">{usuario?.nickname}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center justify-center hover:text-error-500 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800" aria-label="Sair" title="Sair">
                  <SignOut size={22} weight="bold" />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-accent flex items-center gap-2 px-4 py-2">
                <SignIn size={20} weight="bold" />
                <span className="cta-gaming text-sm">Entrar</span>
              </Link>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Carrinho Mobile */}
            <Link to="/carrinho" className="relative p-2 hover:bg-neutral-800 rounded-gaming transition-colors">
              <ShoppingCart size={24} weight="bold" />
              {totalItens > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItens}
                </span>
              )}
            </Link>

            {/* Hamburger Menu */}
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-neutral-800 rounded-gaming transition-colors" aria-label="Menu">
              <List size={24} weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}

export default NavBar;
