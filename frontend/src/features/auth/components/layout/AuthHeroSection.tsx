const AuthHeroSection = () => (
  <div className="relative hidden h-full min-h-screen flex-col justify-between overflow-hidden lg:flex">
    <img
      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
      alt="Fashion store interior"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-linear-to-t from-[hsl(var(--login-hero-overlay)/0.85)] via-[hsl(var(--login-hero-overlay)/0.4)] to-[hsl(var(--login-hero-overlay)/0.2)]" />

    <div className="relative z-10 p-8">
      <div className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20 backdrop-blur-sm">
          <span className="text-lg font-bold text-primary-foreground">S</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-primary-foreground">
          Sellora
        </span>
      </div>
    </div>

    <div className="relative z-10 p-8 pb-12">
      <blockquote className="mb-4 text-lg leading-relaxed text-primary-foreground/90">
        "The checkout experience was so smooth — I had my order in under two
        minutes. Genuinely the best online store I've used."
      </blockquote>
      <div className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80"
          alt="Maya Richardson"
          className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-foreground/30"
        />
        <div>
          <p className="text-sm font-semibold text-primary-foreground">
            Maya Richardson
          </p>
          <p className="text-xs text-primary-foreground/60">
            Returning customer since 2023
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default AuthHeroSection;
