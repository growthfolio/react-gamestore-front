import { useNavigate } from 'react-router-dom';
import { X, House, GameController, Heart, ShoppingCart, Package, User, SignIn, SignOut, Gear, Clock } from '@phosphor-icons/react';
import { useAuth } from '../../contexts/AuthContext';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useFavoritos } from '../../contexts/FavoritosContext';
import SearchBar from '../search/SearchBar';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, usuario, logout } = useAuth();
  const { totalItens } = useCarrinho();
  const { totalFavoritos } = useFavoritos();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-neutral-900 border-l border-neutral-800 z-50 lg:hidden overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <span className="heading-sm text-primary-400">Menu</span>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-gaming transition-colors">
            <X size={24} className="text-neutral-300" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-neutral-800">
          <SearchBar isMobile onClose={onClose} />
        </div>

        {/* User Info */}
        {isAuthenticated && usuario && (
          <div className="p-4 border-b border-neutral-800 bg-neutral-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-gaming flex items-center justify-center">
                <span className="font-accent font-bold text-white">
                  {usuario.nickname?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-neutral-100">{usuario.nickname}</p>
                <p className="text-xs text-neutral-400">{usuario.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <button onClick={() => handleNavigate('/home')} className="w-full flex items-center gap-3 px-4 py-3 rounded-gaming hover:bg-neutral-800 transition-colors text-left">
            <House size={22} className="text-primary-400" />
            <span className="text-neutral-200">Home</span>
          </button>

          <button onClick={() => handleNavigate('/produtos')} className="w-full flex items-center gap-3 px-4 py-3 rounded-gaming hover:bg-neutral-800 transition-colors text-left">
            <GameController size={22} className="text-accent-400" />
            <span className="text-neutral-200">Jogos</span>
          </button>

          <button onClick={() => handleNavigate('/favoritos')} className="w-full flex items-center justify-between px-4 py-3 rounded-gaming hover:bg-neutral-800 transition-colors">
            <div className="flex items-center gap-3">
              <Heart size={22} className="text-secondary-400" />
              <span className="text-neutral-200">Favoritos</span>
            </div>
            {totalFavoritos > 0 && (
              <span className="bg-secondary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalFavoritos}
              </span>
            )}
          </button>

          <button onClick={() => handleNavigate('/carrinho')} className="w-full flex items-center justify-between px-4 py-3 rounded-gaming hover:bg-neutral-800 transition-colors">
            <div className="flex items-center gap-3">
              <ShoppingCart size={22} className="text-primary-400" />
              <span className="text-neutral-200">Carrinho</span>
            </div>
            {totalItens > 0 && (
              <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItens}
              </span>
            )}
          </button>

          {isAuthenticated && (
            <>
              <button onClick={() => handleNavigate('/pedidos')} className="w-full flex items-center gap-3 px-4 py-3 rounded-gaming hover:bg-neutral-800 transition-colors text-left">
                <Package size={22} className="text-accent-400" />
                <span className="text-neutral-200">Meus Pedidos</span>
              </button>

              <button onClick={() => handleNavigate('/perfil')} className="w-full flex items-center gap-3 px-4 py-3 rounded-gaming hover:bg-neutral-800 transition-colors text-left">
                <User size={22} className="text-secondary-400" />
                <span className="text-neutral-200">Meu Perfil</span>
              </button>
            </>
          )}

          {/* Admin Section */}
          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-neutral-800">
              <p className="px-4 text-xs text-neutral-500 uppercase tracking-wide mb-2">Admin</p>
              
              <button onClick={() => handleNavigate('/admin/igdb')} className="w-full flex items-center gap-3 px-4 py-3 rounded-gaming hover:bg-neutral-800 transition-colors text-left">
                <Gear size={22} className="text-neutral-400" />
                <span className="text-neutral-200">IGDB</span>
              </button>

              <button onClick={() => handleNavigate('/admin/pre-cadastros')} className="w-full flex items-center gap-3 px-4 py-3 rounded-gaming hover:bg-neutral-800 transition-colors text-left">
                <Clock size={22} className="text-neutral-400" />
                <span className="text-neutral-200">Pendentes</span>
              </button>

              <button onClick={() => handleNavigate('/admin/produtos')} className="w-full flex items-center gap-3 px-4 py-3 rounded-gaming hover:bg-neutral-800 transition-colors text-left">
                <Package size={22} className="text-neutral-400" />
                <span className="text-neutral-200">Estoque</span>
              </button>

              <button onClick={() => handleNavigate('/categorias')} className="w-full flex items-center gap-3 px-4 py-3 rounded-gaming hover:bg-neutral-800 transition-colors text-left">
                <GameController size={22} className="text-neutral-400" />
                <span className="text-neutral-200">Categorias</span>
              </button>
            </div>
          )}
        </nav>

        {/* Auth Actions */}
        <div className="p-4 border-t border-neutral-800 mt-auto">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-error-500/10 text-error-500 rounded-gaming hover:bg-error-500/20 transition-colors"
            >
              <SignOut size={20} />
              <span className="font-semibold">Sair</span>
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => handleNavigate('/login')}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                <SignIn size={20} />
                <span>Entrar</span>
              </button>
              <button
                onClick={() => handleNavigate('/cadastro')}
                className="w-full btn-outline py-3"
              >
                Criar Conta
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MobileMenu;
