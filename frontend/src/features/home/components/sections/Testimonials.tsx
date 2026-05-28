import { Marquee } from "@/shared/components/ui/marquee";
const items = [
  {
    title: "Verified Buyer • Manila",
    user: {
      first_name: "Maria",
      last_name: "Santos",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
      email_verified_at: null,
    },
    rating: 5,
    body: "Super fast delivery! I ordered a pair of sneakers and it arrived in just 2 days. Quality is exactly as shown in the photos.",
  },
  {
    title: "Verified Buyer • Cebu",
    user: {
      first_name: "John",
      last_name: "Dela Cruz",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
      email_verified_at: "2026-01-01",
    },
    rating: 5,
    body: "Legit store. I was worried at first but the product arrived well-packed and original. Will definitely order again.",
  },
];
function TestimonialCard({ item }: { item: (typeof items)[number] }) {
  const fullName = `${item.user.first_name} ${item.user.last_name}`;
  const isVerified = !!item.user.email_verified_at;

  return (
    <div className="relative flex h-full w-[20rem] shrink-0 flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900">
      {/* Body */}
      <div className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        {item.body}
      </div>

      {/* Rating */}
      <div className="mb-3 flex items-center gap-1 text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < item.rating ? "★" : "☆"}</span>
        ))}
      </div>

      {/* User */}
      <div className="mt-auto flex items-center gap-4">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <img
            src={item.user.avatar}
            alt={fullName}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-950 dark:text-neutral-50">
            {fullName}

            {isVerified && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-[2px] text-[10px] font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                ✓ Verified
              </span>
            )}
          </div>

          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {item.title}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-neutral-50 py-20">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl px-4 text-center">
          <span className="mb-3 inline-block rounded-full border border-neutral-200 bg-white px-4 py-1 text-xs font-medium text-neutral-600 shadow-sm">
            Testimonials
          </span>

          <h2 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            Loved by Customers Worldwide
          </h2>

          <p className="mt-4 text-neutral-500">
            Fast delivery, quality products, and a smooth shopping experience.
          </p>
        </div>

        {/* Edge fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-linear-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-linear-to-l from-white to-transparent" />

        {/* Marquee rows */}
        <div className="space-y-6">
          <Marquee className="py-2" direction="left">
            {[...items, ...items].map((item, index) => (
              <TestimonialCard key={index} item={item} />
            ))}
          </Marquee>

          <Marquee className="py-2" direction="right">
            {[...items, ...items].map((item, index) => (
              <TestimonialCard key={index} item={item} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
