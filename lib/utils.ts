export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export function randomColor() {
  const randColor = [
    "#fb7185",
    "#f472b6",
    "#e879f9",
    "#c084fc",
    "#a78bfa",
    "#818cf8",
    "#60a5fa",
    "#38bdf8",
    "#22d3ee",
    "#2dd4bf",
    "#34d399",
    "#4ade80",
    "#a3e635",
    "#facc15",
    "#fbbf24",
    "#f87171",
    "#9ca3af",
    "#94a3b8",
  ];

  return randColor[Math.floor(Math.random() * randColor.length)];
}
