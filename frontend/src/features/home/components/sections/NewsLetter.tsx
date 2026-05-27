export function Newsletter() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-8 py-16 text-white">
        {/* subtle glow background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-20 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-medium text-white/80">
            Stay Updated
          </span>

          <h2 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
            Get Exclusive Deals & Updates
          </h2>

          <p className="mt-4 text-white/70">
            Subscribe to our newsletter and be the first to know about new
            arrivals, special offers, and exclusive discounts.
          </p>

          {/* input */}
          <form className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full sm:w-96 rounded-full px-5 py-3 text-black outline-none focus:ring-2 focus:ring-white"
            />

            <button
              type="submit"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-neutral-200 transition"
            >
              Subscribe
            </button>
          </form>

          {/* trust note */}
          <p className="mt-4 text-xs text-white/50">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
