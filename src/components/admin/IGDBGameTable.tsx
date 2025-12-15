import { Download, GameController, Star, Monitor, CheckCircle } from '@phosphor-icons/react';
import { IgdbSearchResult } from '../../services/igdb.service';

interface IGDBGameTableProps {
    games: IgdbSearchResult[];
    onImport: (game: IgdbSearchResult) => void;
    loading?: boolean;
}

export function IGDBGameTable({ games, onImport, loading }: IGDBGameTableProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        // Backend sends YYYY-MM-DD
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const getRatingColor = (rating?: number) => {
        if (!rating) return 'text-neutral-400';
        if (rating >= 90) return 'text-accent-400';
        if (rating >= 75) return 'text-primary-400';
        return 'text-secondary-400';
    };

    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
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

    return (
        <div className="rounded-lg border border-neutral-800 shadow-card-gaming bg-neutral-900/50 backdrop-blur-sm overflow-hidden">
            <div className="max-h-[calc(100vh-320px)] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-neutral-950 border-b border-neutral-800">
                            <th className="p-3 font-accent text-xs text-primary-400 uppercase tracking-wider w-16">Capa</th>
                            <th className="p-3 font-accent text-xs text-primary-400 uppercase tracking-wider">Título</th>
                            <th className="p-3 font-accent text-xs text-primary-400 uppercase tracking-wider w-40 hidden lg:table-cell">Gêneros</th>
                            <th className="p-3 font-accent text-xs text-primary-400 uppercase tracking-wider w-24 text-center hidden md:table-cell">Plataformas</th>
                            <th className="p-3 font-accent text-xs text-primary-400 uppercase tracking-wider w-20 text-center">Nota</th>
                            <th className="p-3 font-accent text-xs text-primary-400 uppercase tracking-wider w-24 text-center hidden sm:table-cell">Lançamento</th>
                            <th className="p-3 font-accent text-xs text-primary-400 uppercase tracking-wider w-28 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/50">
                        {games.map((game) => (
                            <tr 
                                key={game.igdbId} 
                                className="group hover:bg-neutral-800/40 transition-colors"
                            >
                                <td className="p-2">
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
                                </td>
                                <td className="p-2">
                                    <h3 className="font-gaming font-bold text-neutral-100 text-sm group-hover:text-primary-400 transition-colors line-clamp-1">
                                        {game.nome}
                                    </h3>
                                    <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">
                                        {game.generos?.slice(0, 2).join(', ') || 'Sem gênero'}
                                    </p>
                                </td>
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
                                <td className="p-2 text-center hidden md:table-cell">
                                    <div className="flex items-center justify-center gap-1">
                                        <Monitor size={14} className="text-accent-500" />
                                        <span className="text-xs text-neutral-300">{game.plataformas?.length || 0}</span>
                                    </div>
                                </td>
                                <td className="p-2 text-center">
                                    <div className={`flex items-center justify-center gap-0.5 font-accent font-bold text-sm ${getRatingColor(game.rating)}`}>
                                        <Star weight="fill" size={14} />
                                        <span>{game.rating ? Math.round(game.rating) : '-'}</span>
                                    </div>
                                </td>
                                <td className="p-2 text-center hidden sm:table-cell">
                                    <span className="text-neutral-400 text-xs">
                                        {formatDate(game.dataLancamento)}
                                    </span>
                                </td>
                                <td className="p-2 text-right">
                                    {game.jaImportado ? (
                                        <span className="inline-flex items-center gap-1 text-green-500 text-xs font-medium">
                                            <CheckCircle size={16} weight="fill" />
                                            <span className="hidden sm:inline">Importado</span>
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => onImport(game)}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-600/20 hover:bg-primary-600 text-primary-400 hover:text-white border border-primary-500/30 hover:border-primary-500 rounded text-xs font-medium transition-all"
                                            title="Importar Jogo"
                                        >
                                            <Download size={14} weight="bold" />
                                            <span className="hidden sm:inline">Importar</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
