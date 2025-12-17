import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Package, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import billingService, { PaymentStatus } from '../../services/billing.service';

const CheckoutSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { usuario } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (!usuario) {
            navigate('/login');
            return;
        }

        if (!sessionId) {
            setError('Sessão de pagamento não encontrada');
            setLoading(false);
            return;
        }

        const checkPaymentStatus = async () => {
            try {
                const status = await billingService.getPaymentStatus(sessionId);
                setPaymentStatus(status);
            } catch (err) {
                console.error('Erro ao verificar status do pagamento:', err);
                setError('Não foi possível verificar o status do pagamento');
            } finally {
                setLoading(false);
            }
        };

        checkPaymentStatus();
    }, [sessionId, usuario, navigate]);

    if (!usuario) return null;

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="card-gaming p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-500/20 
                                      flex items-center justify-center">
                            <Loader2 size={40} className="text-primary-500 animate-spin" />
                        </div>
                        
                        <h1 className="heading-gamer text-3xl text-primary-400 mb-4">
                            Verificando Pagamento...
                        </h1>
                        
                        <p className="text-neutral-300 text-lg">
                            Aguarde enquanto confirmamos seu pagamento.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !paymentStatus) {
        return (
            <div className="min-h-screen bg-neutral-950 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="card-gaming p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/20 
                                      flex items-center justify-center">
                            <AlertCircle size={40} className="text-yellow-500" />
                        </div>
                        
                        <h1 className="heading-gamer text-3xl text-yellow-400 mb-4">
                            Verificação Pendente
                        </h1>
                        
                        <p className="text-neutral-300 text-lg mb-2">
                            {error || 'O status do pagamento ainda está sendo processado.'}
                        </p>
                        
                        <p className="text-neutral-500 mb-8">
                            Seu pedido pode levar alguns minutos para ser confirmado.
                            Você pode verificar o status na página de pedidos.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/pedidos')}
                                className="btn-primary"
                            >
                                <Package size={18} />
                                Ver Meus Pedidos
                            </button>
                            <button
                                onClick={() => navigate('/produtos')}
                                className="btn-outline"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Pagamento confirmado
    if (paymentStatus.status === 'paid') {
        return (
            <div className="min-h-screen bg-neutral-950 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="card-gaming p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-500/20 
                                      flex items-center justify-center">
                            <Check size={40} className="text-accent-500" />
                        </div>
                        
                        <h1 className="heading-gamer text-3xl text-accent-500 mb-4">
                            Pagamento Confirmado!
                        </h1>
                        
                        <p className="text-neutral-300 text-lg mb-2">
                            Seu pedido <span className="text-primary-400 font-bold">#{paymentStatus.pedidoId}</span> foi 
                            pago com sucesso.
                        </p>
                        
                        <p className="text-neutral-400 mb-2">
                            Valor total: <span className="text-accent-400 font-bold">
                                {paymentStatus.valorTotal.toLocaleString('pt-BR', { 
                                    style: 'currency', 
                                    currency: 'BRL' 
                                })}
                            </span>
                        </p>
                        
                        <p className="text-neutral-500 mb-8">
                            Você receberá um e-mail com os detalhes do seu pedido.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/pedidos')}
                                className="btn-primary"
                            >
                                <Package size={18} />
                                Ver Meus Pedidos
                            </button>
                            <button
                                onClick={() => navigate('/produtos')}
                                className="btn-outline"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Pagamento pendente
    return (
        <div className="min-h-screen bg-neutral-950 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="card-gaming p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/20 
                                  flex items-center justify-center">
                        <Loader2 size={40} className="text-yellow-500 animate-spin" />
                    </div>
                    
                    <h1 className="heading-gamer text-3xl text-yellow-400 mb-4">
                        Processando Pagamento...
                    </h1>
                    
                    <p className="text-neutral-300 text-lg mb-2">
                        Seu pedido <span className="text-primary-400 font-bold">#{paymentStatus.pedidoId}</span> está 
                        sendo processado.
                    </p>
                    
                    <p className="text-neutral-500 mb-8">
                        Isso pode levar alguns segundos. Você receberá uma confirmação em breve.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/pedidos')}
                            className="btn-primary"
                        >
                            <Package size={18} />
                            Ver Meus Pedidos
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-outline"
                        >
                            Atualizar Status
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
