import { Link } from '@tanstack/react-router'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-sky-100/50">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl animate-[fadeIn_0.5s_ease-out_forwards]">
            Latest Tech. Smarter Living.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 animate-[fadeIn_0.5s_ease-out_0.1s_forwards] opacity-0 [animation-fill-mode:forwards]">
            Discover premium gadgets and electronics designed for the way you work and play.
          </p>
          <div className="mt-8 animate-[fadeIn_0.5s_ease-out_0.2s_forwards] opacity-0 [animation-fill-mode:forwards]">
            <Link
              to="/shop"
              className="inline-flex items-center rounded-lg bg-sky-500 px-6 py-3 text-base font-medium text-white shadow-md transition-all hover:bg-sky-600 hover:shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.08),transparent)]" />
    </section>
  )
}
