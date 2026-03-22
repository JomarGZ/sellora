import FooterLinks from "@/features/auth/components/layout/FooterLinks";
import LoginForm from "@/features/auth/components/form/LoginForm";
import SocialLoginButtons from "@/features/auth/components/form/SocialLoginButtons";
import TrustSection from "@/features/auth/components/layout/TrustSection";
import AuthHeroSection from "../components/layout/AuthHeroSection";
import ExtraLinks from "../components/form/ExtraLinks";

const LoginPage = () => (
  <div className="flex min-h-screen">
    {/* Left — Form Side */}
    <div className="flex w-full flex-col justify-between bg-linear-to-b from-[hsl(var(--login-gradient-from))] to-[hsl(var(--login-gradient-to))] px-6 py-8 lg:w-1/2 lg:px-16 xl:px-24">
      <div className="mx-auto w-full max-w-md">
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
          <ExtraLinks
            questionText="Don't have an account?"
            linkText="Create one"
            linkHref="/register"
          />
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
      <AuthHeroSection />
    </div>
  </div>
);

export default LoginPage;
