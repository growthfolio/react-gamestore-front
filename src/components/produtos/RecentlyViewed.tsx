import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, GameController, Star } from '@phosphor-icons/react';
import produtoService, { Produto } from '../../services/produto.service';
import { getProductUrl } from '../../utils/productUrl';

function RecentlyViewed() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      const saved = localStorage.getItem('gamestore_recently_viewed');
      if (!saved) {
        setIsLoading(false);
        return;
      }

      try {
        const ids: number[] = JSON.parse(saved);
        const produtosData: Produto[] = [];
        
        for (const id of ids.slice(0, 6)) {
          try {
            const produto = await produtoService.buscarPorId(id);
            if (produto) produtosData.push(produto);
          } catch {
            // Ignora produtos não encontrados
          }
        }
        
        setProdutos(produtosData);
      } catch {
        setProdutos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, []);

  if (isLoading || produtos.length === 0) return null;

  return (
    <div className="py-8">
      <h2 className="heading-gamer text-xl mb-6 flex items-center gap-3">
        <Clock size={24} className="text-secondary-400" />
        Vistos Recentemente
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            onClick={() => navigate(getProductUrl(produto))}
            className="card-gaming overflow-hidden group cursor-pointer hover:shadow-glow-sm transition-all"
          >
            <div className="relative aspect-[3/4] bg-neutral-800 overflow-hidden">
              {produto.imagens?.[0] ? (
                <img src={produto.imagens[0]} alt={produto.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <GameController size={32} className="text-neutral-600" />
                </div>
              )}
              {produto.desconto && produto.desconto > 0 && (
                <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-accent-500 text-neutral-900 text-xs font-bold rounded">
                  -{produto.desconto}%
                </span>
              )}
            </div>

            <div className="p-2">
              <h3 className="text-xs font-semibold text-neutral-100 line-clamp-1 group-hover:text-primary-400 transition-colors">
                {produto.nome}
              </h3>
              <div className="flex items-center gap-1 my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={8} weight="fill" className="text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-accent-400">
                R$ {produto.desconto ? (produto.preco * (1 - produto.desconto / 100)).toFixed(2) : produto.preco.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentlyViewed;
