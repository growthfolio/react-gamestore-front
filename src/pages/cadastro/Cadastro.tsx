import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RotatingLines } from 'react-loader-spinner';
import { getErrorMessage } from '../../utils/errorHandler';

function Cadastro() {
  const navigate = useNavigate();
  const { cadastrar } = useAuth();

  const [formData, setFormData] = useState({
    nome: '',
    usuario: '',
    senha: '',
    confirmarSenha: '',
    foto: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErro('');
  };

  const validarFormulario = (): boolean => {
    if (!formData.nome || !formData.usuario || !formData.senha) {
      setErro('Preencha todos os campos obrigatórios');
      return false;
    }

    if (formData.nome.length < 3) {
      setErro('Nome deve ter pelo menos 3 caracteres');
      return false;
    }

    if (formData.usuario.length < 3) {
      setErro('Usuário deve ter pelo menos 3 caracteres');
      return false;
    }

    if (formData.senha.length < 6) {
      setErro('Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!validarFormulario()) return;

    try {
      setIsLoading(true);
      await cadastrar({
        nome: formData.nome,
        usuario: formData.usuario,
        senha: formData.senha,
        foto: formData.foto || undefined,
      });

      setSucesso(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: unknown) {
      console.error('Erro ao cadastrar:', error);
      setErro(getErrorMessage(error, 'Erro ao cadastrar usuário'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-neutral-950 py-12 px-4">
      <div className="max-w-md w-full card-gaming p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-gaming rounded-lg flex items-center justify-center">
              <span className="font-accent font-bold text-white">G</span>
            </div>
          </div>
          <h2 className="heading-gamer heading-lg text-glow-primary mb-2">Criar Conta</h2>
          <p className="body-lg text-neutral-300">Junte-se à comunidade gamer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {erro && (
            <div className="bg-error-500/10 border border-error-500/30 text-error-400 px-4 py-3 rounded-gaming">
              <span className="body-base">{erro}</span>
            </div>
          )}

          {sucesso && (
            <div className="bg-success-500/10 border border-success-500/30 text-success-400 px-4 py-3 rounded-gaming">
              <span className="body-base">Cadastro realizado com sucesso! Redirecionando...</span>
            </div>
          )}

          <div>
            <label htmlFor="nome" className="label-gaming block mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="input-gaming w-full"
              placeholder="Digite seu nome completo"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="usuario" className="label-gaming block mb-2">
              Nome de Usuário *
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="input-gaming w-full"
              placeholder="Digite um nome de usuário único"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="senha" className="label-gaming block mb-2">
              Senha *
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="input-gaming w-full"
              placeholder="Mínimo 6 caracteres"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="label-gaming block mb-2">
              Confirmar Senha *
            </label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className="input-gaming w-full"
              placeholder="Digite a senha novamente"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="foto" className="label-gaming block mb-2">
              Avatar (Opcional)
            </label>
            <input
              type="text"
              id="foto"
              name="foto"
              value={formData.foto}
              onChange={handleChange}
              className="input-gaming w-full"
              placeholder="https://exemplo.com/avatar.jpg"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || sucesso}
            className="btn-primary w-full py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RotatingLines
                  strokeColor="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="24"
                  visible={true}
                />
                <span className="ml-2 cta-gaming">Cadastrando...</span>
              </>
            ) : (
              <span className="cta-gaming">Criar Conta</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="body-base text-neutral-400">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
