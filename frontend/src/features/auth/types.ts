export interface ExtraLinksProps {
  questionText: string;
  linkText: string;
  linkHref: string;
  backText?: string;
  backHref?: string;
}

export interface ProfilePayload {
  first_name: string;
  last_name: string;
}
