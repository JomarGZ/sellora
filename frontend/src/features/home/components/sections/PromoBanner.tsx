export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black via-neutral-900 to-black text-white shadow-xl">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-20 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-10 md:p-14">
          {/* Text Content */}
          <div>
            <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-medium text-white/80">
              Limited Time Offer
            </span>

            <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
              Get Up to 40% Off on Selected Items
            </h2>

            <p className="mt-4 text-white/70">
              Don’t miss out on exclusive deals across fashion, electronics, and
              accessories. Offer ends soon — grab your favorites today.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-neutral-200 transition">
                Shop Deals
              </button>

              <button className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition">
                Learn More
              </button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative flex justify-center md:justify-end">
            <img
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=1200&auto=format&fit=crop"
              alt="Promo"
              className="w-full max-w-md rounded-2xl shadow-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
