import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import pedidoService from '../../services/pedido.service';
import { Pedido, ItemPedido } from '../../models/pedidos/Pedido';
import { 
    Package, 
    ChevronDown, 
    ChevronUp, 
    Clock, 
    CheckCircle, 
    XCircle, 
    AlertCircle,
    ShoppingBag,
    ArrowLeft,
    Calendar,
    Gamepad2
} from 'lucide-react';

const Pedidos = () => {
    const navigate = useNavigate();
    const { usuario } = useAuth();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedPedido, setExpandedPedido] = useState<number | null>(null);

    useEffect(() => {
        if (!usuario) {
            navigate('/login');
            return;
        }
        carregarPedidos();
    }, [usuario, navigate]);

    const carregarPedidos = async () => {
        try {
            setLoading(true);
            const data = await pedidoService.listarMeusPedidos();
            setPedidos(data);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'PENDENTE':
                return <Clock size={18} className="text-yellow-500" />;
            case 'CONFIRMADO':
            case 'APROVADO':
                return <CheckCircle size={18} className="text-green-500" />;
            case 'ENVIADO':
                return <Package size={18} className="text-blue-500" />;
            case 'ENTREGUE':
            case 'CONCLUIDO':
                return <CheckCircle size={18} className="text-accent-500" />;
            case 'CANCELADO':
                return <XCircle size={18} className="text-red-500" />;
            default:
                return <AlertCircle size={18} className="text-neutral-400" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'PENDENTE':
                return 'Pendente';
            case 'CONFIRMADO':
            case 'APROVADO':
                return 'Confirmado';
            case 'ENVIADO':
                return 'Enviado';
            case 'ENTREGUE':
            case 'CONCLUIDO':
                return 'Concluído';
            case 'CANCELADO':
                return 'Cancelado';
            default:
                return status || 'Desconhecido';
        }
    };

    const getStatusClass = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'PENDENTE':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'CONFIRMADO':
            case 'APROVADO':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'ENVIADO':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'ENTREGUE':
            case 'CONCLUIDO':
                return 'bg-accent-500/20 text-accent-400 border-accent-500/30';
            case 'CANCELADO':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
        }
    };

    const formatarData = (data: string) => {
        if (!data) return '';
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleExpandPedido = (pedidoId: number) => {
        setExpandedPedido(expandedPedido === pedidoId ? null : pedidoId);
    };

    if (!usuario) {
        return null;
    }

    return (
        <div className="min-h-screen bg-neutral-950 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/perfil')}
                        className="btn-ghost p-2"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="heading-gamer text-2xl md:text-3xl flex items-center gap-3">
                            <Package className="text-primary-500" size={32} />
                            Meus Pedidos
                        </h1>
                        <p className="text-neutral-400 mt-1">
                            Acompanhe o status dos seus pedidos
                        </p>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
                        <p className="text-neutral-400">Carregando pedidos...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && pedidos.length === 0 && (
                    <div className="card-gaming p-12 text-center">
                        <ShoppingBag size={64} className="mx-auto text-neutral-600 mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">
                            Nenhum pedido encontrado
                        </h2>
                        <p className="text-neutral-400 mb-6">
                            Você ainda não fez nenhuma compra. Que tal explorar nossos jogos?
                        </p>
                        <button
                            onClick={() => navigate('/produtos')}
                            className="btn-primary"
                        >
                            <Gamepad2 size={18} />
                            Ver Jogos
                        </button>
                    </div>
                )}

                {/* Lista de Pedidos */}
                {!loading && pedidos.length > 0 && (
                    <div className="space-y-4">
                        {pedidos.map((pedido: Pedido) => (
                            <div 
                                key={pedido.id} 
                                className="card-gaming overflow-hidden transition-all duration-300"
                            >
                                {/* Cabeçalho do Pedido */}
                                <button
                                    onClick={() => toggleExpandPedido(pedido.id)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-neutral-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-lg bg-primary-500/20">
                                            <Package className="text-primary-500" size={24} />
                                        </div>
                                        <div className="text-left">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-white">
                                                    Pedido #{pedido.id}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusClass(pedido.status)}`}>
                                                    <span className="flex items-center gap-1">
                                                        {getStatusIcon(pedido.status)}
                                                        {getStatusLabel(pedido.status)}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-neutral-400 text-sm mt-1">
                                                <Calendar size={14} />
                                                {formatarData(pedido.dataCriacao)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm text-neutral-400">Total</p>
                                            <p className="text-lg font-bold text-accent-400">
                                                R$ {pedido.valorTotal?.toFixed(2) || '0.00'}
                                            </p>
                                        </div>
                                        {expandedPedido === pedido.id ? (
                                            <ChevronUp className="text-neutral-400" size={20} />
                                        ) : (
                                            <ChevronDown className="text-neutral-400" size={20} />
                                        )}
                                    </div>
                                </button>

                                {/* Detalhes do Pedido (Expandido) */}
                                {expandedPedido === pedido.id && (
                                    <div className="border-t border-neutral-800 p-6 bg-neutral-900/50">
                                        <h3 className="font-semibold text-white mb-4">
                                            Itens do Pedido
                                        </h3>
                                        <div className="space-y-3">
                                            {pedido.itens?.map((item: ItemPedido, index: number) => (
                                                <div 
                                                    key={index}
                                                    className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-neutral-700 flex items-center justify-center">
                                                            <Gamepad2 size={20} className="text-neutral-400" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white">
                                                                {item.produtoNome || `Produto #${item.produtoId}`}
                                                            </p>
                                                            <p className="text-sm text-neutral-400">
                                                                Qtd: {item.quantidade} × R$ {item.precoUnitario?.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        {item.descontoUnitario > 0 && (
                                                            <p className="text-xs text-green-400">
                                                                -R$ {(item.descontoUnitario * item.quantidade).toFixed(2)}
                                                            </p>
                                                        )}
                                                        <p className="font-bold text-white">
                                                            R$ {item.subtotal?.toFixed(2) || '0.00'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Resumo */}
                                        <div className="mt-6 pt-4 border-t border-neutral-800">
                                            <div className="flex justify-between items-center">
                                                <span className="text-neutral-400">Subtotal</span>
                                                <span className="text-white">
                                                    R$ {pedido.valorTotal?.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-neutral-400">Frete</span>
                                                <span className="text-green-400">Grátis</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-700">
                                                <span className="font-bold text-white">Total</span>
                                                <span className="text-xl font-bold text-accent-400">
                                                    R$ {pedido.valorTotal?.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pedidos;
