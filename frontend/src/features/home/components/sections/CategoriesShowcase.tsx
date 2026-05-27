export default function CategoriesShowcase() {
  const categories = [
    {
      title: "Electronics",
      count: "120+ Products",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
      large: true,
    },
    {
      title: "Gaming",
      count: "80+ Products",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Fashion",
      count: "150+ Products",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Accessories",
      count: "60+ Products",
      image:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1200&auto=format&fit=crop",
    },
    {
      title: "Home Living",
      count: "95+ Products",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4 md:px-6">
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
                  ? "min-h-[500px] lg:col-span-2 lg:row-span-2"
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
                  <p className="text-sm text-neutral-200">{category.count}</p>

                  <h3 className="text-3xl font-bold tracking-tight">
                    {category.title}
                  </h3>

                  <button className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all duration-300 hover:bg-neutral-200">
                    Shop Now
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
