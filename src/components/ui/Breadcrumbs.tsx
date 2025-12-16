import { Link } from 'react-router-dom';
import { House, CaretRight } from '@phosphor-icons/react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-neutral-400 mb-6 flex-wrap">
      <Link to="/home" className="hover:text-primary-400 transition-colors flex items-center gap-1">
        <House size={16} />
        <span className="hidden sm:inline">Home</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <CaretRight size={14} className="text-neutral-600" />
          {item.href ? (
            <Link to={item.href} className="hover:text-primary-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-200 truncate max-w-[200px]">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
