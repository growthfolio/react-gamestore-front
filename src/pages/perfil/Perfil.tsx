import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useFavoritos } from '../../contexts/FavoritosContext';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { 
  UserCircle, PencilSimple, FloppyDisk, X, Package, ArrowRight, Eye, EyeSlash,
  Heart, ShoppingCart, GameController, Trophy, Star, Calendar, Shield, Gear
} from '@phosphor-icons/react';

const Perfil: React.FC = () => {
  const { usuario, isAdmin, atualizarUsuario } = useAuth();
  const { success, error } = useToast();
  const { totalFavoritos } = useFavoritos();
  const { totalItens } = useCarrinho();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nickname: usuario?.nickname || '',
    email: usuario?.email || '',
    senha: ''
  });

  const handleSave = async () => {
    if (!formData.nickname.trim()) {
      error('Erro', 'Nickname é obrigatório');
      return;
    }
    if (!formData.email.trim()) {
      error('Erro', 'Email é obrigatório');
      return;
    }
    if (!formData.senha.trim()) {
      error('Erro', 'Senha é obrigatória para confirmar as alterações');
      return;
    }
    if (formData.senha.length < 8) {
      error('Erro', 'Senha deve ter pelo menos 8 caracteres');
      return;
    }

    try {
      setLoading(true);
      await atualizarUsuario(usuario!.id, {
        nickname: formData.nickname,
        email: formData.email,
        senha: formData.senha
      });
      
      success('Perfil atualizado!', 'Suas informações foram salvas com sucesso.');
      setFormData(prev => ({ ...prev, senha: '' }));
      setEditMode(false);
    } catch (err: unknown) {
      console.error('Erro ao atualizar perfil:', err);
      const errorMessage = err instanceof Error ? err.message : 'Não foi possível atualizar o perfil.';
      error('Erro ao salvar', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nickname: usuario?.nickname || '',
      email: usuario?.email || '',
      senha: ''
    });
    setEditMode(false);
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <UserCircle size={64} className="mx-auto text-neutral-600 mb-4" />
          <p className="text-neutral-400">Usuário não encontrado</p>
          <Link to="/login" className="btn-primary mt-4 inline-block">Fazer Login</Link>
        </div>
      </div>
    );
  }

  const stats = [
    { icon: Heart, label: 'Favoritos', value: totalFavoritos, color: 'text-red-400', bg: 'bg-red-500/10' },
    { icon: ShoppingCart, label: 'No Carrinho', value: totalItens, color: 'text-primary-400', bg: 'bg-primary-500/10' },
    { icon: Trophy, label: 'Nível', value: 'Gamer', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: Star, label: 'Avaliações', value: 0, color: 'text-accent-400', bg: 'bg-accent-500/10' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header com Avatar e Info Principal */}
        <div className="card-gaming p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 rounded-full p-1">
                <div className="w-full h-full bg-neutral-900 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary-400">
                    {usuario.nickname?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              {isAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-secondary-500 rounded-full p-1.5">
                  <Shield size={16} className="text-white" weight="fill" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h1 className="heading-gamer text-2xl text-neutral-100">{usuario.nickname}</h1>
                {isAdmin && (
                  <span className="inline-block bg-secondary-500 text-white px-3 py-0.5 rounded-full text-xs font-bold">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-neutral-400 mb-3">{usuario.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Membro desde 2024
                </span>
                <span className="flex items-center gap-1">
                  <GameController size={14} />
                  ID: #{usuario.id}
                </span>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="btn-outline px-4 py-2 flex items-center gap-2 text-sm">
                  <PencilSimple size={16} />
                  Editar Perfil
                </button>
              ) : (
                <>
                  <button onClick={handleSave} disabled={loading} className="btn-primary px-4 py-2 flex items-center gap-2 text-sm disabled:opacity-50">
                    <FloppyDisk size={16} />
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button onClick={handleCancel} disabled={loading} className="btn-outline px-4 py-2 flex items-center gap-2 text-sm">
                    <X size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="card-gaming p-4 text-center hover:border-primary-500/50 transition-colors">
              <div className={`inline-flex p-3 rounded-full ${stat.bg} mb-2`}>
                <stat.icon size={24} className={stat.color} weight="fill" />
              </div>
              <p className="text-2xl font-bold text-neutral-100">{stat.value}</p>
              <p className="text-xs text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal - Dados do Perfil */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulário de Edição */}
            <div className="card-gaming p-6">
              <h2 className="heading-sm text-neutral-100 mb-4 flex items-center gap-2">
                <Gear size={20} className="text-primary-400" />
                Informações da Conta
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1.5">Nickname</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      className="input-gaming w-full"
                    />
                  ) : (
                    <p className="text-neutral-100 bg-neutral-800/50 px-4 py-3 rounded-gaming">{usuario.nickname}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-400 mb-1.5">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-gaming w-full"
                    />
                  ) : (
                    <p className="text-neutral-100 bg-neutral-800/50 px-4 py-3 rounded-gaming">{usuario.email}</p>
                  )}
                </div>

                {editMode && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1.5">
                      Senha <span className="text-neutral-500">(para confirmar alterações)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.senha}
                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                        placeholder="Digite sua senha"
                        className="input-gaming w-full pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">Mínimo 8 caracteres</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1.5">ID do Usuário</label>
                    <p className="text-neutral-500 bg-neutral-800/50 px-4 py-3 rounded-gaming">#{usuario.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-1.5">Tipo de Conta</label>
                    <p className="text-neutral-100 bg-neutral-800/50 px-4 py-3 rounded-gaming">
                      {isAdmin ? '👑 Administrador' : '🎮 Gamer'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Lateral - Links Rápidos */}
          <div className="space-y-6">
            {/* Meus Pedidos */}
            <div className="card-gaming p-6">
              <h2 className="heading-sm text-neutral-100 mb-4 flex items-center gap-2">
                <Package size={20} className="text-accent-400" />
                Meus Pedidos
              </h2>
              <Link
                to="/pedidos"
                className="block p-4 bg-neutral-800/50 hover:bg-neutral-800 rounded-gaming transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-neutral-100 mb-1">Ver Histórico</h3>
                    <p className="text-sm text-neutral-500">Acompanhe suas compras</p>
                  </div>
                  <ArrowRight size={20} className="text-accent-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Links Rápidos */}
            <div className="card-gaming p-6">
              <h2 className="heading-sm text-neutral-100 mb-4">Acesso Rápido</h2>
              <div className="space-y-2">
                <Link to="/favoritos" className="flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-gaming transition-colors group">
                  <Heart size={18} className="text-red-400" />
                  <span className="text-neutral-300 group-hover:text-white transition-colors">Meus Favoritos</span>
                  <span className="ml-auto text-xs bg-neutral-700 px-2 py-0.5 rounded-full">{totalFavoritos}</span>
                </Link>
                <Link to="/carrinho" className="flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-gaming transition-colors group">
                  <ShoppingCart size={18} className="text-primary-400" />
                  <span className="text-neutral-300 group-hover:text-white transition-colors">Meu Carrinho</span>
                  <span className="ml-auto text-xs bg-neutral-700 px-2 py-0.5 rounded-full">{totalItens}</span>
                </Link>
                <Link to="/produtos" className="flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-gaming transition-colors group">
                  <GameController size={18} className="text-secondary-400" />
                  <span className="text-neutral-300 group-hover:text-white transition-colors">Explorar Jogos</span>
                </Link>
              </div>
            </div>

            {/* Admin Panel */}
            {isAdmin && (
              <div className="card-gaming p-6 border-secondary-500/30">
                <h2 className="heading-sm text-secondary-400 mb-4 flex items-center gap-2">
                  <Shield size={20} weight="fill" />
                  Painel Admin
                </h2>
                <div className="space-y-2">
                  <Link to="/admin/igdb" className="flex items-center gap-3 p-3 bg-secondary-500/10 hover:bg-secondary-500/20 rounded-gaming transition-colors text-secondary-300 hover:text-secondary-200">
                    <span>🎮</span>
                    <span>Importar IGDB</span>
                  </Link>
                  <Link to="/cadastrarProduto" className="flex items-center gap-3 p-3 bg-secondary-500/10 hover:bg-secondary-500/20 rounded-gaming transition-colors text-secondary-300 hover:text-secondary-200">
                    <span>➕</span>
                    <span>Cadastrar Produto</span>
                  </Link>
                  <Link to="/categorias" className="flex items-center gap-3 p-3 bg-secondary-500/10 hover:bg-secondary-500/20 rounded-gaming transition-colors text-secondary-300 hover:text-secondary-200">
                    <span>📁</span>
                    <span>Categorias</span>
                  </Link>
                  <Link to="/admin/produtos" className="flex items-center gap-3 p-3 bg-secondary-500/10 hover:bg-secondary-500/20 rounded-gaming transition-colors text-secondary-300 hover:text-secondary-200">
                    <span>📦</span>
                    <span>Gerenciar Produtos</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
