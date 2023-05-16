import { useEffect, useState } from "react";

export default function useInfiniteScroll() {
  const [page, setPage] = useState(1);

  const handleScroll = () => {
    if (
      document.documentElement.clientHeight +
        Math.ceil(document.documentElement.scrollTop) >=
      document.documentElement.scrollHeight
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.addEventListener("scroll", handleScroll);
    };
  }, [page, setPage]);

  return page;
}
