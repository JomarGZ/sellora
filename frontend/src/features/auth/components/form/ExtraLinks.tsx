import { ArrowLeft } from "lucide-react";
import type { ExtraLinksProps } from "../../types";

const ExtraLinks = ({
  questionText,
  linkText,
  linkHref,
  backText = "Back to store",
  backHref = "/shop",
}: ExtraLinksProps) => (
  <div className="space-y-3 text-center text-sm">
    <p className="text-muted-foreground">
      {questionText}{" "}
      <a
        href={linkHref}
        className="font-semibold text-primary hover:underline underline-offset-4"
      >
        {linkText}
      </a>
    </p>

    <a
      href={backHref}
      className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      {backText}
    </a>
  </div>
);

export default ExtraLinks;
