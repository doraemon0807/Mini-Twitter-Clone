import { cls } from "@/lib/utils";

interface AvatarProps {
  size?: "small" | "big";
  unselect?: boolean;
  color?: string;
  [key: string]: any;
}

export default function Avatar({
  size,
  unselect,
  color,
  ...rest
}: AvatarProps) {
  return (
    <div
      {...rest}
      style={{ backgroundColor: unselect ? "#f3f4f6" : `${color}` }}
      className={cls(
        "relative overflow-hidden rounded-full",
        size === "small"
          ? "h-8 w-8"
          : size === "big"
          ? "h-16 w-16"
          : "h-10 w-10"
      )}
    >
      <svg
        className={cls(
          "absolute text-gray-400",
          size === "small"
            ? "-left-1 h-10 w-10"
            : size === "big"
            ? "-left-2 h-20 w-20"
            : "-left-1 h-12 w-12"
        )}
        fill="currentColor"
        stroke="black"
        strokeWidth="0.1"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        ></path>
      </svg>
    </div>
  );
}
