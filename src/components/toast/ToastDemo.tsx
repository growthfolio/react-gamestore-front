import React from 'react';
import { useToast } from '../../contexts/ToastContext';

const ToastDemo: React.FC = () => {
  const { success, error, warning, info } = useToast();

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-neutral-900 border border-neutral-800 rounded-gaming p-8 shadow-card-gaming">
          <h1 className="heading-lg text-glow-primary mb-8">Toast Notifications Demo</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => success('Sucesso!', 'Operação realizada com sucesso.')}
              className="btn-accent p-4 rounded-gaming"
            >
              Toast de Sucesso
            </button>

            <button
              onClick={() => error('Erro!', 'Algo deu errado na operação.')}
              className="bg-error-500 hover:bg-error-600 text-white p-4 rounded-gaming transition-colors"
            >
              Toast de Erro
            </button>

            <button
              onClick={() => warning('Atenção!', 'Verifique os dados antes de continuar.')}
              className="bg-secondary-500 hover:bg-secondary-600 text-neutral-900 p-4 rounded-gaming transition-colors"
            >
              Toast de Aviso
            </button>

            <button
              onClick={() => info('Informação', 'Nova atualização disponível.')}
              className="btn-primary p-4 rounded-gaming"
            >
              Toast de Info
            </button>

            <button
              onClick={() => {
                success('Login realizado!');
                setTimeout(() => error('Falha na conexão'), 1000);
                setTimeout(() => warning('Sessão expirando'), 2000);
                setTimeout(() => info('Dados sincronizados'), 3000);
              }}
              className="col-span-full bg-gradient-gaming text-white p-4 rounded-gaming hover:shadow-glow-md transition-all"
            >
              Testar Múltiplos Toasts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastDemo;
