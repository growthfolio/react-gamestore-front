import { useState } from 'react';
import { CaretDown, Question } from '@phosphor-icons/react';
import Breadcrumbs from '../../components/ui/Breadcrumbs';

const faqs = [
  {
    categoria: 'Compras',
    perguntas: [
      { q: 'Como faço para comprar?', a: 'Basta adicionar os produtos ao carrinho, fazer login ou criar uma conta, e finalizar a compra escolhendo a forma de pagamento.' },
      { q: 'Quais formas de pagamento são aceitas?', a: 'Aceitamos cartões de crédito (Visa, Master, Elo), Pix e boleto bancário. Parcelamos em até 12x sem juros no cartão.' },
      { q: 'É seguro comprar na GameStore?', a: 'Sim! Utilizamos certificado SSL e todas as transações são criptografadas. Seus dados estão protegidos.' },
    ]
  },
  {
    categoria: 'Entrega',
    perguntas: [
      { q: 'Qual o prazo de entrega?', a: 'Para produtos digitais, a entrega é imediata após a confirmação do pagamento. Para produtos físicos, o prazo varia de 3 a 10 dias úteis.' },
      { q: 'O frete é grátis?', a: 'Sim! Oferecemos frete grátis para compras acima de R$ 199 para todo o Brasil.' },
      { q: 'Como rastreio meu pedido?', a: 'Após o envio, você receberá um e-mail com o código de rastreamento. Também pode acompanhar na área "Meus Pedidos".' },
    ]
  },
  {
    categoria: 'Conta',
    perguntas: [
      { q: 'Como crio uma conta?', a: 'Clique em "Entrar" no menu e depois em "Criar Conta". Preencha seus dados e pronto!' },
      { q: 'Esqueci minha senha, o que faço?', a: 'Na tela de login, clique em "Esqueci minha senha" e siga as instruções enviadas por e-mail.' },
      { q: 'Posso alterar meus dados?', a: 'Sim, acesse "Meu Perfil" para atualizar suas informações pessoais.' },
    ]
  },
  {
    categoria: 'Trocas e Devoluções',
    perguntas: [
      { q: 'Posso trocar um produto?', a: 'Produtos físicos podem ser trocados em até 7 dias após o recebimento, desde que estejam lacrados.' },
      { q: 'Como solicito reembolso?', a: 'Entre em contato conosco através da página de Contato informando o número do pedido e o motivo.' },
      { q: 'Produtos digitais podem ser devolvidos?', a: 'Produtos digitais não são passíveis de devolução após a ativação, conforme política da indústria.' },
    ]
  },
];

function FAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Breadcrumbs items={[{ label: 'Perguntas Frequentes' }]} />

        <div className="text-center mb-12">
          <Question size={48} className="mx-auto mb-4 text-primary-400" />
          <h1 className="heading-gamer text-3xl md:text-4xl mb-4">Perguntas Frequentes</h1>
          <p className="text-neutral-400">Encontre respostas para as dúvidas mais comuns</p>
        </div>

        <div className="space-y-8">
          {faqs.map((categoria) => (
            <div key={categoria.categoria}>
              <h2 className="heading-md text-primary-400 mb-4">{categoria.categoria}</h2>
              <div className="space-y-2">
                {categoria.perguntas.map((item, index) => {
                  const id = `${categoria.categoria}-${index}`;
                  const isOpen = openItems.includes(id);
                  
                  return (
                    <div key={id} className="card-gaming overflow-hidden">
                      <button
                        onClick={() => toggleItem(id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-800/50 transition-colors"
                      >
                        <span className="font-semibold text-neutral-100">{item.q}</span>
                        <CaretDown size={20} className={`text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-neutral-300 border-t border-neutral-800 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="card-gaming p-6 mt-12 text-center">
          <h3 className="heading-sm text-neutral-100 mb-2">Não encontrou sua resposta?</h3>
          <p className="text-neutral-400 mb-4">Entre em contato conosco que teremos prazer em ajudar!</p>
          <a href="/contato" className="btn-primary inline-block">Fale Conosco</a>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
