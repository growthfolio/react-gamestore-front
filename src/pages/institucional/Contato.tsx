import { useState } from 'react';
import { Envelope, Phone, MapPin, WhatsappLogo, PaperPlaneTilt } from '@phosphor-icons/react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';
import { useToast } from '../../contexts/ToastContext';

function Contato() {
  const toast = useToast();
  const [formData, setFormData] = useState({ nome: '', email: '', assunto: '', mensagem: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simula envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Mensagem enviada!', 'Responderemos em breve.');
    setFormData({ nome: '', email: '', assunto: '', mensagem: '' });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <Breadcrumbs items={[{ label: 'Contato' }]} />

        <div className="text-center mb-12">
          <h1 className="heading-gamer text-3xl md:text-4xl mb-4">Fale Conosco</h1>
          <p className="text-neutral-400">Estamos aqui para ajudar!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info de Contato */}
          <div className="space-y-6">
            <div className="card-gaming p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary-500/10 rounded-lg">
                  <Phone size={24} className="text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-100">Telefone</h3>
                  <p className="text-neutral-400">(11) 99999-9999</p>
                </div>
              </div>
              <p className="text-neutral-500 text-sm">Seg a Sex, 9h às 18h</p>
            </div>

            <div className="card-gaming p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <WhatsappLogo size={24} className="text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-100">WhatsApp</h3>
                  <p className="text-neutral-400">(11) 99999-9999</p>
                </div>
              </div>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-green-400 text-sm hover:underline">
                Iniciar conversa →
              </a>
            </div>

            <div className="card-gaming p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-secondary-500/10 rounded-lg">
                  <Envelope size={24} className="text-secondary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-100">E-mail</h3>
                  <p className="text-neutral-400">contato@gamestore.com.br</p>
                </div>
              </div>
              <p className="text-neutral-500 text-sm">Respondemos em até 24h</p>
            </div>

            <div className="card-gaming p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-accent-500/10 rounded-lg">
                  <MapPin size={24} className="text-accent-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-100">Endereço</h3>
                  <p className="text-neutral-400">São Paulo, SP - Brasil</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="lg:col-span-2">
            <div className="card-gaming p-8">
              <h2 className="heading-md text-primary-400 mb-6">Envie sua mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">Nome</label>
                    <input
                      type="text"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                      className="w-full input-gaming"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-400 mb-2">E-mail</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full input-gaming"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Assunto</label>
                  <select
                    value={formData.assunto}
                    onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                    required
                    className="w-full select-gaming"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvida">Dúvida sobre produto</option>
                    <option value="pedido">Problema com pedido</option>
                    <option value="troca">Troca ou devolução</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-neutral-400 mb-2">Mensagem</label>
                  <textarea
                    value={formData.mensagem}
                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    required
                    rows={5}
                    className="w-full textarea-gaming"
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                <button type="submit" disabled={isLoading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <PaperPlaneTilt size={20} weight="bold" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contato;
