import { Link } from 'react-router-dom';
import { GithubLogo, InstagramLogo, LinkedinLogo, TwitterLogo, Envelope, Phone, MapPin, CreditCard, ShieldCheck, Truck, Headset } from "@phosphor-icons/react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800">
      {/* Features Bar */}
      <div className="border-b border-neutral-800">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/10 rounded-lg">
                <Truck size={24} className="text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-neutral-200 text-sm">Frete Grátis</p>
                <p className="text-xs text-neutral-500">Acima de R$ 199</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent-500/10 rounded-lg">
                <ShieldCheck size={24} className="text-accent-400" />
              </div>
              <div>
                <p className="font-semibold text-neutral-200 text-sm">Compra Segura</p>
                <p className="text-xs text-neutral-500">Ambiente protegido</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary-500/10 rounded-lg">
                <CreditCard size={24} className="text-secondary-400" />
              </div>
              <div>
                <p className="font-semibold text-neutral-200 text-sm">Parcelamento</p>
                <p className="text-xs text-neutral-500">Em até 12x sem juros</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/10 rounded-lg">
                <Headset size={24} className="text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-neutral-200 text-sm">Suporte 24/7</p>
                <p className="text-xs text-neutral-500">Estamos aqui para ajudar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/home" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center">
                <span className="font-accent font-bold text-white">G</span>
              </div>
              <span className="heading-sm text-glow-primary">
                Game<span className="text-primary-400">Store</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-sm mb-4">
              Sua melhor loja de games no Brasil! Encontre os melhores jogos para todas as plataformas.
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/felipemacedo1/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-400 transition-colors" aria-label="LinkedIn">
                <LinkedinLogo size={24} weight="bold" />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-secondary-400 transition-colors" aria-label="Instagram">
                <InstagramLogo size={24} weight="bold" />
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-blue-400 transition-colors" aria-label="Twitter">
                <TwitterLogo size={24} weight="bold" />
              </a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-accent-400 transition-colors" aria-label="GitHub">
                <GithubLogo size={24} weight="bold" />
              </a>
            </div>
          </div>

          {/* Institucional */}
          <div>
            <h3 className="font-semibold text-neutral-100 mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li><Link to="/sobre" className="text-neutral-400 hover:text-primary-400 text-sm transition-colors">Sobre Nós</Link></li>
              <li><Link to="/como-comprar" className="text-neutral-400 hover:text-primary-400 text-sm transition-colors">Como Comprar</Link></li>
              <li><Link to="/politica-privacidade" className="text-neutral-400 hover:text-primary-400 text-sm transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/termos-uso" className="text-neutral-400 hover:text-primary-400 text-sm transition-colors">Termos de Uso</Link></li>
              <li><Link to="/trocas-devolucoes" className="text-neutral-400 hover:text-primary-400 text-sm transition-colors">Trocas e Devoluções</Link></li>
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h3 className="font-semibold text-neutral-100 mb-4">Ajuda</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-neutral-400 hover:text-primary-400 text-sm transition-colors">Perguntas Frequentes</Link></li>
              <li><Link to="/contato" className="text-neutral-400 hover:text-primary-400 text-sm transition-colors">Fale Conosco</Link></li>
              <li><Link to="/pedidos" className="text-neutral-400 hover:text-primary-400 text-sm transition-colors">Meus Pedidos</Link></li>
              <li><Link to="/carrinho" className="text-neutral-400 hover:text-primary-400 text-sm transition-colors">Meu Carrinho</Link></li>
              <li><Link to="/favoritos" className="text-neutral-400 hover:text-primary-400 text-sm transition-colors">Meus Favoritos</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-neutral-100 mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-neutral-400 text-sm">
                <Phone size={18} className="text-primary-400" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2 text-neutral-400 text-sm">
                <Envelope size={18} className="text-primary-400" />
                <span>contato@gamestore.com.br</span>
              </li>
              <li className="flex items-start gap-2 text-neutral-400 text-sm">
                <MapPin size={18} className="text-primary-400 flex-shrink-0 mt-0.5" />
                <span>São Paulo, SP - Brasil</span>
              </li>
            </ul>

            {/* Formas de Pagamento */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-neutral-300 mb-3">Formas de Pagamento</h4>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1.5 bg-neutral-800 rounded text-xs text-neutral-300">Visa</div>
                <div className="px-3 py-1.5 bg-neutral-800 rounded text-xs text-neutral-300">Master</div>
                <div className="px-3 py-1.5 bg-neutral-800 rounded text-xs text-neutral-300">Elo</div>
                <div className="px-3 py-1.5 bg-neutral-800 rounded text-xs text-neutral-300">Pix</div>
                <div className="px-3 py-1.5 bg-neutral-800 rounded text-xs text-neutral-300">Boleto</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-neutral-500 text-sm text-center md:text-left">
              &copy; {currentYear} GameStore. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <ShieldCheck size={16} className="text-accent-400" />
                Site Seguro
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="text-accent-400">🔒</span>
                SSL Certificado
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
