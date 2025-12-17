import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import perfilService, { PerfilStats, ConquistaDTO } from '../../services/perfil.service';
import { 
  UserCircle, PencilSimple, FloppyDisk, X, Package, ArrowRight, Eye, EyeSlash,
  Heart, ShoppingCart, GameController, Trophy, Star, Shield, Gear,
  Medal, TrendUp, Fire, Crown
} from '@phosphor-icons/react';

const nivelCores: Record<string, { bg: string; text: string; glow: string }> = {
  BRONZE: { bg: 'from-amber-700 to-amber-900', text: 'text-amber-400', glow: 'shadow-amber-500/30' },
  PRATA: { bg: 'from-gray-400 to-gray-600', text: 'text-gray-300', glow: 'shadow-gray-400/30' },
  OURO: { bg: 'from-yellow-500 to-yellow-700', text: 'text-yellow-400', glow: 'shadow-yellow-500/30' },
  PLATINA: { bg: 'from-cyan-400 to-cyan-600', text: 'text-cyan-400', glow: 'shadow-cyan-500/30' },
  DIAMANTE: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-400', glow: 'shadow-purple-500/30' },
};

const Perfil = () => {
  const { usuario, isAdmin, atualizarUsuario } = useAuth();
  const { success, error } = useToast();
  const [stats, setStats] = useState<PerfilStats | null>(null);
  const [_loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nickname: usuario?.nickname || '',
    email: usuario?.email || '',
    senha: ''
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await perfilService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nickname.trim() || !formData.email.trim() || !formData.senha.trim()) {
      error('Erro', 'Preencha todos os campos');
      return;
    }
    try {
      setSaving(true);
      await atualizarUsuario(usuario!.id, formData);
      success('Perfil atualizado!', 'Suas informações foram salvas.');
      setFormData(prev => ({ ...prev, senha: '' }));
      setEditMode(false);
    } catch (err) {
      error('Erro ao salvar', 'Não foi possível atualizar o perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <UserCircle size={64} className="mx-auto text-neutral-600 mb-4" />
          <p className="text-neutral-400">Faça login para ver seu perfil</p>
          <Link to="/login" className="btn-primary mt-4 inline-block">Fazer Login</Link>
        </div>
      </div>
    );
  }

  const nivelNome = stats?.nivel?.nome?.toUpperCase() || 'BRONZE';
  const cores = nivelCores[nivelNome] || nivelCores.BRONZE;

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header com Avatar e Nível */}
        <div className="card-gaming p-6 mb-6 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-r ${cores.bg} opacity-10`} />
          
          <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-32 h-32 bg-gradient-to-br ${cores.bg} rounded-full p-1 shadow-lg ${cores.glow}`}>
                <div className="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center">
                  {usuario.foto ? (
                    <img src={usuario.foto} alt={usuario.nickname} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className={`text-5xl font-bold ${cores.text}`}>
                      {usuario.nickname?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              {isAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-secondary-500 rounded-full p-2">
                  <Shield size={18} className="text-white" weight="fill" />
                </div>
              )}
            </div>

            {/* Info Principal */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-2">
                <h1 className="heading-gamer text-3xl text-neutral-100">{usuario.nickname}</h1>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  {isAdmin && (
                    <span className="bg-secondary-500 text-white px-3 py-0.5 rounded-full text-xs font-bold">ADMIN</span>
                  )}
                  <span className={`bg-gradient-to-r ${cores.bg} text-white px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1`}>
                    <Crown size={12} weight="fill" />
                    {stats?.nivel?.nome || 'Bronze'}
                  </span>
                </div>
              </div>
              <p className="text-neutral-400 mb-3">{usuario.email}</p>
              
              {/* Barra de Progresso do Nível */}
              {stats && stats.nivel !== stats.proximoNivel && (
                <div className="max-w-md mx-auto lg:mx-0">
                  <div className="flex justify-between text-xs text-neutral-500 mb-1">
                    <span>{stats.nivel?.nome}</span>
                    <span>{stats.proximoNivel?.nome}</span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${cores.bg} transition-all duration-500`}
                      style={{ width: `${stats.progressoNivel}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    {stats.comprasParaProximoNivel} compras para {stats.proximoNivel?.nome}
                  </p>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-2">
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="btn-outline px-4 py-2 flex items-center gap-2 text-sm">
                  <PencilSimple size={16} /> Editar
                </button>
              ) : (
                <>
                  <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 flex items-center gap-2 text-sm">
                    <FloppyDisk size={16} /> {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button onClick={() => setEditMode(false)} className="btn-outline px-3 py-2"><X size={16} /></button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard icon={ShoppingCart} label="Compras" value={stats?.totalCompras || 0} color="text-primary-400" bg="bg-primary-500/10" />
          <StatCard icon={Star} label="Avaliações" value={stats?.totalAvaliacoes || 0} color="text-yellow-400" bg="bg-yellow-500/10" />
          <StatCard icon={Heart} label="Favoritos" value={stats?.totalFavoritos || 0} color="text-red-400" bg="bg-red-500/10" />
          <StatCard icon={Trophy} label="Conquistas" value={`${stats?.totalConquistas || 0}/${stats?.conquistas?.length || 0}`} color="text-accent-400" bg="bg-accent-500/10" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Conquistas */}
            <div className="card-gaming p-6">
              <h2 className="heading-sm text-neutral-100 mb-4 flex items-center gap-2">
                <Medal size={20} className="text-accent-400" /> Conquistas
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stats?.conquistas?.map((c) => (
                  <ConquistaCard key={c.codigo} conquista={c} />
                ))}
              </div>
            </div>

            {/* Gêneros Favoritos */}
            {stats?.generosFavoritos && stats.generosFavoritos.length > 0 && (
              <div className="card-gaming p-6">
                <h2 className="heading-sm text-neutral-100 mb-4 flex items-center gap-2">
                  <Fire size={20} className="text-orange-400" /> Gêneros Favoritos
                </h2>
                <div className="space-y-3">
                  {stats.generosFavoritos.map((g, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-neutral-300">{g.nome}</span>
                        <span className="text-neutral-500">{g.quantidade} jogos ({g.percentual}%)</span>
                      </div>
                      <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: `${g.percentual}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formulário de Edição */}
            {editMode && (
              <div className="card-gaming p-6">
                <h2 className="heading-sm text-neutral-100 mb-4 flex items-center gap-2">
                  <Gear size={20} className="text-primary-400" /> Editar Perfil
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Nickname</label>
                    <input type="text" value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} className="input-gaming w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-gaming w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-1">Senha (para confirmar)</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={formData.senha} onChange={(e) => setFormData({ ...formData, senha: e.target.value })} placeholder="Digite sua senha" className="input-gaming w-full pr-12" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white">
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {/* Últimas Compras */}
            <div className="card-gaming p-6">
              <h2 className="heading-sm text-neutral-100 mb-4 flex items-center gap-2">
                <Package size={20} className="text-accent-400" /> Últimas Compras
              </h2>
              {stats?.ultimasCompras && stats.ultimasCompras.length > 0 ? (
                <div className="space-y-3">
                  {stats.ultimasCompras.map((c) => (
                    <div key={c.pedidoId} className="flex items-center gap-3 p-2 bg-neutral-800/50 rounded-lg">
                      <div className="w-12 h-12 bg-neutral-700 rounded overflow-hidden flex-shrink-0">
                        {c.produtoImagem ? (
                          <img src={c.produtoImagem} alt={c.produtoNome} className="w-full h-full object-cover" />
                        ) : (
                          <GameController size={24} className="w-full h-full p-2 text-neutral-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-200 truncate">{c.produtoNome}</p>
                        <p className="text-xs text-neutral-500">{new Date(c.data).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <span className="text-sm text-accent-400 font-bold">R$ {c.valor.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 text-sm text-center py-4">Nenhuma compra ainda</p>
              )}
              <Link to="/pedidos" className="block mt-4 text-center text-sm text-primary-400 hover:text-primary-300">
                Ver histórico completo <ArrowRight size={14} className="inline" />
              </Link>
            </div>

            {/* Links Rápidos */}
            <div className="card-gaming p-6">
              <h2 className="heading-sm text-neutral-100 mb-4">Acesso Rápido</h2>
              <div className="space-y-2">
                <QuickLink to="/favoritos" icon={Heart} label="Meus Favoritos" count={stats?.totalFavoritos} color="text-red-400" />
                <QuickLink to="/carrinho" icon={ShoppingCart} label="Meu Carrinho" count={stats?.totalItensCarrinho} color="text-primary-400" />
                <QuickLink to="/produtos" icon={GameController} label="Explorar Jogos" color="text-secondary-400" />
              </div>
            </div>

            {/* Admin Panel */}
            {isAdmin && (
              <div className="card-gaming p-6 border-secondary-500/30">
                <h2 className="heading-sm text-secondary-400 mb-4 flex items-center gap-2">
                  <Shield size={20} weight="fill" /> Painel Admin
                </h2>
                <div className="space-y-2">
                  <AdminLink to="/admin/igdb" emoji="🎮" label="Importar IGDB" />
                  <AdminLink to="/cadastrarProduto" emoji="➕" label="Cadastrar Produto" />
                  <AdminLink to="/categorias" emoji="📁" label="Categorias" />
                  <AdminLink to="/admin/produtos" emoji="📦" label="Gerenciar Produtos" />
                </div>
              </div>
            )}

            {/* Total Gasto */}
            {stats && stats.totalGasto > 0 && (
              <div className="card-gaming p-6 bg-gradient-to-br from-accent-500/10 to-transparent">
                <div className="flex items-center gap-3">
                  <TrendUp size={32} className="text-accent-400" />
                  <div>
                    <p className="text-xs text-neutral-500">Total investido em games</p>
                    <p className="text-2xl font-bold text-accent-400">R$ {stats.totalGasto.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares
const StatCard = ({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: number | string; color: string; bg: string }) => (
  <div className="card-gaming p-4 text-center hover:border-primary-500/50 transition-colors">
    <div className={`inline-flex p-3 rounded-full ${bg} mb-2`}>
      <Icon size={24} className={color} weight="fill" />
    </div>
    <p className="text-2xl font-bold text-neutral-100">{value}</p>
    <p className="text-xs text-neutral-500">{label}</p>
  </div>
);

const ConquistaCard = ({ conquista }: { conquista: ConquistaDTO }) => (
  <div className={`p-3 rounded-lg border transition-all ${conquista.desbloqueada ? 'bg-accent-500/10 border-accent-500/30' : 'bg-neutral-800/50 border-neutral-700 opacity-50'}`}>
    <div className="text-2xl mb-1">{conquista.icone}</div>
    <p className={`text-sm font-semibold ${conquista.desbloqueada ? 'text-accent-400' : 'text-neutral-500'}`}>{conquista.nome}</p>
    <p className="text-xs text-neutral-500 line-clamp-1">{conquista.descricao}</p>
    {!conquista.desbloqueada && (
      <div className="mt-2">
        <div className="h-1 bg-neutral-700 rounded-full overflow-hidden">
          <div className="h-full bg-neutral-500" style={{ width: `${(conquista.progresso / conquista.meta) * 100}%` }} />
        </div>
        <p className="text-xs text-neutral-600 mt-1">{conquista.progresso}/{conquista.meta}</p>
      </div>
    )}
  </div>
);

const QuickLink = ({ to, icon: Icon, label, count, color }: { to: string; icon: any; label: string; count?: number; color: string }) => (
  <Link to={to} className="flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-gaming transition-colors group">
    <Icon size={18} className={color} />
    <span className="text-neutral-300 group-hover:text-white transition-colors">{label}</span>
    {count !== undefined && <span className="ml-auto text-xs bg-neutral-700 px-2 py-0.5 rounded-full">{count}</span>}
  </Link>
);

const AdminLink = ({ to, emoji, label }: { to: string; emoji: string; label: string }) => (
  <Link to={to} className="flex items-center gap-3 p-3 bg-secondary-500/10 hover:bg-secondary-500/20 rounded-gaming transition-colors text-secondary-300 hover:text-secondary-200">
    <span>{emoji}</span>
    <span>{label}</span>
  </Link>
);

export default Perfil;
