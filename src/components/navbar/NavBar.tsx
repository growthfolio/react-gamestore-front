import { Link } from "react-router-dom";
import { SignOut } from "@phosphor-icons/react";

function NavBar() {
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
            {/* Sign Out */}
            <a
              href="#"
              className="flex items-center justify-center gap-2 text-white-500 hover:bg-red-500 hover:text-gray-100 py-2 px-4 rounded-lg transition-all"
              aria-label="Sign Out"
            >
              <SignOut size={22} weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
