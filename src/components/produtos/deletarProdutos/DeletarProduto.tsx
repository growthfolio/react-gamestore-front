import { useState } from 'react'
import { Produto } from '../../../models/produtos/Produto'
import produtoService from '../../../services/produto.service'
import { useToast } from '../../../contexts/ToastContext'
import { getErrorMessage, ErrorMessages } from '../../../utils/errorHandler'
import { Warning, Trash, X, GameController } from '@phosphor-icons/react'

interface DeletarProdutoProps {
  produto: Produto;
  onClose: () => void;
  onDeleted: () => void;
}

function DeletarProduto({ produto, onClose, onDeleted }: DeletarProdutoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  async function deletarProduto() {
    setIsLoading(true);

    try {
      await produtoService.deletar(produto.id);
      toast.success('Sucesso!', 'Produto excluído com sucesso');
      onDeleted();
    } catch (error: unknown) {
      console.error('Erro ao deletar produto:', error);
      toast.error('Erro', getErrorMessage(error, ErrorMessages.deleteFailed('produto')));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Warning size={24} className="text-white" weight="fill" />
            <h2 className="text-xl font-bold text-white">Excluir Produto</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-neutral-300 mb-4">
            Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
          </p>

          {/* Produto Info */}
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 flex items-center gap-4">
            {produto.imagens && produto.imagens.length > 0 ? (
              <img 
                src={produto.imagens[0]} 
                alt={produto.nome}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-neutral-700 flex items-center justify-center">
                <GameController size={24} className="text-neutral-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white truncate">{produto.nome}</h3>
              <p className="text-sm text-neutral-400">{produto.plataforma}</p>
              <p className="text-sm text-accent-400 font-semibold">
                R$ {produto.preco?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-neutral-800/30 border-t border-neutral-800 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn-ghost flex-1 justify-center"
          >
            Cancelar
          </button>
          <button
            onClick={deletarProduto}
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Trash size={18} />
                Excluir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletarProduto