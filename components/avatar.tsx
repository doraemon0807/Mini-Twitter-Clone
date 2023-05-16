import { cls } from "@/lib/utils";

interface AvatarProps {
  size?: "small" | "big";
  unselect?: boolean;
  [key: string]: any;
}

export default function Avatar({ size, unselect }: AvatarProps) {
  return (
    <div
      className={cls(
        "relative overflow-hidden rounded-full bg-gray-100",
        unselect ? "bg-gray-100" : "bg-red-500",
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
            ? "left-1 h-14 w-14"
            : "-left-1 h-12 w-12"
        )}
        fill="currentColor"
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
