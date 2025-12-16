import { useState, useEffect } from 'react';
import { Download, GameController, Star, Monitor, CheckCircle, CaretUp, CaretDown, Check } from '@phosphor-icons/react';
import { IgdbSearchResult } from '../../services/igdb.service';
import { PacmanLoader } from '../loaders';

type SortField = 'nome' | 'rating' | 'dataLancamento';
type SortDirection = 'asc' | 'desc';

interface IGDBGameTableProps {
    games: IgdbSearchResult[];
    onImport: (game: IgdbSearchResult) => void;
    onBatchImport?: (games: IgdbSearchResult[]) => void;
    loading?: boolean;
    importingIds?: number[]; // IDs sendo importados no momento
}

export function IGDBGameTable({ games, onImport, onBatchImport, loading, importingIds = [] }: IGDBGameTableProps) {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [sortField, setSortField] = useState<SortField | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [recentlyImported, setRecentlyImported] = useState<Set<number>>(new Set());

    // Limpa seleção quando os jogos mudam (nova página/busca)
    useEffect(() => {
        setSelectedIds(new Set());
    }, [games]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const getRatingColor = (rating?: number) => {
        if (!rating) return 'text-neutral-400';
        if (rating >= 90) return 'text-accent-400';
        if (rating >= 75) return 'text-primary-400';
        return 'text-secondary-400';
    };

    // Ordenação
    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection(field === 'nome' ? 'asc' : 'desc');
        }
    };

    const sortedGames = [...games].sort((a, b) => {
        if (!sortField) return 0;
        
        let comparison = 0;
        switch (sortField) {
            case 'nome':
                comparison = a.nome.localeCompare(b.nome);
                break;
            case 'rating':
                comparison = (a.rating || 0) - (b.rating || 0);
                break;
            case 'dataLancamento':
                comparison = (a.dataLancamento || '').localeCompare(b.dataLancamento || '');
                break;
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    // Seleção
    const availableForImport = games.filter(g => !g.jaImportado);
    const allSelected = availableForImport.length > 0 && 
        availableForImport.every(g => selectedIds.has(g.igdbId));

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(availableForImport.map(g => g.igdbId)));
        }
    };

    const toggleSelect = (igdbId: number) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(igdbId)) {
            newSet.delete(igdbId);
        } else {
            newSet.add(igdbId);
        }
        setSelectedIds(newSet);
    };

    const handleBatchImport = () => {
        const selectedGames = games.filter(g => selectedIds.has(g.igdbId) && !g.jaImportado);
        if (onBatchImport && selectedGames.length > 0) {
            onBatchImport(selectedGames);
        }
    };

    // Marca como recém-importado para animação
    const markAsImported = (igdbId: number) => {
        setRecentlyImported(prev => new Set([...prev, igdbId]));
        setTimeout(() => {
            setRecentlyImported(prev => {
                const newSet = new Set(prev);
                newSet.delete(igdbId);
                return newSet;
            });
        }, 2000);
    };

    const handleImport = (game: IgdbSearchResult) => {
        markAsImported(game.igdbId);
        onImport(game);
    };

    // Render do header ordenável
    const SortableHeader = ({ field, children, className = '' }: { field: SortField; children: React.ReactNode; className?: string }) => (
        <th 
            className={`p-3 font-accent text-xs uppercase tracking-wider cursor-pointer hover:text-primary-300 transition-colors select-none ${className} ${sortField === field ? 'text-primary-300' : 'text-primary-400'}`}
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center gap-1">
                {children}
                {sortField === field && (
                    sortDirection === 'asc' ? <CaretUp size={12} weight="bold" /> : <CaretDown size={12} weight="bold" />
                )}
            </div>
        </th>
    );

    // Loading State com PacmanLoader
    if (loading) {
        return (
            <div className="rounded-lg border border-neutral-800 shadow-card-gaming bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
                <div className="flex flex-col items-center justify-center py-16">
                    <PacmanLoader size="lg" text="Buscando jogos no IGDB..." />
                </div>
            </div>
        );
    }

    if (games.length === 0) {
        return (
            <div className="w-full py-12 text-center bg-neutral-900/50 rounded-lg border border-neutral-800 border-dashed">
                <GameController size={48} className="mx-auto text-neutral-600 mb-4" />
                <p className="text-neutral-400 font-gaming">Nenhum jogo encontrado</p>
            </div>
        );
    }

    const selectedCount = selectedIds.size;
    const importedCount = games.filter(g => g.jaImportado).length;

    return (
        <div className="space-y-2">
            {/* Barra de ações em lote */}
            {(selectedCount > 0 || importedCount > 0) && (
                <div className="flex items-center justify-between bg-neutral-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-neutral-800">
                    <div className="flex items-center gap-4">
                        {selectedCount > 0 && (
                            <span className="text-sm text-primary-400 font-medium">
                                {selectedCount} selecionado{selectedCount > 1 ? 's' : ''}
                            </span>
                        )}
                        {importedCount > 0 && (
                            <span className="text-sm text-neutral-500">
                                {importedCount} de {games.length} já importados
                            </span>
                        )}
                    </div>
                    {selectedCount > 0 && onBatchImport && (
                        <button
                            onClick={handleBatchImport}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded text-sm font-medium transition-colors"
                        >
                            <Download size={16} weight="bold" />
                            Importar {selectedCount} jogo{selectedCount > 1 ? 's' : ''}
                        </button>
                    )}
                </div>
            )}

            {/* Tabela */}
            <div className="rounded-lg border border-neutral-800 shadow-card-gaming bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
                <div className="max-h-[calc(100vh-380px)] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-neutral-950 border-b border-neutral-800">
                                {/* Checkbox header */}
                                <th className="p-3 w-10">
                                    <button
                                        onClick={toggleSelectAll}
                                        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                            allSelected 
                                                ? 'bg-primary-500 border-primary-500' 
                                                : 'border-neutral-600 hover:border-primary-500'
                                        }`}
                                        title={allSelected ? 'Desmarcar todos' : 'Selecionar todos disponíveis'}
                                    >
                                        {allSelected && <Check size={12} weight="bold" className="text-white" />}
                                    </button>
                                </th>
                                <th className="p-3 font-accent text-xs text-primary-400 uppercase tracking-wider w-16">Capa</th>
                                <SortableHeader field="nome">Título</SortableHeader>
                                <th className="p-3 font-accent text-xs text-primary-400 uppercase tracking-wider w-40 hidden lg:table-cell">Gêneros</th>
                                <th className="p-3 font-accent text-xs text-primary-400 uppercase tracking-wider w-24 text-center hidden md:table-cell">Plataformas</th>
                                <SortableHeader field="rating" className="w-20 text-center">Nota</SortableHeader>
                                <SortableHeader field="dataLancamento" className="w-24 text-center hidden sm:table-cell">Lançamento</SortableHeader>
                                <th className="p-3 font-accent text-xs text-primary-400 uppercase tracking-wider w-28 text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {sortedGames.map((game) => {
                                const isImporting = importingIds.includes(game.igdbId);
                                const wasJustImported = recentlyImported.has(game.igdbId);
                                const isSelected = selectedIds.has(game.igdbId);
                                
                                return (
                                    <tr 
                                        key={game.igdbId} 
                                        className={`group transition-all duration-300 ${
                                            wasJustImported 
                                                ? 'bg-green-500/10 animate-pulse' 
                                                : isSelected 
                                                    ? 'bg-primary-500/10' 
                                                    : 'hover:bg-neutral-800/40'
                                        }`}
                                    >
                                        {/* Checkbox */}
                                        <td className="p-2">
                                            {!game.jaImportado && (
                                                <button
                                                    onClick={() => toggleSelect(game.igdbId)}
                                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                                        isSelected 
                                                            ? 'bg-primary-500 border-primary-500' 
                                                            : 'border-neutral-600 hover:border-primary-500'
                                                    }`}
                                                >
                                                    {isSelected && <Check size={12} weight="bold" className="text-white" />}
                                                </button>
                                            )}
                                        </td>

                                        {/* Capa com preview hover */}
                                        <td className="p-2">
                                            <div className="relative group/cover">
                                                <div className="w-12 h-16 rounded overflow-hidden shadow-md group-hover:shadow-glow-sm transition-all">
                                                    {game.urlCapa ? (
                                                        <img 
                                                            src={game.urlCapa} 
                                                            alt={game.nome}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                                            <GameController size={18} className="text-neutral-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Preview expandido no hover */}
                                                {game.urlCapa && (
                                                    <div className="absolute left-full top-0 ml-2 z-20 hidden group-hover/cover:block">
                                                        <div className="w-32 h-44 rounded-lg overflow-hidden shadow-2xl border border-neutral-700 bg-neutral-900">
                                                            <img 
                                                                src={game.urlCapa.replace('t_cover_small', 't_cover_big')} 
                                                                alt={game.nome}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Título */}
                                        <td className="p-2">
                                            <h3 className="font-gaming font-bold text-neutral-100 text-sm group-hover:text-primary-400 transition-colors line-clamp-1">
                                                {game.nome}
                                            </h3>
                                            <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                                                {game.generos?.slice(0, 2).join(', ') || 'Sem gênero'}
                                            </p>
                                        </td>

                                        {/* Gêneros */}
                                        <td className="p-2 hidden lg:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {game.generos?.slice(0, 2).map((genre, idx) => (
                                                    <span key={idx} className="text-xs px-1.5 py-0.5 rounded bg-neutral-800/80 text-neutral-400">
                                                        {genre}
                                                    </span>
                                                ))}
                                                {(game.generos?.length || 0) > 2 && (
                                                    <span className="text-xs text-neutral-600">+{(game.generos?.length || 0) - 2}</span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Plataformas com tooltip */}
                                        <td className="p-2 text-center hidden md:table-cell">
                                            <div className="relative group/plat inline-flex items-center justify-center gap-1 cursor-help">
                                                <Monitor size={14} className="text-accent-500" />
                                                <span className="text-xs text-neutral-300">{game.plataformas?.length || 0}</span>
                                                
                                                {/* Tooltip com lista de plataformas */}
                                                {game.plataformas && game.plataformas.length > 0 && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/plat:block z-20">
                                                        <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 shadow-xl min-w-max">
                                                            <p className="text-xs text-neutral-400 mb-1 font-medium">Plataformas:</p>
                                                            <div className="flex flex-col gap-0.5">
                                                                {game.plataformas.map((plat, idx) => (
                                                                    <span key={idx} className="text-xs text-neutral-200">
                                                                        {plat}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            {/* Setinha do tooltip */}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-700"></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Nota */}
                                        <td className="p-2 text-center">
                                            <div className={`flex items-center justify-center gap-0.5 font-accent font-bold text-sm ${getRatingColor(game.rating)}`}>
                                                <Star weight="fill" size={14} />
                                                <span>{game.rating ? Math.round(game.rating) : '-'}</span>
                                            </div>
                                        </td>

                                        {/* Data */}
                                        <td className="p-2 text-center hidden sm:table-cell">
                                            <span className="text-neutral-400 text-xs">
                                                {formatDate(game.dataLancamento)}
                                            </span>
                                        </td>

                                        {/* Ação */}
                                        <td className="p-2 text-right">
                                            {game.jaImportado || wasJustImported ? (
                                                <span className={`inline-flex items-center gap-1 text-xs font-medium transition-all ${
                                                    wasJustImported ? 'text-green-400 animate-bounce' : 'text-green-500'
                                                }`}>
                                                    <CheckCircle size={16} weight="fill" />
                                                    <span className="hidden sm:inline">
                                                        {wasJustImported ? 'Importado!' : 'Importado'}
                                                    </span>
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleImport(game)}
                                                    disabled={isImporting}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                                                        isImporting
                                                            ? 'bg-neutral-700 text-neutral-400 cursor-wait'
                                                            : 'bg-primary-600/20 hover:bg-primary-600 text-primary-400 hover:text-white border border-primary-500/30 hover:border-primary-500'
                                                    }`}
                                                    title="Importar Jogo"
                                                >
                                                    {isImporting ? (
                                                        <>
                                                            <div className="w-3 h-3 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
                                                            <span className="hidden sm:inline">Importando...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Download size={14} weight="bold" />
                                                            <span className="hidden sm:inline">Importar</span>
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
