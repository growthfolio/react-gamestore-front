import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';

const CheckoutCancel = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const pedidoId = searchParams.get('pedido_id');

    return (
        <div className="min-h-screen bg-neutral-950 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="card-gaming p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 
                                  flex items-center justify-center">
                        <XCircle size={40} className="text-red-500" />
                    </div>
                    
                    <h1 className="heading-gamer text-3xl text-red-400 mb-4">
                        Pagamento Cancelado
                    </h1>
                    
                    {pedidoId && (
                        <p className="text-neutral-300 text-lg mb-2">
                            O pagamento do pedido <span className="text-primary-400 font-bold">#{pedidoId}</span> foi 
                            cancelado.
                        </p>
                    )}
                    
                    <p className="text-neutral-500 mb-8">
                        Não se preocupe, nenhum valor foi cobrado. Você pode tentar novamente a qualquer momento.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/carrinho')}
                            className="btn-primary"
                        >
                            <ShoppingCart size={18} />
                            Voltar ao Carrinho
                        </button>
                        <button
                            onClick={() => navigate('/produtos')}
                            className="btn-outline"
                        >
                            <ArrowLeft size={18} />
                            Continuar Comprando
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutCancel;
