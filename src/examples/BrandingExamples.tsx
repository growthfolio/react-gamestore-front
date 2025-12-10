// 🎨 EXEMPLOS DE APLICAÇÃO DO NOVO BRANDING
import React from 'react';

// 🎮 BOTÕES COM NOVA IDENTIDADE
export const GameButtons = () => {
  return (
    <div className="space-y-4 p-6 bg-neutral-900">
      <button className="px-6 py-3 bg-gradient-gaming text-white font-gaming font-semibold rounded-gaming shadow-glow-md hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105">
        Comprar Jogo
      </button>
      
      <button className="px-6 py-3 bg-accent-500 text-neutral-900 font-gaming font-semibold rounded-gaming shadow-glow-neon hover:bg-accent-400 transition-all duration-300">
        Adicionar ao Carrinho
      </button>
      
      <button className="px-6 py-3 border-2 border-primary-500 text-primary-500 font-gaming font-semibold rounded-gaming hover:bg-primary-500 hover:text-white hover:shadow-glow-sm transition-all duration-300">
        Ver Detalhes
      </button>
    </div>
  );
};

// 🃏 CARD DE JOGO MODERNO
export const GameCard = () => {
  return (
    <div className="bg-gradient-card rounded-card p-6 shadow-card-gaming border border-neutral-800 hover:border-primary-500 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 bg-accent-500 text-neutral-900 text-xs font-gaming font-bold rounded-full">
          NOVO
        </span>
        <span className="text-primary-400 font-accent text-sm">
          R$ 89,90
        </span>
      </div>
      
      <h3 className="text-xl font-gaming font-bold text-neutral-0 mb-2 group-hover:text-primary-400 transition-colors">
        Cyberpunk 2077
      </h3>
      
      <p className="text-neutral-400 text-sm mb-4">
        Jogo de RPG futurista em mundo aberto com elementos cyberpunk.
      </p>
      
      <div className="flex gap-2 mb-4">
        <span className="px-2 py-1 bg-secondary-900 text-secondary-300 text-xs rounded">
          RPG
        </span>
        <span className="px-2 py-1 bg-primary-900 text-primary-300 text-xs rounded">
          PC
        </span>
      </div>
      
      <button className="w-full py-2 bg-primary-600 hover:bg-primary-500 text-white font-gaming font-semibold rounded-button transition-all duration-300 hover:shadow-glow-sm">
        Comprar Agora
      </button>
    </div>
  );
};

// 🎯 NAVBAR GAMING
export const GamingNavbar = () => {
  return (
    <nav className="bg-neutral-950 border-b border-neutral-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-gaming rounded-lg flex items-center justify-center">
            <span className="text-white font-accent font-bold text-sm">G</span>
          </div>
          <span className="text-xl font-gaming font-bold text-white">
            Game<span className="text-primary-400">Store</span>
          </span>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <a href="#" className="text-neutral-300 hover:text-primary-400 font-gaming transition-colors">
            Jogos
          </a>
          <a href="#" className="text-neutral-300 hover:text-accent-400 font-gaming transition-colors">
            Categorias
          </a>
          <a href="#" className="text-neutral-300 hover:text-secondary-400 font-gaming transition-colors">
            Ofertas
          </a>
        </div>
        
        <button className="px-4 py-2 bg-accent-500 text-neutral-900 font-gaming font-semibold rounded-button hover:bg-accent-400 transition-all duration-300 hover:shadow-glow-neon">
          Login
        </button>
      </div>
    </nav>
  );
};