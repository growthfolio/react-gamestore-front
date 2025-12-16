import { GameController, Users, Trophy, Heart } from '@phosphor-icons/react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

function Sobre() {
  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Breadcrumbs items={[{ label: 'Sobre Nós' }]} />

        <div className="text-center mb-12">
          <h1 className="heading-gamer text-3xl md:text-4xl mb-4">Sobre a GameStore</h1>
          <p className="text-neutral-400 text-lg">Sua melhor loja de games no Brasil</p>
        </div>

        <div className="card-gaming p-8 mb-8">
          <h2 className="heading-lg text-primary-400 mb-4">Nossa História</h2>
          <p className="text-neutral-300 leading-relaxed mb-4">
            A GameStore nasceu da paixão por jogos e da vontade de oferecer a melhor experiência de compra para gamers de todo o Brasil. 
            Desde nossa fundação, trabalhamos incansavelmente para trazer os melhores títulos, preços competitivos e um atendimento excepcional.
          </p>
          <p className="text-neutral-300 leading-relaxed">
            Acreditamos que jogos são mais do que entretenimento - são experiências que conectam pessoas, contam histórias e criam memórias. 
            Por isso, nos dedicamos a ser mais do que uma loja: somos parte da comunidade gamer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card-gaming p-6 text-center">
            <GameController size={48} className="mx-auto mb-4 text-primary-400" />
            <h3 className="heading-sm text-accent-400 mb-2">500+</h3>
            <p className="text-neutral-400">Jogos Disponíveis</p>
          </div>
          <div className="card-gaming p-6 text-center">
            <Users size={48} className="mx-auto mb-4 text-secondary-400" />
            <h3 className="heading-sm text-accent-400 mb-2">50K+</h3>
            <p className="text-neutral-400">Clientes Satisfeitos</p>
          </div>
          <div className="card-gaming p-6 text-center">
            <Trophy size={48} className="mx-auto mb-4 text-accent-400" />
            <h3 className="heading-sm text-accent-400 mb-2">5 Anos</h3>
            <p className="text-neutral-400">No Mercado</p>
          </div>
          <div className="card-gaming p-6 text-center">
            <Heart size={48} className="mx-auto mb-4 text-error-500" />
            <h3 className="heading-sm text-accent-400 mb-2">98%</h3>
            <p className="text-neutral-400">Satisfação</p>
          </div>
        </div>

        <div className="card-gaming p-8">
          <h2 className="heading-lg text-primary-400 mb-4">Nossos Valores</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-neutral-100 mb-1">🎮 Paixão por Games</h3>
              <p className="text-neutral-400">Somos gamers e entendemos o que você procura.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-100 mb-1">🛡️ Confiança</h3>
              <p className="text-neutral-400">Todos os nossos produtos são 100% originais e garantidos.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-100 mb-1">⚡ Agilidade</h3>
              <p className="text-neutral-400">Entrega rápida e suporte ágil para você jogar o quanto antes.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-100 mb-1">💚 Comunidade</h3>
              <p className="text-neutral-400">Fazemos parte da comunidade gamer e apoiamos o cenário nacional.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sobre;
