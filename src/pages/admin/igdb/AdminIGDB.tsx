import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MagnifyingGlass, GameController, CloudArrowDown, Package, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { IGDBGameTable } from '../../../components/admin/IGDBGameTable';
import { IGDBImportModal } from '../../../components/admin/IGDBImportModal';
import { LoadingModal } from '../../../components/loaders';
import { FormInput, FormButton } from '../../../components/forms';
import IgdbService, { IgdbSearchResult } from '../../../services/igdb.service';
import ProdutoService from '../../../services/produto.service';

const AdminIGDB: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const { success, error: toastError } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<IgdbSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [gameToImport, setGameToImport] = useState<IgdbSearchResult | null>(null);
    const [importLoading, setImportLoading] = useState(false);
    const [importingIds, setImportingIds] = useState<number[]>([]);
    const [batchImportProgress, setBatchImportProgress] = useState<{ current: number; total: number } | null>(null);

    const fetchGames = useCallback(async (term?: string, pageNum: number = 1) => {
        try {
            setLoading(true);
            const results = await IgdbService.searchGames(term, pageNum);
            setSearchResults(results);
        } catch (err) {
            console.error('Erro ao buscar jogos:', err);
            toastError('Erro na busca', 'Não foi possível buscar jogos no IGDB');
        } finally {
            setLoading(false);
        }
    }, [toastError]);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        } else {
            fetchGames();
        }
    }, [isAdmin, navigate, fetchGames]);

    const handleSearch = () => {
        setPage(1);
        fetchGames(searchTerm, 1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1) return;
        setPage(newPage);
        fetchGames(searchTerm, newPage);
    };

    const handleImportGame = (game: IgdbSearchResult) => {
        setGameToImport(game);
    };

    // Importação como pré-cadastro (modo padrão)
    const handleImportPending = async () => {
        if (!gameToImport) return;

        try {
            setImportLoading(true);
            
            // Apenas importa o jogo da IGDB (fica com ativo=false por padrão)
            await IgdbService.importGame(gameToImport.igdbId);
            
            success('Sucesso', `"${gameToImport.nome}" importado para pré-cadastro!`);
            
            setSearchResults(prev => prev.map(item => 
                item.igdbId === gameToImport.igdbId 
                    ? { ...item, jaImportado: true } 
                    : item
            ));
            
            setGameToImport(null);
        } catch (err) {
            console.error('Erro ao importar jogo:', err);
            toastError('Erro na importação', 'Não foi possível importar o jogo');
        } finally {
            setImportLoading(false);
        }
    };

    // Importação com ativação imediata
    const handleImportActive = async (comercialData: {
        preco: number;
        estoque: number;
        desconto: number;
    }) => {
        if (!gameToImport) return;

        try {
            setImportLoading(true);
            
            // Primeiro importa o jogo da IGDB
            const importResult = await IgdbService.importGame(gameToImport.igdbId);
            
            // Depois atualiza com os dados comerciais e ativa
            await ProdutoService.atualizarDadosComerciais(importResult.produtoId, {
                preco: comercialData.preco,
                estoque: comercialData.estoque,
                desconto: comercialData.desconto,
                ativo: true,
            });
            
            success('Sucesso', `"${gameToImport.nome}" importado e ativado com sucesso!`);
            
            setSearchResults(prev => prev.map(item => 
                item.igdbId === gameToImport.igdbId 
                    ? { ...item, jaImportado: true } 
                    : item
            ));
            
            setGameToImport(null);
        } catch (err) {
            console.error('Erro ao importar jogo:', err);
            toastError('Erro na importação', 'Não foi possível importar o jogo');
        } finally {
            setImportLoading(false);
        }
    };

    // Importação em lote (múltiplos jogos de uma vez)
    const handleBatchImport = async (games: IgdbSearchResult[]) => {
        const ids = games.map(g => g.igdbId);
        setImportingIds(ids);
        setBatchImportProgress({ current: 0, total: games.length });
        
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            setBatchImportProgress({ current: i + 1, total: games.length });
            
            try {
                await IgdbService.importGame(game.igdbId);
                successCount++;
                
                // Atualiza estado para mostrar como importado
                setSearchResults(prev => prev.map(item => 
                    item.igdbId === game.igdbId 
                        ? { ...item, jaImportado: true } 
                        : item
                ));
                
                // Remove do array de "importando"
                setImportingIds(prev => prev.filter(id => id !== game.igdbId));
            } catch (err) {
                console.error(`Erro ao importar ${game.nome}:`, err);
                errorCount++;
                setImportingIds(prev => prev.filter(id => id !== game.igdbId));
            }
        }
        
        setBatchImportProgress(null);
        
        // Feedback final
        if (successCount > 0 && errorCount === 0) {
            success('Importação concluída', `${successCount} jogo${successCount > 1 ? 's' : ''} importado${successCount > 1 ? 's' : ''} com sucesso!`);
        } else if (successCount > 0 && errorCount > 0) {
            success('Importação parcial', `${successCount} importado${successCount > 1 ? 's' : ''}, ${errorCount} erro${errorCount > 1 ? 's' : ''}`);
        } else {
            toastError('Erro na importação', 'Não foi possível importar os jogos selecionados');
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
                            <GameController weight="duotone" className="text-primary-400" />
                            Integração IGDB
                        </h1>
                        <p className="body-lg text-neutral-400 mt-2">
                            Busque e importe jogos diretamente da base de dados oficial
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/admin/produtos"
                            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-gaming border border-neutral-700 hover:border-primary-500/50 transition-all"
                        >
                            <Package className="text-accent-400" size={20} />
                            <span className="text-sm font-gaming text-neutral-300">Gerenciar Produtos</span>
                        </Link>
                        <div className="flex items-center gap-2 bg-neutral-900/50 px-4 py-2 rounded-gaming border border-neutral-800">
                            <CloudArrowDown className="text-primary-400" size={24} />
                            <span className="text-sm text-neutral-400">
                                API: <span className="text-accent-500 font-bold">Online</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="card-gaming p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <FormInput
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
                                placeholder="Digite o nome do jogo para buscar..."
                                icon={<MagnifyingGlass size={20} />}
                                disabled={loading}
                            />
                        </div>
                        <FormButton
                            onClick={handleSearch}
                            loading={loading}
                            loadingText="Buscando..."
                            icon={<MagnifyingGlass weight="bold" size={20} />}
                            variant="primary"
                            size="md"
                        >
                            BUSCAR
                        </FormButton>
                    </div>
                </div>

                {/* Results Section */}
                {searchResults.length > 0 ? (
                    <div className="space-y-3">
                        {/* Header com título e paginação superior */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex items-center gap-3">
                                <h2 className="heading-gamer heading-sm text-primary-400">
                                    {searchTerm ? 'Resultados da Busca' : 'Jogos Populares'}
                                </h2>
                                {searchTerm && (
                                    <span className="text-xs px-2 py-1 rounded bg-primary-500/20 text-primary-300 border border-primary-500/30">
                                        "{searchTerm}"
                                    </span>
                                )}
                            </div>
                            
                            {/* Paginação Superior - Compacta */}
                            <div className="flex items-center gap-2">
                                <span className="text-neutral-500 text-sm">
                                    {searchResults.length} jogos · Página {page}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 1 || loading}
                                        className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <CaretLeft size={16} className="text-neutral-300" />
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(page + 1)}
                                        disabled={loading || searchResults.length < 20}
                                        className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <CaretRight size={16} className="text-neutral-300" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <IGDBGameTable 
                            games={searchResults} 
                            onImport={handleImportGame}
                            onBatchImport={handleBatchImport}
                            loading={loading}
                            importingIds={importingIds}
                        />

                        {/* Paginação Inferior - Completa */}
                        <div className="flex justify-center items-center gap-3 py-4">
                            <FormButton
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1 || loading}
                                variant="ghost"
                                size="sm"
                                icon={<CaretLeft size={18} />}
                            >
                                Anterior
                            </FormButton>
                            <span className="text-neutral-400 font-gaming text-sm px-3">
                                Página <span className="text-primary-400 font-bold">{page}</span>
                            </span>
                            <FormButton
                                onClick={() => handlePageChange(page + 1)}
                                disabled={loading || searchResults.length < 20}
                                variant="ghost"
                                size="sm"
                                icon={<CaretRight size={18} />}
                                iconPosition="right"
                            >
                                Próximo
                            </FormButton>
                        </div>
                    </div>
                ) : (
                    !loading && (
                        <div className="text-center py-12 text-neutral-500 bg-neutral-900/30 rounded-card border border-neutral-800/50 border-dashed">
                            <GameController size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-xl font-gaming">
                                {searchTerm ? `Nenhum jogo encontrado para "${searchTerm}"` : 'Nenhum jogo popular encontrado'}
                            </p>
                            <p className="text-sm mt-2 body-sm">Tente buscar por outro nome ou verifique a conexão com a API.</p>
                        </div>
                    )
                )}
            </div>

            {/* Modal de Importação */}
            {gameToImport && (
                <IGDBImportModal
                    game={gameToImport}
                    onClose={() => setGameToImport(null)}
                    onImportPending={handleImportPending}
                    onImportActive={handleImportActive}
                    isLoading={importLoading}
                />
            )}

            {/* Loading Modal para importação em lote */}
            <LoadingModal 
                isVisible={batchImportProgress !== null} 
                title="Importando jogos..." 
                description="Aguarde enquanto importamos os jogos selecionados..."
                counter={batchImportProgress || undefined}
            />
        </div>
    );
};

export default AdminIGDB;
