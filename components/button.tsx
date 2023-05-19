interface ButtonProps {
  text: string;
  loading?: boolean;
  [key: string]: any;
}

export default function Button({ text, loading, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className="w-full rounded-md border border-transparent bg-green-500 px-4 py-3 text-base font-medium text-white shadow-sm transition-all hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
    >
      {loading ? "Loading..." : text}
    </button>
  );
}
