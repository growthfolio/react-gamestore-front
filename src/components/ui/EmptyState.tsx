import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

function EmptyState({ icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionHref) {
      navigate(actionHref);
    }
  };

  return (
    <div className="card-gaming p-12 text-center max-w-lg mx-auto">
      <div className="text-neutral-600 mb-4 flex justify-center">
        {icon}
      </div>
      <h2 className="heading-gamer text-xl text-neutral-300 mb-2">{title}</h2>
      <p className="text-neutral-500 mb-6">{description}</p>
      {actionLabel && (
        <button className="btn-primary" onClick={handleAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
