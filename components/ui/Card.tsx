import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline';
}

export const Card = ({
  children,
  className = '',
  variant = 'default',
  ...rest
}: CardProps) => {
  const variants = {
    default: 'bg-white rounded-3xl border border-gray-100 shadow-2xl',
    outline: 'bg-white rounded-3xl border border-gray-200 shadow-sm',
  };

  return (
    <div className={`${variants[variant]} ${className}`} {...rest}>
      {children}
    </div>
  );
};
