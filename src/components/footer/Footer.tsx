import { GithubLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";

function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 py-8">
      <div className="container mx-auto flex flex-col items-center space-y-6 text-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-gaming rounded-lg flex items-center justify-center">
            <span className="font-accent font-bold text-white text-sm">G</span>
          </div>
          <span className="heading-sm text-glow-primary">
            Game<span className="text-primary-400">Store</span>
          </span>
        </div>
        
        {/* Slogan */}
        <p className="body-lg text-accent-400">
          Sua melhor loja de games no Brasil!
        </p>
        
        {/* Direitos autorais */}
        <p className="body-sm text-neutral-400">
          &copy; {new Date().getFullYear()} GameStore. Todos os direitos reservados.
        </p>
        
        {/* Redes Sociais */}
        <p className="label-gaming text-neutral-300">Acesse nossas redes sociais:</p>
        <div className="flex gap-8">
          <a
            href="https://www.linkedin.com/in/felipemacedo1/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-primary-400 transition-all transform hover:scale-110 hover:shadow-glow-sm"
            aria-label="LinkedIn"
          >
            <LinkedinLogo size={32} weight="bold" />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-secondary-400 transition-all transform hover:scale-110 hover:shadow-glow-sm"
            aria-label="Instagram"
          >
            <InstagramLogo size={32} weight="bold" />
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-accent-400 transition-all transform hover:scale-110 hover:shadow-glow-sm"
            aria-label="GitHub"
          >
            <GithubLogo size={32} weight="bold" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
