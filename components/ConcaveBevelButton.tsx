'use client';
import { prefersReducedMotion } from '@/lib/motion';
import { clsx } from 'clsx';
import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };

export default function ConcaveBevelButton({ className, children, ...rest }: Props) {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => setReduced(prefersReducedMotion()), []);

  return (
    <button
      {...rest}
      className={clsx(
        'relative select-none px-4 py-2 rounded-2xl text-sm font-semibold text-white',
        'accent-gradient shadow-lg',
        'transition-transform will-change-transform',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/60',
        'active:scale-95',
        reduced ? '' : 'hover:[transform:rotateX(1.5deg)_rotateY(-1.5deg)] active:[transform:scale(.98)_rotateX(2deg)_rotateY(-2deg)]',
        'before:absolute before:inset-0 before:rounded-2xl before:shadow-concave before:pointer-events-none',
        className,
      )}
    >
      {children}
    </button>
  );
}
