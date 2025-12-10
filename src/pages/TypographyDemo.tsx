const TypographyDemo = () => {
  return (
    <div className="min-h-screen bg-neutral-950 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="heading-gamer heading-xl mb-4 text-glow-primary">
            Sistema Tipográfico Gaming
          </h1>
          <p className="body-lg max-w-2xl mx-auto">
            Demonstração completa do novo sistema tipográfico "Cyber Gaming Premium" 
            com hierarquia visual, cores integradas e efeitos especiais.
          </p>
        </div>

        {/* Headings Section */}
        <section className="mb-16">
          <h2 className="heading-lg mb-8 text-primary-400">Hierarquia de Títulos</h2>
          <div className="space-y-6 bg-neutral-900 p-8 rounded-card">
            <div>
              <h1 className="heading-gamer heading-xl text-glow-primary">H1 - Título Principal Gaming</h1>
              <code className="label-gaming">heading-gamer heading-xl text-glow-primary</code>
            </div>
            <div>
              <h2 className="heading-lg text-secondary-400">H2 - Subtítulo Seção</h2>
              <code className="label-gaming">heading-lg text-secondary-400</code>
            </div>
            <div>
              <h3 className="heading-md text-accent-400">H3 - Título de Card</h3>
              <code className="label-gaming">heading-md text-accent-400</code>
            </div>
            <div>
              <h4 className="heading-sm text-neutral-200">H4 - Subtítulo Menor</h4>
              <code className="label-gaming">heading-sm text-neutral-200</code>
            </div>
          </div>
        </section>

        {/* Body Text Section */}
        <section className="mb-16">
          <h2 className="heading-lg mb-8 text-primary-400">Texto de Corpo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-neutral-900 p-6 rounded-card">
              <h3 className="heading-sm mb-4 text-accent-400">Tamanhos de Texto</h3>
              <div className="space-y-4">
                <p className="body-xl">Body XL - Texto destacado e introduções</p>
                <p className="body-lg">Body LG - Texto principal padrão</p>
                <p className="body-base">Body Base - Texto secundário e descrições</p>
                <p className="body-sm">Body SM - Legendas e informações auxiliares</p>
              </div>
            </div>
            
            <div className="bg-neutral-900 p-6 rounded-card">
              <h3 className="heading-sm mb-4 text-accent-400">Cores de Texto</h3>
              <div className="space-y-2">
                <p className="text-neutral-0">Texto Principal - neutral-0</p>
                <p className="text-neutral-200">Texto Secundário - neutral-200</p>
                <p className="text-neutral-300">Texto Terciário - neutral-300</p>
                <p className="text-neutral-400">Texto Auxiliar - neutral-400</p>
                <p className="text-primary-400">Link/Destaque - primary-400</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gaming Elements */}
        <section className="mb-16">
          <h2 className="heading-lg mb-8 text-primary-400">Elementos Gaming</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Preços */}
            <div className="bg-neutral-900 p-6 rounded-card">
              <h3 className="heading-sm mb-4 text-accent-400">Preços</h3>
              <div className="space-y-3">
                <div className="price-gaming text-2xl">R$ 89,90</div>
                <div className="price-gaming text-xl">R$ 149,90</div>
                <div className="price-gaming text-lg">R$ 29,90</div>
              </div>
            </div>

            {/* Labels e Badges */}
            <div className="bg-neutral-900 p-6 rounded-card">
              <h3 className="heading-sm mb-4 text-accent-400">Labels & Badges</h3>
              <div className="space-y-3">
                <div className="label-gaming">Categoria do Jogo</div>
                <span className="badge-gaming bg-accent-500 text-neutral-900 px-3 py-1 rounded-full">
                  Novo
                </span>
                <span className="badge-gaming bg-secondary-500 text-white px-3 py-1 rounded-full">
                  Premium
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="bg-neutral-900 p-6 rounded-card">
              <h3 className="heading-sm mb-4 text-accent-400">Call to Actions</h3>
              <div className="space-y-3">
                <button className="btn-primary w-full">
                  <span className="cta-gaming">Comprar Agora</span>
                </button>
                <button className="btn-accent w-full">
                  <span className="cta-gaming">Adicionar</span>
                </button>
                <button className="btn-outline w-full">
                  <span className="cta-gaming">Ver Mais</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Text Effects */}
        <section className="mb-16">
          <h2 className="heading-lg mb-8 text-primary-400">Efeitos de Texto</h2>
          <div className="bg-neutral-900 p-8 rounded-card text-center space-y-6">
            <h3 className="heading-md text-glow-primary">Glow Primário</h3>
            <h3 className="heading-md text-glow-accent">Glow Accent</h3>
            <h3 className="heading-md text-glow-secondary">Glow Secundário</h3>
            <div className="price-gaming text-3xl">R$ 199,90</div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="mb-16">
          <h2 className="heading-lg mb-8 text-primary-400">Elementos de Formulário</h2>
          <div className="bg-neutral-900 p-8 rounded-card max-w-md">
            <div className="space-y-4">
              <div>
                <label className="label-gaming block mb-2">Nome do Usuário</label>
                <input 
                  type="text" 
                  className="input-gaming w-full" 
                  placeholder="Digite seu nome"
                />
              </div>
              <div>
                <label className="label-gaming block mb-2">Email</label>
                <input 
                  type="email" 
                  className="input-gaming w-full" 
                  placeholder="seu@email.com"
                />
              </div>
              <button className="btn-primary w-full mt-6">
                <span className="cta-gaming">Cadastrar</span>
              </button>
            </div>
          </div>
        </section>

        {/* Typography Scale */}
        <section>
          <h2 className="heading-lg mb-8 text-primary-400">Escala Tipográfica</h2>
          <div className="bg-neutral-900 p-8 rounded-card">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-5xl font-accent">5XL</span>
                <code className="label-gaming">3.815rem</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-accent">4XL</span>
                <code className="label-gaming">3.052rem</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-accent">3XL</span>
                <code className="label-gaming">2.441rem</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-accent">2XL</span>
                <code className="label-gaming">1.953rem</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-accent">XL</span>
                <code className="label-gaming">1.563rem</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-accent">LG</span>
                <code className="label-gaming">1.25rem</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-accent">BASE</span>
                <code className="label-gaming">1rem</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-accent">SM</span>
                <code className="label-gaming">0.875rem</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-accent">XS</span>
                <code className="label-gaming">0.75rem</code>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TypographyDemo;