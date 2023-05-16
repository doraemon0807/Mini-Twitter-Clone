import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
  name: string;
  label: string;
  kind?: "text" | "phone";
  register: UseFormRegisterReturn;
  required?: boolean;
  [key: string]: any;
}

export default function Input({
  name,
  label,
  kind = "text",
  register,
  required,
  ...rest
}: InputProps) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        {kind === "text" ? (
          <input
            id={name}
            {...register}
            className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
            type={kind}
            required={required}
            {...rest}
          />
        ) : kind === "phone" ? (
          <div className="flex rounded-md shadow-sm">
            <span className="flex select-none items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
              +1
            </span>
            <input
              id={name}
              {...register}
              className="w-full appearance-none rounded-r-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              type={kind}
              required={required}
              {...rest}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
