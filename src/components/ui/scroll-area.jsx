import React from 'react';

function ScrollArea({ className = '', children, ...props }) {
  return (
    <div
      className={`scroll-area ${className}`}
      {...props}
    >
      <div className="scroll-area-content">
        {children}
      </div>
    </div>
  );
}

export { ScrollArea };
