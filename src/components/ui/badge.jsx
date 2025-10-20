import React from 'react';

const badgeVariants = {
  default: 'badge badge-default',
  secondary: 'badge badge-secondary',
  destructive: 'badge badge-destructive',
  outline: 'badge badge-outline',
};

function Badge({ className = '', variant = 'default', children, ...props }) {
  return (
    <div
      className={`${badgeVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export { Badge };
