import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import produtoService from '../services/produto.service';

/**
 * Componente para redirecionar URLs antigas (/produtos/:id) para novas (/produtos/:slug)
 */
function RedirectOldProductUrl() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToSlug = async () => {
      if (!id || isNaN(Number(id))) {
        navigate('/produtos', { replace: true });
        return;
      }

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
  }, [id, navigate]);

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
