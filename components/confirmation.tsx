interface ConfirmationProps {
  text: string;
  button1: string;
  button2: string;
  onClick1: () => void;
  onClick2: () => void;
  [key: string]: any;
}

export default function Confirmation({
  text,
  button1,
  button2,
  onClick1,
  onClick2,
  ...rest
}: ConfirmationProps) {
  return (
    <div
      {...rest}
      className="absolute right-0 top-10 h-auto w-56 space-y-2 rounded-xl border bg-white p-4 shadow-sm"
    >
      <h5 className="text-center text-base text-gray-900">{text}</h5>
      <div className="flex justify-evenly">
        <button
          onClick={onClick1}
          className="rounded-md border bg-green-500 px-2 py-1 text-sm text-white transition-colors hover:bg-green-600"
        >
          {button1}
        </button>
        <button
          onClick={onClick2}
          className="rounded-md border bg-green-500 px-2 py-1 text-sm text-white transition-colors hover:bg-green-600"
        >
          {button2}
        </button>
      </div>
    </div>
  );
}
