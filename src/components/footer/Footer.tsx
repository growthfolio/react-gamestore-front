import React from "react";
import { GithubLogo, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react";

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-100 border-t border-gray-700 py-6">
      <div className="container mx-auto flex flex-col items-center space-y-4 text-center">
        {/* Título */}
        <p className="text-lg font-semibold">
          Sua melhor loja de games no Brasil!
        </p>
        {/* Direitos autorais */}
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Energy Games. Todos os direitos
          reservados.
        </p>
        {/* Redes Sociais */}
        <p className="text-base font-medium">Acesse nossas redes sociais:</p>
        <div className="flex gap-6">
          <a
            href="https://www.linkedin.com/in/felipemacedo1/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-100 hover:text-blue-500 transition-transform transform hover:scale-110"
            aria-label="LinkedIn"
          >
            <LinkedinLogo size={36} weight="bold" />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-100 hover:text-pink-500 transition-transform transform hover:scale-110"
            aria-label="Instagram"
          >
            <InstagramLogo size={36} weight="bold" />
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-100 hover:text-gray-400 transition-transform transform hover:scale-110"
            aria-label="GitHub"
          >
            <GithubLogo size={36} weight="bold" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
