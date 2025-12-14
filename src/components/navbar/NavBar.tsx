import { Link, useNavigate } from "react-router-dom";
import { SignOut, SignIn, UserCircle, ShoppingCart, Heart } from "@phosphor-icons/react";
import { useAuth } from "../../contexts/AuthContext";
import { useCarrinho } from "../../contexts/CarrinhoContext";
import { useFavoritos } from "../../contexts/FavoritosContext";

function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, usuario, logout } = useAuth();
  const { totalItens } = useCarrinho();
  const { totalFavoritos } = useFavoritos();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="w-full bg-neutral-950 border-b border-neutral-800 shadow-card-gaming">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center group-hover:shadow-glow-md transition-all">
              <span className="font-accent font-bold text-white">G</span>
            </div>
            <span className="heading-sm text-glow-primary group-hover:text-primary-300 transition-colors">
              Game<span className="text-primary-400">Store</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/home"
              className="cta-gaming text-sm hover:text-primary-400 py-2 px-4 rounded-gaming transition-all hover:bg-neutral-800"
            >
              Home
            </Link>
            <Link
              to="/produtos"
              className="cta-gaming text-sm hover:text-accent-400 py-2 px-4 rounded-gaming transition-all hover:bg-neutral-800"
            >
              Jogos
            </Link>

            {/* Admin Links */}
            {isAdmin && (
              <>
                <Link
                  to="/cadastrarProduto"
                  className="cta-gaming text-sm hover:text-secondary-400 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800"
                >
                  Cad. Jogo
                </Link>
                <Link
                  to="/categorias"
                  className="cta-gaming text-sm hover:text-secondary-400 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800"
                >
                  Categorias
                </Link>
                <Link
                  to="/cadastrarCategoria"
                  className="cta-gaming text-sm hover:text-secondary-400 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800"
                >
                  Nova Cat.
                </Link>
                <Link
                  to="/admin/igdb"
                  className="cta-gaming text-sm hover:text-secondary-400 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800"
                >
                  IGDB
                </Link>
                <Link
                  to="/admin/produtos"
                  className="cta-gaming text-sm hover:text-secondary-400 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800"
                >
                  Estoque
                </Link>
              </>
            )}

            {/* User Section */}
            {isAuthenticated ? (
              <>
                {/* Favoritos */}
                <Link
                  to="/favoritos"
                  className="relative hover:text-accent-400 py-2 px-3 rounded-gaming transition-all flex items-center hover:bg-neutral-800"
                  title="Favoritos"
                >
                  <Heart size={22} weight="bold" />
                  {totalFavoritos > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent-500 text-neutral-900 label-gaming rounded-full h-5 w-5 flex items-center justify-center shadow-glow-neon">
                      {totalFavoritos}
                    </span>
                  )}
                </Link>

                {/* Carrinho */}
                <Link
                  to="/carrinho"
                  className="relative hover:text-primary-400 py-2 px-3 rounded-gaming transition-all flex items-center hover:bg-neutral-800"
                  title="Carrinho"
                >
                  <ShoppingCart size={22} weight="bold" />
                  {totalItens > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white label-gaming rounded-full h-5 w-5 flex items-center justify-center shadow-glow-sm">
                      {totalItens}
                    </span>
                  )}
                </Link>

                {/* Perfil */}
                <Link
                  to="/perfil"
                  className="hover:text-secondary-400 py-2 px-3 rounded-gaming transition-all flex items-center gap-2 hover:bg-neutral-800"
                  title={usuario?.nome}
                >
                  <UserCircle size={22} weight="bold" />
                  <span className="hidden md:inline body-sm">{usuario?.nome.split(' ')[0]}</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center hover:text-error-500 py-2 px-3 rounded-gaming transition-all hover:bg-neutral-800"
                  aria-label="Sair"
                  title="Sair"
                >
                  <SignOut size={22} weight="bold" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-accent flex items-center gap-2 px-4 py-2"
              >
                <SignIn size={20} weight="bold" />
                <span className="cta-gaming text-sm">Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
