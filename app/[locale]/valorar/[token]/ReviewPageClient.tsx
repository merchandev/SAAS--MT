"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  bookingId: string;
  publicCode: string;
  customerName: string;
  serviceDate: string;
  originAddress: string;
  destinationAddress: string;
  alreadyReviewed: boolean;
  token: string;
}

export default function ReviewPageClient({
  bookingId,
  publicCode,
  customerName,
  serviceDate,
  originAddress,
  destinationAddress,
  alreadyReviewed,
  token,
}: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (alreadyReviewed) {
    return <ThankYouCard message="Ya has valorado este traslado. ¡Muchas gracias por tu opinión!" />;
  }

  if (status === "success") {
    return <ThankYouCard message="¡Gracias por tu valoración! Nos ayuda mucho a seguir mejorando." />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setErrorMsg("Por favor, selecciona una puntuación.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment, token }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al enviar la valoración.");
      }
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Ha ocurrido un error. Por favor, inténtalo de nuevo.");
      setStatus("idle");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[#D4AF37] text-xs font-bold tracking-[4px] uppercase mb-3">
            TRANSFERS IN BARCELONA
          </p>
          <h1 className="text-3xl font-bold text-white mb-2">
            ¿Cómo fue tu traslado?
          </h1>
          <p className="text-gray-400 text-sm">
            Hola <span className="text-white font-medium">{customerName}</span>, tu opinión es muy valiosa para nosotros.
          </p>
        </div>

        {/* Trip summary */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reserva #{publicCode}</p>
              <p className="text-white text-sm font-medium truncate">{originAddress}</p>
              <div className="flex items-center gap-2 my-1">
                <div className="flex-1 border-t border-dashed border-gray-700" />
                <span className="text-[#D4AF37] text-xs">→</span>
                <div className="flex-1 border-t border-dashed border-gray-700" />
              </div>
              <p className="text-white text-sm font-medium truncate">{destinationAddress}</p>
              <p className="text-gray-500 text-xs mt-1">{serviceDate}</p>
            </div>
          </div>
        </div>

        {/* Review form */}
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-6">
          {/* Stars */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">Selecciona tu puntuación</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-110 focus:outline-none"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-[#D4AF37] text-[#D4AF37]"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-[#D4AF37] text-sm font-medium mt-2">
                {["", "Deficiente", "Mejorable", "Correcto", "Muy bueno", "¡Excelente!"][rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-gray-400 text-sm mb-2" htmlFor="review-comment">
              Cuéntanos más <span className="text-gray-600">(opcional)</span>
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/50 resize-none transition-colors"
              placeholder="¿Qué fue lo que más te gustó? ¿Hay algo que podríamos mejorar?"
            />
            <p className="text-gray-600 text-xs text-right mt-1">{comment.length}/1000</p>
          </div>

          {errorMsg && (
            <p className="text-red-400 text-sm text-center">{errorMsg}</p>
          )}

          <Button
            type="submit"
            disabled={status === "loading" || rating === 0}
            className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {status === "loading" ? "Enviando..." : "Enviar valoración"}
          </Button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          © {new Date().getFullYear()} Transfers in Barcelona · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}

function ThankYouCard({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⭐</div>
        <h1 className="text-3xl font-bold text-white mb-4">¡Gracias!</h1>
        <p className="text-gray-400 leading-relaxed">{message}</p>
        <p className="text-[#D4AF37] text-xs font-bold tracking-[4px] uppercase mt-8">
          TRANSFERS IN BARCELONA
        </p>
      </div>
    </div>
  );
}
