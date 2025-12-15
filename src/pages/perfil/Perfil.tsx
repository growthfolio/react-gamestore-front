import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { UserCircle, PencilSimple, FloppyDisk, X, Package, ArrowRight, Eye, EyeSlash } from '@phosphor-icons/react';

const Perfil: React.FC = () => {
  const { usuario, isAdmin, atualizarUsuario } = useAuth();
  const { success, error } = useToast();
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
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-neutral-400">Usuário não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-neutral-900 border border-neutral-800 rounded-gaming p-8 shadow-card-gaming">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-gaming rounded-full flex items-center justify-center">
                <UserCircle size={32} className="text-white" />
              </div>
              <div>
                <h1 className="heading-lg text-glow-primary">Meu Perfil</h1>
                {isAdmin && (
                  <span className="inline-block bg-secondary-500 text-neutral-900 px-3 py-1 rounded-full text-xs font-bold mt-2">
                    ADMINISTRADOR
                  </span>
                )}
              </div>
            </div>
            
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <PencilSimple size={16} />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  <FloppyDisk size={16} />
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="btn-outline flex items-center gap-2"
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Nickname
              </label>
              {editMode ? (
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-gaming text-white focus:border-primary-500 focus:outline-none"
                />
              ) : (
                <p className="text-white bg-neutral-800 px-4 py-3 rounded-gaming">
                  {usuario.nickname}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Email
              </label>
              {editMode ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-gaming text-white focus:border-primary-500 focus:outline-none"
                />
              ) : (
                <p className="text-white bg-neutral-800 px-4 py-3 rounded-gaming">
                  {usuario.email}
                </p>
              )}
            </div>

            {editMode && (
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Senha (obrigatória para confirmar alterações)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    placeholder="Digite sua senha"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-gaming text-white focus:border-primary-500 focus:outline-none pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Mínimo 8 caracteres, com maiúscula, minúscula e número
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                ID do Usuário
              </label>
              <p className="text-neutral-400 bg-neutral-800 px-4 py-3 rounded-gaming">
                #{usuario.id}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Tipo de Conta
              </label>
              <p className="text-white bg-neutral-800 px-4 py-3 rounded-gaming">
                {isAdmin ? 'Administrador' : 'Usuário Comum'}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-800">
            <h2 className="heading-md text-accent-400 mb-4 flex items-center gap-2">
              <Package size={24} />
              Meus Pedidos
            </h2>
            <Link
              to="/pedidos"
              className="block p-4 bg-neutral-800 hover:bg-neutral-700 rounded-gaming transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">Ver Histórico de Pedidos</h3>
                  <p className="text-sm text-neutral-400">Acompanhe o status das suas compras</p>
                </div>
                <ArrowRight size={20} className="text-accent-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {isAdmin && (
            <div className="mt-8 pt-8 border-t border-neutral-800">
              <h2 className="heading-md text-secondary-400 mb-4">Acesso Administrativo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/cadastrarProduto"
                  className="block p-4 bg-neutral-800 hover:bg-neutral-700 rounded-gaming transition-colors"
                >
                  <h3 className="font-semibold text-white mb-1">Cadastrar Produto</h3>
                  <p className="text-sm text-neutral-400">Adicionar novos jogos</p>
                </a>
                <a
                  href="/categorias"
                  className="block p-4 bg-neutral-800 hover:bg-neutral-700 rounded-gaming transition-colors"
                >
                  <h3 className="font-semibold text-white mb-1">Gerenciar Categorias</h3>
                  <p className="text-sm text-neutral-400">Organizar produtos</p>
                </a>
                <a
                  href="/admin/igdb"
                  className="block p-4 bg-neutral-800 hover:bg-neutral-700 rounded-gaming transition-colors"
                >
                  <h3 className="font-semibold text-white mb-1">Sincronizar IGDB</h3>
                  <p className="text-sm text-neutral-400">Importar jogos</p>
                </a>
                <a
                  href="/produtos"
                  className="block p-4 bg-neutral-800 hover:bg-neutral-700 rounded-gaming transition-colors"
                >
                  <h3 className="font-semibold text-white mb-1">Gerenciar Produtos</h3>
                  <p className="text-sm text-neutral-400">Editar/excluir jogos</p>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
