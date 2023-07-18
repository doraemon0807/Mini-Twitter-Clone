import { cls } from "@/lib/utils";

interface AvatarProps {
  size?: "small" | "big";
  unselect?: boolean;
  select?: boolean;
  color?: string;
  [key: string]: any;
}

export default function Avatar({
  size,
  unselect,
  select,
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
          ? "h-8 w-8 min-w-[32px]"
          : size === "big"
          ? "h-20 w-20 min-w-[80px]"
          : "h-10 w-10 min-w-[40px]",
        select ? "rounded-full ring-4 ring-green-300 ring-offset-4" : "",
        select || unselect
          ? "transition-all hover:ring-4 hover:ring-green-300 hover:ring-offset-4"
          : ""
      )}
    >
      <svg
        className={cls(
          "absolute text-gray-400",
          size === "small"
            ? "-left-1 h-10 w-10"
            : size === "big"
            ? "-left-2 h-24 w-24"
            : "-left-1 h-12 w-12"
        )}
        fill="currentColor"
        stroke="#56585c"
        strokeWidth="0.2"
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
