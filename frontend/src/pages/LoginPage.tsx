import ExtraLinks from "@/components/login/ExtraLinks";
import FooterLinks from "@/components/login/FooterLinks";
import HeroSection from "@/components/login/HeroSection";
import LoginForm from "@/components/login/LoginForm";
import Logo from "@/components/login/Logo";
import SocialLoginButtons from "@/components/login/SocialLoginButtons";
import TrustSection from "@/components/login/TrustSection";

const LoginPage = () => (
  <div className="flex min-h-screen">
    {/* Left — Form Side */}
    <div className="flex w-full flex-col justify-between bg-linear-to-b from-[hsl(var(--login-gradient-from))] to-[hsl(var(--login-gradient-to))] px-6 py-8 lg:w-1/2 lg:px-16 xl:px-24">
      <div className="mx-auto w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 lg:hidden">
          <Logo />
        </div>
        <div className="hidden lg:block mb-10">
          <Logo />
        </div>

        {/* Heading */}
        <div
          className="mb-8 animate-fade-up"
          style={{ animationDelay: "0.05s" }}
        >
          <h1
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ lineHeight: "1.2" }}
          >
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Form */}
        <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <LoginForm />
        </div>

        {/* Social */}
        <div
          className="mt-6 animate-fade-up"
          style={{ animationDelay: "0.25s" }}
        >
          <SocialLoginButtons />
        </div>

        {/* Extra links */}
        <div
          className="mt-8 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <ExtraLinks />
        </div>
      </div>

      {/* Footer */}
      <div
        className="mx-auto mt-12 w-full max-w-md space-y-4 animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        <TrustSection />
        <FooterLinks />
      </div>
    </div>

    {/* Right — Hero Image */}
    <div className="hidden lg:block lg:w-1/2">
      <HeroSection />
    </div>
  </div>
);

export default LoginPage;
