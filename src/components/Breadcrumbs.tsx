import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Kruimelpad" className="py-2.5 text-xs text-slate-500 overflow-x-auto">
      <ol className="flex items-center gap-1.5 whitespace-nowrap">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              {item.path && !isLast ? (
                <Link
                  to={item.path}
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
