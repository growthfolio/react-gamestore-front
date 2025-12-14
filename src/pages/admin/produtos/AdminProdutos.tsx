import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Package, 
    MagnifyingGlass, 
    PencilSimple, 
    Cube,
    CheckCircle,
    XCircle,
    Funnel,
    CloudArrowDown
} from '@phosphor-icons/react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import ProdutoService, { Produto, PaginatedResponse } from '../../../services/produto.service';
import { ProdutoComercialModal } from '../../../components/admin/ProdutoComercialModal';

const AdminProdutos: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const { success, error: toastError } = useToast();
    
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAtivo, setFilterAtivo] = useState<boolean | undefined>(undefined);
    const [filterSemEstoque, setFilterSemEstoque] = useState(false);
    
    // Modal de edição comercial
    const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        } else {
            fetchProdutos();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin, navigate, page, filterAtivo, filterSemEstoque]);

    const fetchProdutos = async () => {
        try {
            setLoading(true);
            const response: PaginatedResponse<Produto> = await ProdutoService.listarAdmin({
                nome: searchTerm || undefined,
                ativo: filterAtivo,
                semEstoque: filterSemEstoque ? true : undefined,
                page,
                size: 15
            });
            setProdutos(response.content);
            setTotalPages(response.totalPages);
        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
            toastError('Erro', 'Não foi possível carregar os produtos');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(0);
        fetchProdutos();
    };

    const handleOpenComercialModal = (produto: Produto) => {
        setSelectedProduto(produto);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedProduto(null);
        setShowModal(false);
    };

    const handleSaveComercial = async (dados: {
        preco: number;
        estoque: number;
        desconto: number;
        ativo: boolean;
    }) => {
        if (!selectedProduto) return;
        
        try {
            setLoading(true);
            await ProdutoService.atualizarDadosComerciais(selectedProduto.id, dados);
            success('Sucesso', `Produto "${selectedProduto.nome}" atualizado com sucesso!`);
            handleCloseModal();
            fetchProdutos(); // Recarregar lista
        } catch (err) {
            console.error('Erro ao atualizar produto:', err);
            toastError('Erro', 'Não foi possível atualizar o produto');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-8 pt-24">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cyan-500/30 pb-6">
                    <div>
                        <h1 className="text-4xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 flex items-center gap-3">
                            <Package weight="duotone" />
                            Gerenciar Produtos
                        </h1>
                        <p className="text-slate-400 mt-2 font-rajdhani text-lg">
                            Configure preços, estoque e ative produtos para venda
                        </p>
                    </div>
                    
                    <button
                        onClick={() => navigate('/admin/igdb')}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2 rounded-lg text-white font-bold transition-all shadow-lg"
                    >
                        <CloudArrowDown size={20} />
                        Importar da IGDB
                    </button>
                </div>

                {/* Filters Section */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlass className="text-slate-400" size={20} />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Buscar por nome do produto..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-500 transition-all font-rajdhani text-lg"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <Funnel className="text-slate-400" size={20} />
                            
                            <select
                                value={filterAtivo === undefined ? '' : filterAtivo.toString()}
                                onChange={(e) => setFilterAtivo(e.target.value === '' ? undefined : e.target.value === 'true')}
                                className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white font-rajdhani focus:ring-2 focus:ring-cyan-500"
                            >
                                <option value="">Todos Status</option>
                                <option value="true">Ativos</option>
                                <option value="false">Inativos</option>
                            </select>

                            <label className="flex items-center gap-2 cursor-pointer text-slate-300 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 hover:border-cyan-500/50 transition-all">
                                <input
                                    type="checkbox"
                                    checked={filterSemEstoque}
                                    onChange={(e) => setFilterSemEstoque(e.target.checked)}
                                    className="form-checkbox rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-cyan-500"
                                />
                                <span className="font-rajdhani">Sem estoque</span>
                            </label>

                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg transition-all disabled:opacity-50"
                            >
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                {loading ? (
                    <div className="w-full h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : produtos.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-slate-800 shadow-xl bg-slate-900/50 backdrop-blur-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-950 border-b border-slate-800">
                                    <th className="p-4 font-orbitron text-sm text-cyan-400 uppercase tracking-wider w-20">Img</th>
                                    <th className="p-4 font-orbitron text-sm text-cyan-400 uppercase tracking-wider">Produto</th>
                                    <th className="p-4 font-orbitron text-sm text-cyan-400 uppercase tracking-wider w-32 text-right">Preço</th>
                                    <th className="p-4 font-orbitron text-sm text-cyan-400 uppercase tracking-wider w-24 text-center">Desconto</th>
                                    <th className="p-4 font-orbitron text-sm text-cyan-400 uppercase tracking-wider w-24 text-center">Estoque</th>
                                    <th className="p-4 font-orbitron text-sm text-cyan-400 uppercase tracking-wider w-24 text-center">Status</th>
                                    <th className="p-4 font-orbitron text-sm text-cyan-400 uppercase tracking-wider w-24 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {produtos.map((produto) => (
                                    <tr 
                                        key={produto.id} 
                                        className={`group hover:bg-slate-800/50 transition-all duration-300 ${!produto.ativo ? 'opacity-70' : ''}`}
                                    >
                                        <td className="p-4">
                                            <div className="w-14 h-14 rounded overflow-hidden shadow-lg bg-slate-800">
                                                {produto.imagens && produto.imagens.length > 0 ? (
                                                    <img 
                                                        src={produto.imagens[0]} 
                                                        alt={produto.nome}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package size={20} className="text-slate-600" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors font-rajdhani text-lg">
                                                {produto.nome}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                {produto.categoria?.tipo || 'Sem categoria'} • {produto.plataforma}
                                            </p>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-green-400 font-rajdhani text-lg">
                                                    {formatPrice(produto.preco)}
                                                </span>
                                                {produto.desconto > 0 && (
                                                    <span className="text-sm text-orange-400">
                                                        → {formatPrice(produto.precoComDesconto)}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {produto.desconto > 0 ? (
                                                <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded font-bold">
                                                    -{produto.desconto}%
                                                </span>
                                            ) : (
                                                <span className="text-slate-600">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Cube size={16} className={produto.estoque > 0 ? 'text-cyan-400' : 'text-red-400'} />
                                                <span className={`font-bold ${produto.estoque > 0 ? 'text-white' : 'text-red-400'}`}>
                                                    {produto.estoque}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {produto.ativo ? (
                                                <span className="flex items-center justify-center gap-1 text-green-400">
                                                    <CheckCircle weight="fill" size={18} />
                                                    <span className="text-xs font-bold">Ativo</span>
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-1 text-red-400">
                                                    <XCircle weight="fill" size={18} />
                                                    <span className="text-xs font-bold">Inativo</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleOpenComercialModal(produto)}
                                                className="p-2 bg-slate-800 hover:bg-cyan-600 text-cyan-400 hover:text-white rounded-lg transition-all border border-slate-700 hover:border-cyan-500"
                                                title="Editar Dados Comerciais"
                                            >
                                                <PencilSimple size={18} weight="bold" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/50 border-dashed">
                        <Package size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-xl font-rajdhani">Nenhum produto encontrado</p>
                        <p className="text-sm mt-2">Importe jogos da IGDB ou ajuste os filtros.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-6 pb-8">
                        <button
                            onClick={() => setPage(Math.max(0, page - 1))}
                            disabled={page === 0 || loading}
                            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-cyan-400 font-rajdhani font-bold transition-all border border-slate-700 hover:border-cyan-500/50"
                        >
                            ANTERIOR
                        </button>
                        <span className="text-slate-400 font-rajdhani text-lg px-4">
                            Página <span className="text-white font-bold text-xl">{page + 1}</span> de {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                            disabled={page >= totalPages - 1 || loading}
                            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-cyan-400 font-rajdhani font-bold transition-all border border-slate-700 hover:border-cyan-500/50"
                        >
                            PRÓXIMO
                        </button>
                    </div>
                )}
            </div>

            {/* Modal de Edição Comercial */}
            {showModal && selectedProduto && (
                <ProdutoComercialModal
                    produto={selectedProduto}
                    onClose={handleCloseModal}
                    onSave={handleSaveComercial}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default AdminProdutos;
