import ExtraLinks from "@/features/auth/components/form/ExtraLinks";
import RegisterForm from "@/features/auth/components/form/RegisterForm";
import SocialRegisterButtons from "@/features/auth/components/form/SocialRegisterButtons";
import AuthHeroSection from "../components/layout/AuthHeroSection";
import TrustSection from "../components/layout/TrustSection";

const RegisterPage = () => (
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
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Join us and start shopping your favorite products today
          </p>
        </div>

        {/* Form */}
        <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <RegisterForm />
        </div>

        {/* Social */}
        <div
          className="mt-6 animate-fade-up"
          style={{ animationDelay: "0.25s" }}
        >
          <SocialRegisterButtons />
        </div>

        {/* Extra links */}
        <div
          className="mt-8 animate-fade-up"
          style={{ animationDelay: "0.3s" }}
        >
          <ExtraLinks
            questionText="Already have an account?"
            linkText="Sign in"
            linkHref="/login"
          />
        </div>
      </div>

      {/* Footer */}
      <div
        className="mx-auto mt-12 w-full max-w-md space-y-4 animate-fade-in"
        style={{ animationDelay: "0.4s" }}
      >
        <TrustSection />
      </div>
    </div>

    {/* Right — Hero Image */}
    <div className="hidden lg:block lg:w-1/2">
      <AuthHeroSection />
    </div>
  </div>
);

export default RegisterPage;
