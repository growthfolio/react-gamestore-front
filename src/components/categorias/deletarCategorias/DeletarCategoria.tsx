import { useState } from 'react';
import { AlertTriangle, X, Trash2, Loader2, Gamepad2 } from 'lucide-react';
import Categoria from '../../../models/categorias/Categoria';
import { deletar } from '../../../services/Services';
import { useToast } from '../../../contexts/ToastContext';

interface DeletarCategoriaProps {
    categoria: Categoria;
    onClose: () => void;
    onDeleted: () => void;
}

function DeletarCategoria({ categoria, onClose, onDeleted }: DeletarCategoriaProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const toast = useToast();

    async function handleDelete() {
        setIsLoading(true);

        try {
            await deletar(`/categorias/${categoria.id}`);
            toast.success('Sucesso!', 'Categoria excluída com sucesso!');
            onDeleted();
        } catch (error) {
            toast.error('Erro', 'Erro ao excluir categoria. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl overflow-hidden shadow-2xl shadow-red-500/10 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 p-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    Excluir Categoria
                                </h2>
                                <p className="text-red-100 text-sm">
                                    Esta ação não pode ser desfeita
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="p-2 hover:bg-white/20 rounded-xl transition-all text-white disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Categoria Info */}
                    <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-neutral-700 to-neutral-800 border border-neutral-600 flex items-center justify-center text-primary-400">
                                <Gamepad2 className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-white truncate">
                                    {categoria.tipo}
                                </h3>
                                <p className="text-neutral-400 text-sm truncate">
                                    {categoria.descricao || 'Sem descrição'}
                                </p>
                                <span className={`
                                    inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium
                                    ${categoria.ativo 
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }
                                `}>
                                    {categoria.ativo ? '● Ativo' : '○ Inativo'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                        <p className="text-red-300 text-sm">
                            <strong>Atenção:</strong> Ao excluir esta categoria, todos os produtos associados a ela ficarão sem categoria. Deseja continuar?
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 
                                       border border-neutral-600 hover:border-neutral-500
                                       rounded-xl text-neutral-300 font-medium
                                       transition-all duration-200 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 
                                       rounded-xl text-white font-medium
                                       flex items-center justify-center gap-2
                                       transition-all duration-200 disabled:opacity-50
                                       shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Excluindo...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-5 h-5" />
                                    Excluir
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeletarCategoria;