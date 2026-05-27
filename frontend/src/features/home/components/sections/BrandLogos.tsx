const brands = [
  {
    name: "Acme",
    svg: (
      <svg viewBox="0 0 120 32" className="h-7 w-auto" fill="currentColor">
        <text
          x="0"
          y="22"
          fontFamily="serif"
          fontSize="22"
          fontWeight="700"
          letterSpacing="2"
        >
          ACME
        </text>
      </svg>
    ),
  },
  {
    name: "Lumen",
    svg: (
      <svg viewBox="0 0 120 32" className="h-7 w-auto" fill="currentColor">
        <circle
          cx="14"
          cy="16"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <text
          x="32"
          y="22"
          fontFamily="sans-serif"
          fontSize="18"
          fontWeight="600"
        >
          Lumen
        </text>
      </svg>
    ),
  },
  {
    name: "Northwind",
    svg: (
      <svg viewBox="0 0 140 32" className="h-7 w-auto" fill="currentColor">
        <path d="M4 26 L14 6 L24 26 Z" fill="currentColor" />
        <text
          x="30"
          y="22"
          fontFamily="sans-serif"
          fontSize="16"
          fontWeight="500"
          letterSpacing="3"
        >
          NORTHWIND
        </text>
      </svg>
    ),
  },
  {
    name: "Pulse",
    svg: (
      <svg
        viewBox="0 0 120 32"
        className="h-7 w-auto"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M2 16 H10 L14 6 L20 26 L24 16 H34" />
        <text
          x="42"
          y="22"
          fontSize="18"
          fontWeight="700"
          fill="currentColor"
          stroke="none"
          fontFamily="sans-serif"
        >
          Pulse
        </text>
      </svg>
    ),
  },
  {
    name: "Vertex",
    svg: (
      <svg viewBox="0 0 130 32" className="h-7 w-auto" fill="currentColor">
        <rect
          x="2"
          y="6"
          width="20"
          height="20"
          transform="rotate(45 12 16)"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="32"
          y="22"
          fontFamily="sans-serif"
          fontSize="18"
          fontWeight="600"
          fontStyle="italic"
        >
          Vertex
        </text>
      </svg>
    ),
  },
  {
    name: "Halcyon",
    svg: (
      <svg viewBox="0 0 140 32" className="h-7 w-auto" fill="currentColor">
        <text
          x="0"
          y="22"
          fontFamily="serif"
          fontSize="20"
          fontStyle="italic"
          fontWeight="500"
        >
          Halcyon&amp;Co
        </text>
      </svg>
    ),
  },
];

export default function BrandLogos() {
  return (
    <section className="w-full border-y border-border bg-background py-14">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-10 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by leading brands worldwide
        </p>
        <div className="grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((b) => (
            <div
              key={b.name}
              className="text-muted-foreground/70 transition-all duration-300 hover:text-foreground hover:scale-105"
              aria-label={b.name}
            >
              {b.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
