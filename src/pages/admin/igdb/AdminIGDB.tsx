import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, GameController, CloudArrowDown } from '@phosphor-icons/react';
import { useAuth } from '../../../contexts/AuthContext';
import { IGDBGameTable } from '../../../components/admin/IGDBGameTable';

// Interface matching the one in IGDBGameTable
interface IGDBGame {
    id: number;
    name: string;
    summary?: string;
    cover?: {
        url: string;
    };
    first_release_date?: number;
    platforms?: Array<{ name: string }>;
    genres?: Array<{ name: string }>;
    rating?: number;
}

const AdminIGDB: React.FC = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<IGDBGame[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            alert('Digite um termo de busca');
            return;
        }

        try {
            setLoading(true);
            // TODO: Implementar chamada real à API IGDB através do backend
            // Por enquanto, vamos simular resultados
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulação de resultados
            const mockResults: IGDBGame[] = [
                {
                    id: 1,
                    name: `${searchTerm} - The Game`,
                    summary: 'Este é um jogo incrível com gráficos impressionantes e jogabilidade envolvente.',
                    cover: { url: 'https://via.placeholder.com/264x352' },
                    first_release_date: Date.now() / 1000,
                    platforms: [{ name: 'PlayStation 5' }, { name: 'Xbox Series X' }],
                    genres: [{ name: 'Action' }, { name: 'Adventure' }],
                    rating: 85
                },
                {
                    id: 2,
                    name: `${searchTerm}: Origins`,
                    summary: 'Um RPG épico com história profunda e personagens memoráveis.',
                    cover: { url: 'https://via.placeholder.com/264x352' },
                    first_release_date: Date.now() / 1000,
                    platforms: [{ name: 'PC' }, { name: 'Nintendo Switch' }],
                    genres: [{ name: 'RPG' }],
                    rating: 92
                },
                 {
                    id: 3,
                    name: `Super ${searchTerm} Kart`,
                    summary: 'Corrida alucinante com seus personagens favoritos.',
                    cover: { url: 'https://via.placeholder.com/264x352' },
                    first_release_date: Date.now() / 1000,
                    platforms: [{ name: 'Nintendo Switch' }],
                    genres: [{ name: 'Racing' }],
                    rating: 78
                }
            ];

            setSearchResults(mockResults);
        } catch (error) {
            console.error('Erro ao buscar jogos:', error);
            alert('Erro ao buscar jogos no IGDB');
        } finally {
            setLoading(false);
        }
    };

    const handleImportGame = async (game: IGDBGame) => {
        if (!window.confirm(`Importar "${game.name}" para o catálogo?`)) {
            return;
        }

        try {
            setLoading(true);
            // TODO: Implementar importação real através do backend
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert(`"${game.name}" importado com sucesso!`);
        } catch (error) {
            console.error('Erro ao importar jogo:', error);
            alert('Erro ao importar jogo');
        } finally {
            setLoading(false);
        }
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
                            <GameController weight="duotone" />
                            Integração IGDB
                        </h1>
                        <p className="text-slate-400 mt-2 font-rajdhani text-lg">
                            Busque e importe jogos diretamente da base de dados oficial
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                        <CloudArrowDown className="text-cyan-400" size={24} />
                        <span className="text-sm text-slate-300">
                            Status da API: <span className="text-green-400 font-bold">Online</span>
                        </span>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 shadow-xl backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlass className="text-slate-400" size={20} />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Digite o nome do jogo para buscar..."
                                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-500 transition-all font-rajdhani text-lg"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-orbitron tracking-wider"
                        >
                            {loading ? (
                                <>Buscando...</>
                            ) : (
                                <>
                                    <MagnifyingGlass weight="bold" />
                                    BUSCAR
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                {searchResults.length > 0 ? (
                    <div className="space-y-4 animate-fadeIn">
                        <h2 className="text-2xl font-orbitron text-cyan-400 flex items-center gap-2">
                            Resultados Encontrados
                            <span className="text-sm font-rajdhani text-slate-500 bg-slate-900 px-2 py-1 rounded-full border border-slate-800">
                                {searchResults.length}
                            </span>
                        </h2>
                        
                        <IGDBGameTable 
                            games={searchResults} 
                            onImport={handleImportGame} 
                        />
                    </div>
                ) : (
                    !loading && searchTerm && (
                        <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/50 border-dashed">
                            <GameController size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-xl font-rajdhani">Nenhum jogo encontrado para "{searchTerm}"</p>
                            <p className="text-sm mt-2">Tente buscar por outro nome ou verifique a ortografia.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AdminIGDB;
