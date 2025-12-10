import React from 'react';
import { GameButtons, GameCard, GamingNavbar } from '../examples/BrandingExamples';

const BrandingDemo = () => {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Navbar */}
      <GamingNavbar />
      
      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <h1 className="heading-gamer heading-xl mb-8 text-center text-glow-primary">
          🎮 Novo Branding <span className="text-primary-400">GameStore</span>
        </h1>
        
        {/* Buttons Section */}
        <section className="mb-12">
          <h2 className="heading-lg text-primary-400 mb-6">
            Botões Gaming
          </h2>
          <GameButtons />
        </section>
        
        {/* Cards Section */}
        <section className="mb-12">
          <h2 className="heading-lg text-secondary-400 mb-6">
            Cards de Jogos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GameCard />
            <GameCard />
            <GameCard />
          </div>
        </section>
        
        {/* Color Palette */}
        <section>
          <h2 className="heading-lg text-accent-400 mb-6">
            Paleta de Cores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Primary */}
            <div className="bg-neutral-900 p-6 rounded-card">
              <h3 className="heading-sm text-primary-400 mb-4">
                Primary - Electric Blue
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-500 rounded"></div>
                  <span className="label-gaming">#0087FF</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-600 rounded"></div>
                  <span className="label-gaming">#006BCC</span>
                </div>
              </div>
            </div>
            
            {/* Secondary */}
            <div className="bg-neutral-900 p-6 rounded-card">
              <h3 className="heading-sm text-secondary-400 mb-4">
                Secondary - Cyber Purple
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary-500 rounded"></div>
                  <span className="label-gaming">#8700FF</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary-600 rounded"></div>
                  <span className="label-gaming">#6B00CC</span>
                </div>
              </div>
            </div>
            
            {/* Accent */}
            <div className="bg-neutral-900 p-6 rounded-card">
              <h3 className="heading-sm text-accent-400 mb-4">
                Accent - Neon Green
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent-500 rounded"></div>
                  <span className="label-gaming">#00FF4B</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-accent-600 rounded"></div>
                  <span className="label-gaming">#00CC3C</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BrandingDemo;