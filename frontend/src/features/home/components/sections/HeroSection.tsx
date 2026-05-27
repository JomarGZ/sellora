import { Link } from "@tanstack/react-router";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-gray-50 to-sky-100/50">
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 -z-10 h-150 w-150 rounded-full bg-sky-200/20 blur-3xl lg:translate-x-1/4 lg:-translate-y-1/4" />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-5">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left Column: Content */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            {/* Tag/Badging */}
            <div className="mb-4 inline-flex items-center justify-center lg:justify-start">
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold tracking-wide text-sky-700 uppercase">
                New Season Arrival
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Style That Speaks <br />
              <span className="bg-linear-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                for You
              </span>
            </h1>

            <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
              Discover the latest trends in fashion — curated pieces designed
              for comfort, confidence, and everyday wear.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-8 py-4 text-base font-medium text-white shadow-xl transition-all duration-200 hover:bg-gray-800 hover:-translate-y-0.5"
              >
                Shop the Collection
              </Link>
              <Link
                to="/shop" // Or a specific category like /shop/trending
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-8 py-4 text-base font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-400"
              >
                Explore Trends
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-gray-100 pt-8 text-left max-w-md mx-auto lg:mx-0">
              <div>
                <p className="font-bold text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over $75</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">Easy Returns</p>
                <p className="text-xs text-gray-500">30-day guarantee</p>
              </div>
              <div>
                <p className="font-bold text-gray-900">100% Secure</p>
                <p className="text-xs text-gray-500">Encrypted checkout</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visuals */}
          <div className="relative lg:mt-0">
            {/* Main Visual Container */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Backing decorative card decoration */}
              <div className="absolute -inset-2 rounded-2xl bg-linear-to-r from-sky-400 to-indigo-400 opacity-25 blur-lg" />

              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg aspect-square max-w-[90%] sm:max-w-[85%] lg:max-w-[88%] mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
                  alt="New season fashion collection model looking forward"
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
              </div>

              {/* Floating Promo Tag */}
              <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-3 rounded-xl bg-white p-4 shadow-xl border border-gray-100 animate-bounce animation-duration-[3s]">
                <div className="rounded-lg bg-emerald-500 p-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6h.008v.008H6V6Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Use Code</p>
                  <p className="text-sm font-bold text-gray-900">
                    STYLE20 for 20% off
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
