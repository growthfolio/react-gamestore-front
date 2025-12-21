import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import produtoService from '../services/produto.service';

/**
 * Componente para redirecionar URLs antigas (/produtos/:id ou /produto/:id) para novas (/produtos/:slug)
 */
function RedirectOldProductUrl() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const redirectToSlug = async () => {
      if (!id) {
        navigate('/produtos', { replace: true });
        return;
      }

      // Se o parâmetro não é um número, pode ser um slug, então redireciona para a rota correta
      if (isNaN(Number(id))) {
        // Se estamos em /produto/:slug, redireciona para /produtos/:slug
        if (location.pathname.startsWith('/produto/')) {
          navigate(`/produtos/${id}`, { replace: true });
          return;
        }
        // Se já estamos em /produtos/:slug, não faz nada (deixa o React Router lidar)
        return;
      }

      // Se é um número, busca o produto pelo ID e redireciona para o slug
      try {
        const produto = await produtoService.buscarPorId(Number(id));
        if (produto.slug) {
          navigate(`/produtos/${produto.slug}`, { replace: true });
        } else {
          // Se não tem slug, redireciona para lista
          navigate('/produtos', { replace: true });
        }
      } catch (error) {
        console.error('Produto não encontrado:', error);
        navigate('/produtos', { replace: true });
      }
    };

    redirectToSlug();
  }, [id, navigate, location.pathname]);

  // Mostra loading enquanto redireciona
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-neutral-400">Redirecionando...</p>
      </div>
    </div>
  );
}

export default RedirectOldProductUrl;
