"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCustomerSuggestionAction,
  submitCustomerReviewAction,
  updateCustomerProfileAction,
} from "@/modules/customers/customer.actions";

type ProfileFormProps = {
  customer: {
    fullName: string;
    email: string;
    phone: string | null;
    country: string | null;
    preferredLanguage: string | null;
  };
};

type ReviewBooking = {
  id: string;
  publicCode: string;
  serviceDate: string;
  serviceTime: string;
  route: string;
};

export function CustomerProfileForm({ customer }: ProfileFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await updateCustomerProfileAction({
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      country: String(formData.get("country") ?? ""),
      preferredLanguage: String(formData.get("preferredLanguage") ?? "es") as "es" | "en" | "de" | "fr",
    });

    setMessage(result?.error ?? "Perfil actualizado");
    if (!result?.error) router.refresh();
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {message && <p className="md:col-span-2 text-sm font-medium text-gray-600">{message}</p>}

      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase text-gray-500">Nombre</span>
        <Input name="fullName" defaultValue={customer.fullName} required />
      </label>

      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase text-gray-500">Correo electrónico</span>
        <Input value={customer.email} disabled />
      </label>

      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase text-gray-500">Teléfono</span>
        <Input name="phone" defaultValue={customer.phone ?? ""} required />
      </label>

      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase text-gray-500">País</span>
        <Input name="country" defaultValue={customer.country ?? ""} required />
      </label>

      <label className="space-y-1">
        <span className="text-xs font-semibold uppercase text-gray-500">Idioma</span>
        <select
          name="preferredLanguage"
          defaultValue={customer.preferredLanguage ?? "es"}
          className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
        </select>
      </label>

      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : "Guardar perfil"}
        </Button>
      </div>
    </form>
  );
}

export function CustomerReviewForm({ bookings }: { bookings: ReviewBooking[] }) {
  const router = useRouter();
  const [bookingId, setBookingId] = useState(bookings[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await submitCustomerReviewAction({
      bookingId,
      rating: Number(formData.get("rating")),
      comment: String(formData.get("comment") ?? ""),
    });

    setMessage(result?.error ?? "Calificación enviada para revisión interna");
    if (!result?.error) router.refresh();
    setPending(false);
  }

  if (bookings.length === 0) {
    return <p className="text-sm text-gray-500">No hay traslados completados pendientes de calificar.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {message && <p className="text-sm font-medium text-gray-600">{message}</p>}

      <label className="block space-y-1">
        <span className="text-xs font-semibold uppercase text-gray-500">Traslado validado</span>
        <select
          value={bookingId}
          onChange={(event) => setBookingId(event.target.value)}
          className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
        >
          {bookings.map((booking) => (
            <option key={booking.id} value={booking.id}>
              {booking.publicCode} - {booking.serviceDate} {booking.serviceTime}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-semibold uppercase text-gray-500">Puntuación</span>
        <select name="rating" defaultValue="5" className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm">
          <option value="5">5 - Excelente</option>
          <option value="4">4 - Muy bueno</option>
          <option value="3">3 - Correcto</option>
          <option value="2">2 - Mejorable</option>
          <option value="1">1 - Deficiente</option>
        </select>
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-semibold uppercase text-gray-500">Comentario</span>
        <textarea
          name="comment"
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Cuéntanos cómo fue el servicio"
        />
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? "Enviando..." : "Enviar calificación"}
      </Button>
    </form>
  );
}

export function CustomerSuggestionForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = await createCustomerSuggestionAction({
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    });

    setMessage(result?.error ?? "Sugerencia recibida");
    if (!result?.error) {
      form.reset();
      router.refresh();
    }
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {message && <p className="text-sm font-medium text-gray-600">{message}</p>}

      <label className="block space-y-1">
        <span className="text-xs font-semibold uppercase text-gray-500">Asunto</span>
        <Input name="subject" required minLength={3} maxLength={120} />
      </label>

      <label className="block space-y-1">
        <span className="text-xs font-semibold uppercase text-gray-500">Mensaje</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </label>

      <Button type="submit" disabled={pending}>
        {pending ? "Enviando..." : "Enviar sugerencia"}
      </Button>
    </form>
  );
}
