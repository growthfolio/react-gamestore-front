import { useState, useEffect } from 'react';
import { Cookie } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-4 z-50 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie size={24} className="text-accent-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-neutral-200 text-sm">
              Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa{' '}
              <Link to="/politica-privacidade" className="text-primary-400 hover:underline">
                Política de Privacidade
              </Link>.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={handleDecline} className="px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors">
            Recusar
          </button>
          <button onClick={handleAccept} className="btn-primary px-6 py-2 text-sm">
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
