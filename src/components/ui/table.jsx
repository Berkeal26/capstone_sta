import React from 'react';

function Table({ className = '', children, ...props }) {
  return (
    <div className={`relative w-full overflow-auto ${className}`}>
      <table className={`table ${className}`} {...props}>
        {children}
      </table>
    </div>
  );
}

function TableHeader({ className = '', children, ...props }) {
  return (
    <thead className={`table-header ${className}`} {...props}>
      {children}
    </thead>
  );
}

function TableBody({ className = '', children, ...props }) {
  return (
    <tbody className={`table-body ${className}`} {...props}>
      {children}
    </tbody>
  );
}

function TableRow({ className = '', children, ...props }) {
  return (
    <tr
      className={`${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

function TableHead({ className = '', children, ...props }) {
  return (
    <th
      className={`table-head ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

function TableCell({ className = '', children, ...props }) {
  return (
    <td
      className={`table-cell ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
};
