import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RotatingLines } from 'react-loader-spinner';
import { getErrorMessage, ErrorMessages } from '../../utils/errorHandler';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    usuario: '',
    senha: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErro(''); // Limpa erro ao digitar
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!formData.usuario || !formData.senha) {
      setErro('Preencha todos os campos');
      return;
    }

    try {
      setIsLoading(true);
      await login(formData);

      // Redireciona para a página anterior ou home
      const from = (location.state as any)?.from?.pathname || '/home';
      navigate(from, { replace: true });
    } catch (error: unknown) {
      console.error('Erro ao fazer login:', error);
      setErro(getErrorMessage(error, ErrorMessages.loginFailed));
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
          <h2 className="heading-gamer heading-lg text-glow-primary mb-2">Entrar</h2>
          <p className="body-lg text-neutral-300">Acesse sua conta gamer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {erro && (
            <div className="bg-error-500/10 border border-error-500/30 text-error-400 px-4 py-3 rounded-gaming">
              <span className="body-base">{erro}</span>
            </div>
          )}

          <div>
            <label htmlFor="usuario" className="label-gaming block mb-2">
              Usuário
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="input-gaming w-full"
              placeholder="Digite seu usuário"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="senha" className="label-gaming block mb-2">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="input-gaming w-full"
              placeholder="Digite sua senha"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
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
                <span className="ml-2 cta-gaming">Entrando...</span>
              </>
            ) : (
              <span className="cta-gaming">Entrar</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="body-base text-neutral-400">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
