import { Link } from "@tanstack/react-router";
const categories = [
  {
    title: "Men's Clothing",
    to: "/shop?category=mens-clothing",
    image:
      "https://plus.unsplash.com/premium_photo-1688497830977-f9ab9f958ca7?q=80&w=1051&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    large: true,
  },
  {
    title: "Women's Clothing",
    to: "/shop?category=womens-clothing",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Streetwear",
    to: "/shop?category=streetwear",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Activewear",
    to: "/shop?category=activewear",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Formal Wear",
    to: "/shop?category=formal-wear",
    image:
      "https://images.unsplash.com/photo-1635913906376-53130718255a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function CategoriesShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col items-center text-center">
        <span className="mb-3 rounded-full border border-neutral-200 px-4 py-1 text-sm font-medium text-neutral-600">
          Explore Collections
        </span>

        <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
          Shop by Category
        </h2>

        <p className="mt-4 max-w-xl text-neutral-500">
          Discover premium collections curated for modern lifestyles and
          everyday essentials.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:grid-rows-2">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-3xl bg-neutral-100 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
              category.large
                ? "min-h-125 lg:col-span-2 lg:row-span-2"
                : "min-h-60"
            }`}
          >
            <img
              src={category.image}
              alt={category.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

            <div className="relative flex h-full flex-col justify-end p-8 text-white">
              <div className="space-y-3">
                <h3 className="text-3xl font-bold tracking-tight">
                  {category.title}
                </h3>

                <Link
                  to={category.to}
                  className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all duration-300 hover:bg-neutral-200"
                >
                  Shop Now
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
