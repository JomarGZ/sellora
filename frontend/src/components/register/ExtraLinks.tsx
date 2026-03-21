import { ArrowLeft } from "lucide-react";

const ExtraLinks = () => (
  <div className="space-y-3 text-center text-sm">
    <p className="text-muted-foreground">
      Already have an account?{" "}
      <a
        href="#"
        className="font-semibold text-primary hover:underline underline-offset-4"
      >
        Sign in
      </a>
    </p>

    <a
      href="#"
      className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to store
    </a>
  </div>
);

export default ExtraLinks;
