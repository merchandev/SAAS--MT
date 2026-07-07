import { permanentRedirect } from "next/navigation";

export default function FaqsRedirectPage() {
  permanentRedirect("/preguntas-frecuentes");
}
