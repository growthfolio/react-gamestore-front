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
      <div className="w-full bg-gray-800 text-gray-100 shadow-lg">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <Link
            to="/home"
            className="text-2xl font-bold uppercase text-white-500 hover:text-gray-400 transition-colors"
          >
            Energy Games
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/home"
              className="hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg font-semibold transition-all"
            >
              Home
            </Link>
            <Link
              to="/produtos"
              className="hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg font-semibold transition-all"
            >
              Produtos
            </Link>

            {/* Admin Links */}
            {isAdmin && (
              <>
                <Link
                  to="/cadastrarProduto"
                  className="hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg font-semibold transition-all"
                >
                  Cad. Produto
                </Link>
                <Link
                  to="/categorias"
                  className="hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg font-semibold transition-all"
                >
                  Categorias
                </Link>
                <Link
                  to="/cadastrarCategoria"
                  className="hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg font-semibold transition-all"
                >
                  Cad. Categoria
                </Link>
              </>
            )}

            {/* User Section */}
            {isAuthenticated ? (
              <>
                {/* Favoritos */}
                <Link
                  to="/favoritos"
                  className="relative hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg transition-all flex items-center gap-2"
                  title="Favoritos"
                >
                  <Heart size={22} weight="bold" />
                  {totalFavoritos > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalFavoritos}
                    </span>
                  )}
                </Link>

                {/* Carrinho */}
                <Link
                  to="/carrinho"
                  className="relative hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg transition-all flex items-center gap-2"
                  title="Carrinho"
                >
                  <ShoppingCart size={22} weight="bold" />
                  {totalItens > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItens}
                    </span>
                  )}
                </Link>

                {/* Perfil */}
                <Link
                  to="/perfil"
                  className="hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg transition-all flex items-center gap-2"
                  title={usuario?.nome}
                >
                  <UserCircle size={22} weight="bold" />
                  <span className="hidden md:inline">{usuario?.nome.split(' ')[0]}</span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white py-2 px-4 rounded-lg transition-all"
                  aria-label="Sair"
                  title="Sair"
                >
                  <SignOut size={22} weight="bold" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-all"
              >
                <SignIn size={22} weight="bold" />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
