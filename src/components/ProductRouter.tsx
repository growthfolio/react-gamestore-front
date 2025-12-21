import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DetalheProduto from '../../pages/detalheProduto/DetalheProduto';
import RedirectOldProductUrl from '../RedirectOldProductUrl';

/**
 * Componente que decide se deve mostrar o produto ou redirecionar baseado no parâmetro
 */
function ProductRouter() {
  const { slugOrId } = useParams<{ slugOrId: string }>();

  // Se o parâmetro é um número, é um ID antigo - redireciona
  if (slugOrId && !isNaN(Number(slugOrId))) {
    return <RedirectOldProductUrl />;
  }

  // Se não é um número, é um slug - mostra o produto
  return <DetalheProduto />;
}

export default ProductRouter;
