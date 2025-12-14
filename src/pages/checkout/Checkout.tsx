
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    CreditCard, 
    ShoppingBag, 
    Truck, 
    Shield, 
    Check, 
    ArrowLeft,
    Loader2,
    Package,
    AlertCircle
} from 'lucide-react';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import pedidoService from '../../services/pedido.service';
import { CarrinhoItem } from '../../services/carrinho.service';

type CheckoutStep = 'resumo' | 'confirmacao' | 'sucesso';

const Checkout = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const { itens, totalItens, limparCarrinho } = useCarrinho();
    const { success, error: toastError } = useToast();
    
    const [step, setStep] = useState<CheckoutStep>('resumo');
    const [loading, setLoading] = useState(false);
    const [pedidoId, setPedidoId] = useState<number | null>(null);

    useEffect(() => {
        if (!usuario) {
            navigate('/login');
            return;
        }
        if (itens.length === 0 && step !== 'sucesso') {
            navigate('/carrinho');
        }
    }, [usuario, itens, step, navigate]);

    const calcularTotal = () => {
        return itens.reduce((total: number, item: CarrinhoItem) => {
            return total + item.subtotal;
        }, 0);
    };

    const calcularEconomia = () => {
        return itens.reduce((total: number, item: CarrinhoItem) => {
            return total + (item.descontoUnitario * item.quantidade);
        }, 0);
    };

    const handleConfirmarPedido = async () => {
        try {
            setLoading(true);
            const pedido = await pedidoService.criar();
            setPedidoId(pedido.id);
            await limparCarrinho();
            setStep('sucesso');
            success('Pedido realizado!', `Seu pedido #${pedido.id} foi criado com sucesso.`);
        } catch (err) {
            console.error('Erro ao criar pedido:', err);
            toastError('Erro no checkout', 'Não foi possível finalizar seu pedido. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (!usuario) return null;

    // Página de Sucesso
    if (step === 'sucesso') {
        return (
            <div className="min-h-screen bg-neutral-950 py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="card-gaming p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent-500/20 
                                      flex items-center justify-center">
                            <Check size={40} className="text-accent-500" />
                        </div>
                        
                        <h1 className="heading-gamer text-3xl text-accent-500 mb-4">
                            Pedido Confirmado!
                        </h1>
                        
                        <p className="text-neutral-300 text-lg mb-2">
                            Seu pedido <span className="text-primary-400 font-bold">#{pedidoId}</span> foi 
                            realizado com sucesso.
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

    return (
        <div className="min-h-screen bg-neutral-950 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/carrinho')}
                        className="flex items-center gap-2 text-primary-400 hover:text-primary-300 
                                   transition-colors mb-4"
                    >
                        <ArrowLeft size={20} />
                        Voltar ao Carrinho
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <CreditCard className="text-primary-500" size={32} />
                        <h1 className="heading-gamer text-3xl">Finalizar Compra</h1>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className={`flex items-center gap-2 ${step === 'resumo' ? 'text-primary-400' : 'text-neutral-500'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                       ${step === 'resumo' ? 'bg-primary-500 text-white' : 'bg-neutral-800'}`}>
                            1
                        </div>
                        <span className="hidden sm:inline">Resumo</span>
                    </div>
                    <div className="w-12 h-px bg-neutral-700" />
                    <div className={`flex items-center gap-2 ${step === 'confirmacao' ? 'text-primary-400' : 'text-neutral-500'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                       ${step === 'confirmacao' ? 'bg-primary-500 text-white' : 'bg-neutral-800'}`}>
                            2
                        </div>
                        <span className="hidden sm:inline">Confirmação</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
                    {/* Main Content */}
                    <div className="space-y-6">
                        {step === 'resumo' && (
                            <>
                                {/* Lista de Itens */}
                                <div className="card-gaming p-6">
                                    <h2 className="heading-gamer text-xl mb-4 flex items-center gap-2">
                                        <ShoppingBag size={20} className="text-primary-400" />
                                        Itens do Pedido ({totalItens})
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        {itens.map((item: CarrinhoItem) => (
                                            <div 
                                                key={item.id} 
                                                className="flex gap-4 p-3 bg-neutral-900 rounded-lg"
                                            >
                                                <img 
                                                    src={item.produtoImagem || '/placeholder-game.png'} 
                                                    alt={item.produtoNome}
                                                    className="w-16 h-20 object-cover rounded"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-neutral-100 truncate">
                                                        {item.produtoNome}
                                                    </h3>
                                                    {item.plataforma && (
                                                        <span className="text-xs text-neutral-500">
                                                            {item.plataforma}
                                                        </span>
                                                    )}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-neutral-400 text-sm">
                                                            Qtd: {item.quantidade}
                                                        </span>
                                                        <span className="text-neutral-600">•</span>
                                                        <span className="text-accent-500 font-semibold">
                                                            R$ {item.subtotal.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Informações de Entrega */}
                                <div className="card-gaming p-6">
                                    <h2 className="heading-gamer text-xl mb-4 flex items-center gap-2">
                                        <Truck size={20} className="text-accent-400" />
                                        Entrega
                                    </h2>
                                    
                                    <div className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <Check size={20} className="text-accent-500" />
                                            <div>
                                                <p className="text-neutral-100 font-medium">
                                                    Entrega Digital Imediata
                                                </p>
                                                <p className="text-neutral-400 text-sm">
                                                    Seus jogos estarão disponíveis assim que o pedido for confirmado
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 'confirmacao' && (
                            <div className="card-gaming p-6">
                                <h2 className="heading-gamer text-xl mb-6 flex items-center gap-2">
                                    <AlertCircle size={20} className="text-primary-400" />
                                    Confirme seu Pedido
                                </h2>

                                <div className="space-y-4 mb-6">
                                    <div className="bg-neutral-900 rounded-lg p-4">
                                        <p className="text-neutral-300 mb-2">
                                            Você está prestes a finalizar a compra de:
                                        </p>
                                        <ul className="space-y-1">
                                            {itens.map((item: CarrinhoItem) => (
                                                <li key={item.id} className="text-neutral-400 text-sm">
                                                    • {item.produtoNome} (x{item.quantidade})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-primary-500/10 
                                                  border border-primary-500/30 rounded-lg">
                                        <Shield size={24} className="text-primary-400" />
                                        <div>
                                            <p className="text-neutral-100 font-medium">
                                                Compra Segura
                                            </p>
                                            <p className="text-neutral-400 text-sm">
                                                Seus dados estão protegidos e a transação é 100% segura.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep('resumo')}
                                        className="btn-outline flex-1"
                                        disabled={loading}
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        onClick={handleConfirmarPedido}
                                        className="btn-accent flex-1 justify-center"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Processando...
                                            </>
                                        ) : (
                                            <>
                                                <Check size={18} />
                                                Confirmar Pedido
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Resumo */}
                    <div className="card-gaming p-6 h-fit lg:sticky lg:top-6">
                        <h2 className="heading-gamer text-xl mb-6 pb-4 border-b border-neutral-800">
                            Resumo
                        </h2>
                        
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-neutral-300">
                                <span>Subtotal ({totalItens} {totalItens === 1 ? 'item' : 'itens'})</span>
                                <span>R$ {(calcularTotal() + calcularEconomia()).toFixed(2)}</span>
                            </div>

                            {calcularEconomia() > 0 && (
                                <div className="flex justify-between text-accent-500">
                                    <span>Descontos</span>
                                    <span>- R$ {calcularEconomia().toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-neutral-300">
                                <span>Frete</span>
                                <span className="text-accent-500 font-semibold">GRÁTIS</span>
                            </div>
                        </div>

                        <div className="h-px bg-neutral-800 my-4" />

                        <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-semibold text-neutral-100">Total</span>
                            <span className="text-2xl font-bold text-accent-500">
                                R$ {calcularTotal().toFixed(2)}
                            </span>
                        </div>

                        {step === 'resumo' && (
                            <button
                                onClick={() => setStep('confirmacao')}
                                className="btn-primary w-full justify-center text-lg py-3"
                            >
                                <CreditCard size={20} />
                                Continuar
                            </button>
                        )}

                        <div className="mt-6 pt-4 border-t border-neutral-800 space-y-3">
                            <div className="flex items-center gap-2 text-neutral-400 text-sm">
                                <Shield size={16} className="text-accent-500" />
                                <span>Compra 100% segura</span>
                            </div>
                            <div className="flex items-center gap-2 text-neutral-400 text-sm">
                                <Truck size={16} className="text-accent-500" />
                                <span>Entrega digital imediata</span>
                            </div>
                            <div className="flex items-center gap-2 text-neutral-400 text-sm">
                                <Package size={16} className="text-accent-500" />
                                <span>Garantia de satisfação</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
