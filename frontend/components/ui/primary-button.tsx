'use client';

import Link from 'next/link';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, children, href, ...props }, ref) => {
    if (href) {
      return (
        <Link
          href={href}
          className={clsx(
            'inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            className,
          )}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-200 hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

PrimaryButton.displayName = 'PrimaryButton';
