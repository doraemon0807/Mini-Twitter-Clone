import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  label?: string;
  name?: string;
  placeholder?: string;
  [key: string]: any;
  register: UseFormRegisterReturn;
}

export default function TextArea({
  label,
  placeholder,
  name,
  register,
  ...rest
}: TextAreaProps) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <textarea
        id={name}
        className="mt-1 w-full rounded-md border-gray-300 shadow-sm transition-all placeholder:text-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
        rows={4}
        placeholder={placeholder}
        {...register}
        {...rest}
      />
    </div>
  );
}
