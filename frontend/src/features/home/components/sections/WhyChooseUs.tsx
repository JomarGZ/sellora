import { ShieldCheck, Truck, Headphones, RefreshCcw } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      description:
        "Your transactions are protected with advanced encryption and trusted payment gateways.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description:
        "Get your orders delivered quickly with reliable shipping and real-time tracking.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description:
        "Our support team is always ready to help you with any concerns or questions.",
    },
    {
      icon: RefreshCcw,
      title: "Easy Returns",
      description:
        "Enjoy hassle-free returns and exchanges for a smoother shopping experience.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="mb-3 rounded-full border border-neutral-200 bg-white px-4 py-1 text-sm font-medium text-neutral-600 shadow-sm">
            Why Customers Love Us
          </span>

          <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
            Why Choose Us
          </h2>

          <p className="mt-4 max-w-2xl text-neutral-500">
            We focus on delivering premium products, exceptional customer
            service, and a seamless shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-6 inline-flex rounded-2xl bg-neutral-100 p-4 transition-colors duration-300 group-hover:bg-black group-hover:text-white">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-semibold text-neutral-900">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-relaxed text-neutral-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
