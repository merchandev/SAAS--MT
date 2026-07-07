import { permanentRedirect } from "next/navigation";

export default function ToursRedirectPage() {
  permanentRedirect("/tours-privados");
}
