import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Dna } from 'react-loader-spinner';
import { ShoppingCart, Heart, Star, ArrowLeft } from '@phosphor-icons/react';
import { Produto } from '../../models/produtos/Produto';
import produtoService from '../../services/produto.service';
import avaliacaoService, { Avaliacao, MediaAvaliacao } from '../../services/avaliacao.service';
import { useAuth } from '../../contexts/AuthContext';
import { useCarrinho } from '../../contexts/CarrinhoContext';
import { useFavoritos } from '../../contexts/FavoritosContext';
import FormularioAvaliacao from '../../components/avaliacoes/formularioAvaliacao/FormularioAvaliacao';

function DetalheProduto() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { adicionarItem } = useCarrinho();
  const { isFavorito, toggleFavorito } = useFavoritos();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [mediaAvaliacao, setMediaAvaliacao] = useState<MediaAvaliacao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantidade, setQuantidade] = useState(1);
  const [imagemAtual, setImagemAtual] = useState(0);
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    if (id) {
      carregarProduto();
      carregarAvaliacoes();
    }
  }, [id]);

  useEffect(() => {
    if (id && isAuthenticated) {
      setFavorito(isFavorito(Number(id)));
    }
  }, [id, isAuthenticated, isFavorito]);

  async function carregarProduto() {
    try {
      setIsLoading(true);
      const produtoData = await produtoService.buscarPorId(Number(id));
      setProduto(produtoData);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      alert('Erro ao carregar produto');
      navigate('/produtos');
    } finally {
      setIsLoading(false);
    }
  }

  async function carregarAvaliacoes() {
    try {
      const [avaliacoesData, mediaData] = await Promise.all([
        avaliacaoService.listarPorProduto(Number(id)),
        avaliacaoService.buscarMedia(Number(id)),
      ]);
      setAvaliacoes(avaliacoesData);
      setMediaAvaliacao(mediaData);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  }

  async function handleAdicionarCarrinho() {
    if (!isAuthenticated) {
      alert('Faça login para adicionar produtos ao carrinho');
      navigate('/login');
      return;
    }

    try {
      await adicionarItem({
        produtoId: Number(id),
        quantidade,
      });
      alert('Produto adicionado ao carrinho!');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar produto ao carrinho');
    }
  }

  async function handleToggleFavorito() {
    if (!isAuthenticated) {
      alert('Faça login para favoritar produtos');
      navigate('/login');
      return;
    }

    try {
      const novoStatus = await toggleFavorito(Number(id));
      setFavorito(novoStatus);
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      alert('Erro ao favoritar produto');
    }
  }

  const renderStars = (nota: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        weight={i < nota ? 'fill' : 'regular'}
        className={i < nota ? 'text-yellow-400' : 'text-neutral-600'}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-neutral-950">
        <Dna visible={true} height="100" width="100" ariaLabel="Carregando..." />
      </div>
    );
  }

  if (!produto) {
    return (
      <div className="min-h-screen bg-neutral-950 py-12">
        <div className="container mx-auto text-center">
          <p className="text-xl text-neutral-400">Produto não encontrado</p>
          <Link to="/produtos" className="text-primary-400 hover:text-primary-300 mt-4 inline-block">
            Voltar para produtos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4">
      <div className="container mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => navigate('/produtos')}
          className="flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-6 transition-colors"
        >
          <ArrowLeft size={24} weight="bold" />
          Voltar para Produtos
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="card-gaming overflow-hidden aspect-video flex items-center justify-center">
              {produto.imagens && produto.imagens.length > 0 ? (
                <img
                src={produto.imagens[imagemAtual]}
                alt={produto.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-neutral-600 text-6xl">🎮</div>
            )}
          </div>

          {/* Miniaturas */}
          {produto.imagens && produto.imagens.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {produto.imagens.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setImagemAtual(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-colors ${
                    imagemAtual === index ? 'border-primary-500' : 'border-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  <img src={img} alt={`${produto.nome} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações do Produto */}
        <div className="space-y-6">
          <div>
            <h1 className="heading-gamer text-3xl text-neutral-100 mb-2">{produto.nome}</h1>
            
            {/* Avaliação */}
            {mediaAvaliacao && mediaAvaliacao.total > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">{renderStars(Math.round(mediaAvaliacao.media))}</div>
                <span className="text-neutral-400">
                  {mediaAvaliacao.media.toFixed(1)} ({mediaAvaliacao.total} avaliações)
                </span>
              </div>
            )}
          </div>

          {/* Preço */}
          <div className="card-gaming p-4">
            {produto.desconto && produto.desconto > 0 ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500 line-through text-lg">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  <span className="bg-accent-500 text-neutral-950 px-2 py-1 rounded text-sm font-bold">
                    -{produto.desconto}%
                  </span>
                </div>
                <div className="text-3xl font-bold text-accent-500">
                  R$ {(produto.preco * (1 - produto.desconto / 100)).toFixed(2)}
                </div>
              </>
            ) : (
              <div className="text-3xl font-bold text-accent-500">
                R$ {produto.preco.toFixed(2)}
              </div>
            )}
          </div>

          {/* Descrição */}
          <div>
            <h3 className="text-xl font-semibold text-neutral-100 mb-2">Descrição</h3>
            <p className="text-neutral-300 leading-relaxed">{produto.descricao}</p>
          </div>

          {/* Detalhes */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-500">Plataforma:</span>
              <p className="font-semibold text-neutral-200">{produto.plataforma}</p>
            </div>
            <div>
              <span className="text-neutral-500">Desenvolvedor:</span>
              <p className="font-semibold text-neutral-200">{produto.desenvolvedor}</p>
            </div>
            <div>
              <span className="text-neutral-500">Publisher:</span>
              <p className="font-semibold text-neutral-200">{produto.publisher}</p>
            </div>
            <div>
              <span className="text-neutral-500">Estoque:</span>
              <p className="font-semibold text-neutral-200">{produto.estoque} unidades</p>
            </div>
          </div>

          {/* Ações */}
          {produto.ativo && produto.estoque > 0 ? (
            <div className="space-y-4">
              {/* Quantidade */}
              <div className="flex items-center gap-4">
                <label className="text-neutral-300 font-medium">Quantidade:</label>
                <div className="flex items-center border border-neutral-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                    className="px-3 py-2 hover:bg-neutral-800 text-neutral-300 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Math.max(1, Math.min(produto.estoque, Number(e.target.value))))}
                    className="w-16 text-center border-x border-neutral-700 bg-neutral-900 text-neutral-100"
                    min="1"
                    max={produto.estoque}
                  />
                  <button
                    onClick={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))}
                    className="px-3 py-2 hover:bg-neutral-800 text-neutral-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <button
                  onClick={handleAdicionarCarrinho}
                  className="btn-primary flex-1 py-3 px-6 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={24} weight="bold" />
                  Adicionar ao Carrinho
                </button>

                <button
                  onClick={handleToggleFavorito}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    favorito
                      ? 'bg-red-500/10 border-red-500 text-red-500'
                      : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-red-500 hover:text-red-500'
                  }`}
                  title={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart size={24} weight={favorito ? 'fill' : 'regular'} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              Produto indisponível no momento
            </div>
          )}
        </div>
      </div>

      {/* Formulário de Avaliação */}
      <FormularioAvaliacao 
        produtoId={produto.id} 
        onAvaliacaoEnviada={carregarAvaliacoes}
      />

      {/* Avaliações */}
      <div className="mt-12">
        <h2 className="heading-gamer text-2xl text-neutral-100 mb-6">Avaliações dos Clientes</h2>

        {mediaAvaliacao && mediaAvaliacao.total > 0 ? (
          <div className="space-y-6">
            {/* Resumo */}
            <div className="card-gaming p-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-accent-500">{mediaAvaliacao.media.toFixed(1)}</div>
                <div>
                  <div className="flex mb-2">{renderStars(Math.round(mediaAvaliacao.media))}</div>
                  <p className="text-neutral-400">Baseado em {mediaAvaliacao.total} avaliações</p>
                </div>
              </div>
            </div>

            {/* Lista de Avaliações */}
            <div className="space-y-4">
              {avaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} className="card-gaming p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-neutral-100">{avaliacao.usuario.nome}</p>
                      <div className="flex mt-1">{renderStars(avaliacao.nota)}</div>
                    </div>
                    <span className="text-sm text-neutral-500">
                      {new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {avaliacao.comentario && <p className="text-neutral-300 mt-2">{avaliacao.comentario}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-neutral-500 text-center py-8">
            Nenhuma avaliação ainda. Seja o primeiro a avaliar!
          </p>
        )}
      </div>
      </div>
    </div>
  );
}

export default DetalheProduto;
