const brands = [
  {
    name: "Nike",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-auto overflow-visible"
        fill="currentColor"
      >
        <text
          x="0"
          y="21"
          fontFamily="sans-serif"
          fontSize="22"
          fontWeight="700"
          fontStyle="italic"
        >
          NIKE
        </text>
      </svg>
    ),
  },
  {
    name: "Adidas",
    svg: (
      <svg className="h-8 w-auto overflow-visible" fill="currentColor">
        <text
          x="0"
          y="21"
          fontFamily="sans-serif"
          fontSize="20"
          fontWeight="700"
        >
          adidas
        </text>
      </svg>
    ),
  },
  {
    name: "Louis Vuitton",
    svg: (
      <svg className="h-8 w-auto overflow-visible" fill="currentColor">
        <text
          x="0"
          y="21"
          fontFamily="serif"
          fontSize="20"
          fontWeight="700"
          letterSpacing="2"
        >
          LV
        </text>
      </svg>
    ),
  },
  {
    name: "Gucci",
    svg: (
      <svg className="h-8 w-auto overflow-visible" fill="currentColor">
        <text x="0" y="21" fontFamily="serif" fontSize="18" fontWeight="600">
          Gucci
        </text>
      </svg>
    ),
  },
  {
    name: "Apple",
    svg: (
      <svg className="h-8 w-auto overflow-visible" fill="currentColor">
        <text
          x="0"
          y="21"
          fontFamily="sans-serif"
          fontSize="18"
          fontWeight="600"
        >
          Apple
        </text>
      </svg>
    ),
  },
  {
    name: "Samsung",
    svg: (
      <svg className="h-8 w-auto overflow-visible" fill="currentColor">
        <text
          x="0"
          y="21"
          fontFamily="sans-serif"
          fontSize="18"
          fontWeight="700"
          letterSpacing="2"
        >
          SAMSUNG
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 justify-items-center items-center">
          {brands.map((b) => (
            <div
              key={b.name}
              className="flex h-16 items-center justify-center text-muted-foreground/70 transition-all duration-300 hover:scale-105 hover:text-foreground"
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
