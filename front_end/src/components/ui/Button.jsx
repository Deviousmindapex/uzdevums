export function Button({ type = "button", children, className, onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ${className}`}>
      {children}
    </button>
  );
}
