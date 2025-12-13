import { Download, GameController, Star, Monitor, Calendar, CheckCircle } from '@phosphor-icons/react';
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
        <div className="overflow-x-auto rounded-lg border border-neutral-800 shadow-card-gaming bg-neutral-900/50 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-neutral-950 border-b border-neutral-800">
                        <th className="p-4 font-accent text-sm text-primary-400 uppercase tracking-wider w-24">Capa</th>
                        <th className="p-4 font-accent text-sm text-primary-400 uppercase tracking-wider">Título / Resumo</th>
                        <th className="p-4 font-accent text-sm text-primary-400 uppercase tracking-wider w-64">Plataformas</th>
                        <th className="p-4 font-accent text-sm text-primary-400 uppercase tracking-wider w-32 text-center">Nota</th>
                        <th className="p-4 font-accent text-sm text-primary-400 uppercase tracking-wider w-32 text-center">Lançamento</th>
                        <th className="p-4 font-accent text-sm text-primary-400 uppercase tracking-wider w-32 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                    {games.map((game) => (
                        <tr 
                            key={game.igdbId} 
                            className="group hover:bg-neutral-800/50 transition-all duration-300"
                        >
                            <td className="p-4">
                                <div className="w-16 h-20 rounded overflow-hidden shadow-lg relative group-hover:shadow-glow-sm transition-all">
                                    {game.urlCapa ? (
                                        <img 
                                            src={game.urlCapa} 
                                            alt={game.nome}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                            <GameController size={24} className="text-neutral-600" />
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="p-4">
                                <h3 className="font-gaming font-bold text-neutral-100 text-lg mb-1 group-hover:text-primary-400 transition-colors">
                                    {game.nome}
                                </h3>
                                <p className="text-sm text-neutral-400 line-clamp-2 font-sans">
                                    {game.descricao || 'Sem descrição disponível.'}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    {game.generos?.slice(0, 3).map((genre, idx) => (
                                        <span key={idx} className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex flex-wrap gap-1">
                                    {game.plataformas?.slice(0, 4).map((plat, idx) => (
                                        <span 
                                            key={idx} 
                                            className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-neutral-900 text-accent-400 border border-neutral-800"
                                        >
                                            <Monitor size={12} />
                                            {plat}
                                        </span>
                                    ))}
                                    {(game.plataformas?.length || 0) > 4 && (
                                        <span className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-400">
                                            +{(game.plataformas?.length || 0) - 4}
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <div className={`flex items-center gap-1 font-accent font-bold text-lg ${getRatingColor(game.rating)}`}>
                                        <Star weight="fill" />
                                        {game.rating ? Math.round(game.rating) : '-'}
                                    </div>
                                </div>
                            </td>
                            <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2 text-neutral-300 text-sm">
                                    <Calendar size={16} className="text-neutral-500" />
                                    {formatDate(game.dataLancamento)}
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                {game.jaImportado ? (
                                    <span className="flex items-center justify-end gap-1 text-green-500 font-bold text-sm">
                                        <CheckCircle size={20} weight="fill" />
                                        Importado
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => onImport(game)}
                                        className="btn-gaming bg-neutral-800 hover:bg-primary-600 text-primary-400 hover:text-white border border-primary-500/30 hover:border-primary-500 p-2 rounded-lg transition-all shadow-glow-sm hover:shadow-glow-md"
                                        title="Importar Jogo"
                                    >
                                        <Download size={20} weight="bold" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
