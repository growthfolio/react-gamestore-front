import { useState, useEffect } from 'react';
import { ArrowUp } from '@phosphor-icons/react';

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-500 text-white p-4 rounded-full shadow-glow-md transition-all transform hover:scale-110 z-50"
      aria-label="Voltar ao topo"
    >
      <ArrowUp size={24} weight="bold" />
    </button>
  );
}

export default BackToTop;
