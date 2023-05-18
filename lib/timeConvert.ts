export function createdAgo(createdAt: Date) {
  const diff = Math.floor(
    (new Date().getTime() - new Date(createdAt).getTime()) / 1000
  );

  let timeAgo = "";

  const checkTimeDiff = () => {
    switch (true) {
      case diff <= 1:
        timeAgo = "Just Now";
        break;
      case diff < 59:
        timeAgo = new Intl.RelativeTimeFormat("en-US").format(-diff, "second");
        break;
      case diff <= 3540:
        timeAgo = new Intl.RelativeTimeFormat("en-US").format(
          -Math.round(diff / 60),
          "minute"
        );
        break;
      case diff <= 82800:
        timeAgo = new Intl.RelativeTimeFormat("en-US").format(
          -Math.round(diff / 3600),
          "hour"
        );
        break;
      case diff <= 518400:
        timeAgo = new Intl.RelativeTimeFormat("en-US").format(
          -Math.round(diff / 86400),
          "day"
        );
        break;
      case diff <= 1814400:
        timeAgo = new Intl.RelativeTimeFormat("en-US").format(
          -Math.round(diff / 604800),
          "week"
        );
        break;
      case diff <= 26611200:
        timeAgo = new Intl.RelativeTimeFormat("en-US").format(
          -Math.round(diff / 2419200),
          "month"
        );
        break;
      case diff > 26611200:
        timeAgo = new Intl.RelativeTimeFormat("en-US").format(
          -Math.round(diff / 29030400),
          "year"
        );
        break;
      default:
        timeAgo =
          "on " +
          createdAt.toLocaleDateString("Canada", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        break;
    }
  };
  checkTimeDiff();
  return timeAgo;
}

export function compactNumber(data: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(data);
}

export function formatDate(data: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(data);
}

export function formatTime(data: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(data);
}

export function formatDateShort(data: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
  }).format(data);
}
