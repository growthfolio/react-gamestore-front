import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RotatingLines } from 'react-loader-spinner';
import './Cadastro.css';

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
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      setErro(error.response?.data?.message || 'Erro ao cadastrar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Criar Conta</h2>
          <p className="text-gray-600 mt-2">Cadastre-se gratuitamente</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Cadastro realizado com sucesso! Redirecionando...
            </div>
          )}

          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
              Nome *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite seu nome completo"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
              Usuário *
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite um nome de usuário"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
              Senha *
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite uma senha (min. 6 caracteres)"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Senha *
            </label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Confirme sua senha"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-2">
              URL da Foto (opcional)
            </label>
            <input
              type="text"
              id="foto"
              name="foto"
              value={formData.foto}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://exemplo.com/foto.jpg"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || sucesso}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span className="ml-2">Cadastrando...</span>
              </>
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
