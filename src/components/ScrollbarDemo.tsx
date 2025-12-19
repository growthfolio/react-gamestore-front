import React from 'react';

const ScrollbarDemo: React.FC = () => {
  const generateContent = (lines: number) => {
    return Array.from({ length: lines }, (_, i) => (
      <div key={i} className="p-4 mb-2 bg-neutral-800 rounded-gaming border border-neutral-700">
        <h3 className="text-accent-400 font-accent font-bold mb-2">Item {i + 1}</h3>
        <p className="text-neutral-300">
          Este é um exemplo de conteúdo para demonstrar a scrollbar customizada. 
          O design combina com o tema gaming da aplicação.
        </p>
      </div>
    ));
  };

  return (
    <div className="p-8 bg-neutral-950 min-h-screen">
      <h1 className="heading-gamer heading-xl mb-8 text-center">
        🎮 Gaming Scrollbar Demo
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Default Gaming Scrollbar */}
        <div className="bg-neutral-900 rounded-card p-6 border border-neutral-800">
          <h2 className="text-accent-400 font-accent font-bold mb-4 text-center">
            Default Gaming (Verde)
          </h2>
          <div className="h-64 overflow-y-auto scrollbar-gaming">
            {generateContent(10)}
          </div>
        </div>

        {/* Primary Blue Scrollbar */}
        <div className="bg-neutral-900 rounded-card p-6 border border-neutral-800">
          <h2 className="text-primary-400 font-accent font-bold mb-4 text-center">
            Primary (Azul)
          </h2>
          <div className="h-64 overflow-y-auto scrollbar-primary">
            {generateContent(10)}
          </div>
        </div>

        {/* Purple Scrollbar */}
        <div className="bg-neutral-900 rounded-card p-6 border border-neutral-800">
          <h2 className="text-secondary-400 font-accent font-bold mb-4 text-center">
            Secondary (Roxo)
          </h2>
          <div className="h-64 overflow-y-auto scrollbar-purple">
            {generateContent(10)}
          </div>
        </div>
      </div>

      {/* Thin Scrollbar Example */}
      <div className="mt-8 bg-neutral-900 rounded-card p-6 border border-neutral-800">
        <h2 className="text-accent-400 font-accent font-bold mb-4 text-center">
          Scrollbar Fina (Para áreas menores)
        </h2>
        <div className="h-32 overflow-y-auto scrollbar-thin scrollbar-gaming">
          {generateContent(8)}
        </div>
      </div>

      {/* Horizontal Scrollbar Example */}
      <div className="mt-8 bg-neutral-900 rounded-card p-6 border border-neutral-800">
        <h2 className="text-accent-400 font-accent font-bold mb-4 text-center">
          Scrollbar Horizontal
        </h2>
        <div className="overflow-x-auto scrollbar-gaming">
          <div className="flex space-x-4 w-max">
            {Array.from({ length: 15 }, (_, i) => (
              <div key={i} className="flex-shrink-0 w-48 p-4 bg-neutral-800 rounded-gaming border border-neutral-700">
                <h3 className="text-accent-400 font-accent font-bold mb-2">Card {i + 1}</h3>
                <p className="text-neutral-300 text-sm">
                  Exemplo de card horizontal para demonstrar scrollbar horizontal.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 bg-gradient-card rounded-card p-6 border border-primary-500/30">
        <h2 className="text-primary-400 font-accent font-bold mb-4">
          📋 Como Usar
        </h2>
        <div className="space-y-3 text-neutral-300">
          <div className="bg-neutral-800 rounded-gaming p-3 font-mono text-sm">
            <span className="text-accent-400">className=</span>
            <span className="text-neutral-100">"scrollbar-gaming"</span>
            <span className="text-neutral-500"> // Verde neon (padrão)</span>
          </div>
          <div className="bg-neutral-800 rounded-gaming p-3 font-mono text-sm">
            <span className="text-accent-400">className=</span>
            <span className="text-neutral-100">"scrollbar-primary"</span>
            <span className="text-neutral-500"> // Azul elétrico</span>
          </div>
          <div className="bg-neutral-800 rounded-gaming p-3 font-mono text-sm">
            <span className="text-accent-400">className=</span>
            <span className="text-neutral-100">"scrollbar-purple"</span>
            <span className="text-neutral-500"> // Roxo cyber</span>
          </div>
          <div className="bg-neutral-800 rounded-gaming p-3 font-mono text-sm">
            <span className="text-accent-400">className=</span>
            <span className="text-neutral-100">"scrollbar-thin"</span>
            <span className="text-neutral-500"> // Versão mais fina</span>
          </div>
          <div className="bg-neutral-800 rounded-gaming p-3 font-mono text-sm">
            <span className="text-accent-400">className=</span>
            <span className="text-neutral-100">"scrollbar-hide"</span>
            <span className="text-neutral-500"> // Oculta mas mantém funcionalidade</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollbarDemo;
