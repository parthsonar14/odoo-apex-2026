import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'bg-slate-100 text-slate-900',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    brand: 'bg-brand-100 text-brand-800',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
