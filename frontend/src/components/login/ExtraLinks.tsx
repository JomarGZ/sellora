import { ArrowLeft } from "lucide-react";

const ExtraLinks = () => (
  <div className="space-y-3 text-center text-sm">
    <p className="text-muted-foreground">
      Don't have an account?{" "}
      <a
        href="#"
        className="font-semibold text-primary hover:underline underline-offset-4"
      >
        Create one
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
