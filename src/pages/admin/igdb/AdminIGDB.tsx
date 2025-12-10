import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Gamepad2, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import './AdminIGDB.css';

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
    const [selectedGame, setSelectedGame] = useState<IGDBGame | null>(null);

    React.useEffect(() => {
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
                    name: `${searchTerm} - Resultado 1`,
                    summary: 'Este é um jogo incrível com gráficos impressionantes e jogabilidade envolvente.',
                    cover: { url: 'https://via.placeholder.com/264x352' },
                    first_release_date: Date.now() / 1000,
                    platforms: [{ name: 'PlayStation 5' }, { name: 'Xbox Series X' }],
                    genres: [{ name: 'Action' }, { name: 'Adventure' }],
                    rating: 85
                },
                {
                    id: 2,
                    name: `${searchTerm} - Resultado 2`,
                    summary: 'Um RPG épico com história profunda e personagens memoráveis.',
                    cover: { url: 'https://via.placeholder.com/264x352' },
                    first_release_date: Date.now() / 1000,
                    platforms: [{ name: 'PC' }, { name: 'Nintendo Switch' }],
                    genres: [{ name: 'RPG' }],
                    rating: 92
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
            setSelectedGame(null);
        } catch (error) {
            console.error('Erro ao importar jogo:', error);
            alert('Erro ao importar jogo');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp * 1000).toLocaleDateString('pt-BR');
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="admin-igdb-container">
            <div className="admin-igdb-header">
                <Gamepad2 size={32} className="header-icon" />
                <h1>Painel IGDB - Importação de Jogos</h1>
                <p>Busque e importe jogos da base de dados IGDB</p>
            </div>

            {/* Busca */}
            <div className="search-section">
                <div className="search-box">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Digite o nome do jogo..."
                        className="search-input"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="btn-search"
                    >
                        <Search size={20} />
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
            </div>

            {/* Resultados */}
            {searchResults.length > 0 && (
                <div className="results-section">
                    <h2>Resultados da Busca ({searchResults.length})</h2>
                    <div className="results-grid">
                        {searchResults.map(game => (
                            <div
                                key={game.id}
                                className="game-card"
                                onClick={() => setSelectedGame(game)}
                            >
                                <div className="game-cover">
                                    <img
                                        src={game.cover?.url || '/placeholder-game.png'}
                                        alt={game.name}
                                    />
                                </div>
                                <div className="game-info">
                                    <h3>{game.name}</h3>
                                    {game.rating && (
                                        <div className="game-rating">
                                            ⭐ {Math.round(game.rating)}/100
                                        </div>
                                    )}
                                    {game.platforms && (
                                        <div className="game-platforms">
                                            {game.platforms.slice(0, 2).map((p, idx) => (
                                                <span key={idx} className="platform-badge">
                                                    {p.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal de Detalhes */}
            {selectedGame && (
                <div className="modal-overlay" onClick={() => setSelectedGame(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="modal-close"
                            onClick={() => setSelectedGame(null)}
                        >
                            <X size={24} />
                        </button>

                        <div className="modal-body">
                            <div className="modal-cover">
                                <img
                                    src={selectedGame.cover?.url || '/placeholder-game.png'}
                                    alt={selectedGame.name}
                                />
                            </div>

                            <div className="modal-details">
                                <h2>{selectedGame.name}</h2>

                                {selectedGame.rating && (
                                    <div className="detail-rating">
                                        <span className="rating-label">Avaliação IGDB:</span>
                                        <span className="rating-value">
                                            ⭐ {Math.round(selectedGame.rating)}/100
                                        </span>
                                    </div>
                                )}

                                {selectedGame.first_release_date && (
                                    <div className="detail-item">
                                        <span className="detail-label">Lançamento:</span>
                                        <span>{formatDate(selectedGame.first_release_date)}</span>
                                    </div>
                                )}

                                {selectedGame.platforms && selectedGame.platforms.length > 0 && (
                                    <div className="detail-item">
                                        <span className="detail-label">Plataformas:</span>
                                        <div className="detail-tags">
                                            {selectedGame.platforms.map((p, idx) => (
                                                <span key={idx} className="detail-tag">
                                                    {p.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedGame.genres && selectedGame.genres.length > 0 && (
                                    <div className="detail-item">
                                        <span className="detail-label">Gêneros:</span>
                                        <div className="detail-tags">
                                            {selectedGame.genres.map((g, idx) => (
                                                <span key={idx} className="detail-tag">
                                                    {g.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedGame.summary && (
                                    <div className="detail-item">
                                        <span className="detail-label">Descrição:</span>
                                        <p className="detail-summary">{selectedGame.summary}</p>
                                    </div>
                                )}

                                <button
                                    onClick={() => handleImportGame(selectedGame)}
                                    disabled={loading}
                                    className="btn-import"
                                >
                                    <Download size={20} />
                                    {loading ? 'Importando...' : 'Importar para Catálogo'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Estado Vazio */}
            {searchResults.length === 0 && !loading && (
                <div className="empty-state">
                    <Gamepad2 size={64} className="empty-icon" />
                    <h3>Nenhuma busca realizada</h3>
                    <p>Use a barra de busca acima para encontrar jogos no IGDB</p>
                </div>
            )}
        </div>
    );
};

export default AdminIGDB;
