import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  GameController,
  CloudArrowDown,
  CheckCircle,
  Trash,
  CaretLeft,
  CaretRight,
  CalendarBlank,
  Tag,
  Star,
  Package,
} from '@phosphor-icons/react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { FormButton } from '../../../components/forms';
import { AtivarProdutoModal } from '../../../components/admin/AtivarProdutoModal';
import { DescartarProdutoModal } from '../../../components/admin/DescartarProdutoModal';
import ProdutoService from '../../../services/produto.service';
import { Produto } from '../../../models/produtos/Produto';
import { getErrorMessage } from '../../../utils/errorHandler';

const AdminPreCadastros: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Modal states
  const [produtoParaAtivar, setProdutoParaAtivar] = useState<Produto | null>(null);
  const [produtoParaDescartar, setProdutoParaDescartar] = useState<Produto | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendentes = useCallback(async (pageNum: number = 0) => {
    try {
      setLoading(true);
      const response = await ProdutoService.listarPendentes({
        page: pageNum,
        size: 12,
        sort: 'dataCriacao,desc',
      });
      setProdutos(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      console.error('Erro ao buscar pré-cadastros:', err);
      toastError('Erro', getErrorMessage(err, 'Não foi possível carregar os pré-cadastros'));
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    } else {
      fetchPendentes(page);
    }
  }, [isAdmin, navigate, fetchPendentes, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    setPage(newPage);
  };

  // Ativar produto
  const handleAtivarConfirm = async (dados: { preco: number; estoque: number; desconto: number }) => {
    if (!produtoParaAtivar) return;

    try {
      setActionLoading(true);
      await ProdutoService.atualizarDadosComerciais(produtoParaAtivar.id, {
        preco: dados.preco,
        estoque: dados.estoque,
        desconto: dados.desconto,
        ativo: true,
      });
      success('Sucesso', `"${produtoParaAtivar.nome}" foi ativado com sucesso!`);
      setProdutoParaAtivar(null);
      fetchPendentes(page);
    } catch (err) {
      console.error('Erro ao ativar produto:', err);
      toastError('Erro', getErrorMessage(err, 'Não foi possível ativar o produto'));
    } finally {
      setActionLoading(false);
    }
  };

  // Descartar produto
  const handleDescartarConfirm = async () => {
    if (!produtoParaDescartar) return;

    try {
      setActionLoading(true);
      await ProdutoService.deletar(produtoParaDescartar.id);
      success('Sucesso', `"${produtoParaDescartar.nome}" foi descartado`);
      setProdutoParaDescartar(null);
      fetchPendentes(page);
    } catch (err) {
      console.error('Erro ao descartar produto:', err);
      toastError('Erro', getErrorMessage(err, 'Não foi possível descartar o produto'));
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-0 p-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary-500/30 pb-6">
          <div>
            <h1 className="heading-gamer heading-xl text-glow-primary flex items-center gap-3">
              <Clock weight="duotone" className="text-primary-400" />
              Pré-Cadastros
            </h1>
            <p className="body-lg text-neutral-400 mt-2">
              Jogos importados da IGDB aguardando definição de preço e ativação
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/igdb"
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-gaming border border-neutral-700 hover:border-primary-500/50 transition-all"
            >
              <CloudArrowDown className="text-primary-400" size={20} />
              <span className="text-sm font-gaming text-neutral-300">Importar da IGDB</span>
            </Link>
            <div className="flex items-center gap-2 bg-neutral-900/50 px-4 py-2 rounded-gaming border border-neutral-800">
              <Package className="text-accent-400" size={24} />
              <span className="text-sm text-neutral-400">
                <span className="text-accent-500 font-bold">{totalElements}</span> pendentes
              </span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : produtos.length > 0 ? (
          <div className="space-y-6">
            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {produtos.map((produto) => (
                <PreCadastroCard
                  key={produto.id}
                  produto={produto}
                  onAtivar={() => setProdutoParaAtivar(produto)}
                  onDescartar={() => setProdutoParaDescartar(produto)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6 pb-8">
                <FormButton
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0 || loading}
                  variant="ghost"
                  size="md"
                  icon={<CaretLeft size={20} />}
                >
                  ANTERIOR
                </FormButton>
                <span className="text-neutral-400 font-gaming text-lg px-4">
                  Página <span className="text-neutral-0 font-bold text-xl">{page + 1}</span> de{' '}
                  <span className="text-neutral-0 font-bold text-xl">{totalPages}</span>
                </span>
                <FormButton
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1 || loading}
                  variant="ghost"
                  size="md"
                  icon={<CaretRight size={20} />}
                  iconPosition="right"
                >
                  PRÓXIMO
                </FormButton>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-neutral-900/30 rounded-card border border-neutral-800/50 border-dashed">
            <CheckCircle size={64} className="mx-auto mb-4 text-green-500/30" />
            <p className="text-xl font-gaming text-neutral-400 mb-2">
              Nenhum pré-cadastro pendente
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              Todos os jogos importados já foram ativados ou descartados.
            </p>
            <Link
              to="/admin/igdb"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-lg transition-colors"
            >
              <CloudArrowDown size={20} />
              Importar Jogos da IGDB
            </Link>
          </div>
        )}
      </div>

      {/* Modals */}
      {produtoParaAtivar && (
        <AtivarProdutoModal
          produto={produtoParaAtivar}
          onClose={() => setProdutoParaAtivar(null)}
          onConfirm={handleAtivarConfirm}
          isLoading={actionLoading}
        />
      )}

      {produtoParaDescartar && (
        <DescartarProdutoModal
          produto={produtoParaDescartar}
          onClose={() => setProdutoParaDescartar(null)}
          onConfirm={handleDescartarConfirm}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};

// ============================================
// Componente Card de Pré-Cadastro
// ============================================
interface PreCadastroCardProps {
  produto: Produto;
  onAtivar: () => void;
  onDescartar: () => void;
}

const PreCadastroCard: React.FC<PreCadastroCardProps> = ({
  produto,
  onAtivar,
  onDescartar,
}) => {
  const imagemPrincipal = produto.imagens && produto.imagens.length > 0 
    ? produto.imagens[0] 
    : null;

  return (
    <div className="card-gaming overflow-hidden group">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {imagemPrincipal ? (
          <img
            src={imagemPrincipal}
            alt={produto.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <GameController size={48} className="text-neutral-600" />
          </div>
        )}

        {/* Overlay com Status */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/90 text-neutral-900 text-xs font-bold rounded">
            <Clock size={12} weight="bold" />
            Pendente
          </span>
        </div>

        {/* Rating Badge */}
        {produto.mediaAvaliacoes > 0 && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-900/80 backdrop-blur-sm text-accent-400 text-xs font-bold rounded">
              <Star size={12} weight="fill" />
              {produto.mediaAvaliacoes.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-white mb-2 line-clamp-1 group-hover:text-primary-400 transition-colors">
          {produto.nome}
        </h3>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2 mb-4">
          {produto.dataLancamento && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-400">
              <CalendarBlank size={10} />
              {produto.dataLancamento}
            </span>
          )}
          {produto.categoria && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-500/20 rounded text-xs text-primary-400">
              <Tag size={10} />
              {produto.categoria.tipo}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onAtivar}
            className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle size={16} weight="bold" />
            Ativar
          </button>
          <button
            onClick={onDescartar}
            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
            title="Descartar"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPreCadastros;
