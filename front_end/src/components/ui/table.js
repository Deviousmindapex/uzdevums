import React from "react";

export function Table({ children, className }) {
  return <table className={`w-full border-collapse ${className}`}>{children}</table>;
}

export function TableHeader({ children }) {
  return <thead className="bg-gray-100">{children}</thead>;
}

export function TableRow({ children, className }) {
  return <tr className={`border-b ${className}`}>{children}</tr>;
}

export function TableHead({ children, className }) {
  return <th className={`text-left p-2 font-medium ${className}`}>{children}</th>;
}

export function TableBody({ children }) {
  return <tbody>{children}</tbody>;
}

export function TableCell({ children, className }) {
  return <td className={`p-2 ${className}`}>{children}</td>;
}
