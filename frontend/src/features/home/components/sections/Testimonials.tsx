import { Marquee } from "@/shared/components/ui/marquee";
const items = [
  {
    name: "Maria Santos",
    title: "Verified Buyer • Manila",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    body: "Super fast delivery! I ordered a pair of sneakers and it arrived in just 2 days. Quality is exactly as shown in the photos.",
  },
  {
    name: "John Dela Cruz",
    title: "Verified Buyer • Cebu",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    body: "Legit store. I was worried at first but the product arrived well-packed and original. Will definitely order again.",
  },
  {
    name: "Alyssa Reyes",
    title: "Verified Buyer • Davao",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    body: "The clothes are really high quality for the price. Fits perfectly and looks exactly like the pictures.",
  },
  {
    name: "Mark Villanueva",
    title: "Verified Buyer • Quezon City",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    body: "Customer service was very responsive when I asked about my order. Smooth shopping experience overall.",
  },
];

function TestimonialCard({ item }: { item: (typeof items)[number] }) {
  return (
    <div className="relative flex h-full w-[20rem] flex-col items-start justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900">
      <div className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        {item.body}
      </div>
      <div className="mt-auto flex items-center gap-4">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-medium text-neutral-950 dark:text-neutral-50">
            {item.name}
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
