import { X, User, ShoppingCart, Heart } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

interface LoginSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'favorite' | 'cart' | 'checkout';
  productName?: string;
}

const LoginSuggestionModal = ({ isOpen, onClose, action, productName }: LoginSuggestionModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const actionTexts = {
    favorite: {
      icon: <Heart size={48} className="text-red-500" />,
      title: 'Salve seus jogos favoritos!',
      description: 'Crie uma conta para favoritar jogos e nunca mais perder de vista aqueles que você quer jogar.',
    },
    cart: {
      icon: <ShoppingCart size={48} className="text-primary-500" />,
      title: 'Adicione ao seu carrinho!',
      description: 'Faça login para adicionar jogos ao carrinho e finalizar sua compra com segurança.',
    },
    checkout: {
      icon: <User size={48} className="text-accent-500" />,
      title: 'Finalize sua compra!',
      description: 'Entre na sua conta para continuar com o processo de compra.',
    },
  };

  const currentAction = actionTexts[action];

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  const handleRegister = () => {
    navigate('/cadastro');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-lg border border-neutral-700 max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            {currentAction.icon}
          </div>
          
          <h2 className="text-2xl font-bold text-neutral-100 mb-2">
            {currentAction.title}
          </h2>
          
          <p className="text-neutral-300 mb-6">
            {currentAction.description}
            {productName && (
              <span className="block mt-2 text-primary-400 font-semibold">
                "{productName}"
              </span>
            )}
          </p>

          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full btn-primary py-3"
            >
              Fazer Login
            </button>
            
            <button
              onClick={handleRegister}
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-3 rounded-lg transition-colors border border-neutral-600"
            >
              Criar Conta Grátis
            </button>
            
            <button
              onClick={onClose}
              className="w-full text-neutral-400 hover:text-neutral-200 py-2 transition-colors"
            >
              Continuar navegando
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSuggestionModal;
