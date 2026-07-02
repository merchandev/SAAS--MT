import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  initial: string;
  date: string;
  rating: number;
  description: string;
  color: string;
}

const reviews: Review[] = [
  {
    id: '1',
    author: 'GetYourGuide traveler – Canada',
    initial: 'G',
    color: 'bg-blue-500',
    date: 'Noviembre 29, 2025',
    rating: 5,
    description: 'Driver was good and patient waiting for us and taking to destination fast.'
  },
  {
    id: '2',
    author: 'GetYourGuide traveler – USA',
    initial: 'G',
    color: 'bg-red-500',
    date: 'Diciembre 5, 2025',
    rating: 5,
    description: 'Excelente servicio. El conductor nos estaba esperando en el aeropuerto con un cartel. El vehículo era un Mercedes muy cómodo.'
  },
  {
    id: '3',
    author: 'GetYourGuide traveler – UK',
    initial: 'G',
    color: 'bg-emerald-500',
    date: 'Enero 12, 2026',
    rating: 5,
    description: 'Muy profesional y puntual. Hizo que nuestra llegada a Barcelona fuera completamente libre de estrés.'
  },
  {
    id: '4',
    author: 'GetYourGuide traveler – Germany',
    initial: 'G',
    color: 'bg-purple-500',
    date: 'Febrero 20, 2026',
    rating: 4,
    description: 'Excelente comunicación previa y viaje tranquilo a nuestro hotel. Todo perfecto.'
  },
  {
    id: '5',
    author: 'GetYourGuide traveler – Australia',
    initial: 'G',
    color: 'bg-amber-500',
    date: 'Marzo 10, 2026',
    rating: 5,
    description: 'Traslado perfecto desde el puerto de cruceros hasta el aeropuerto. Muy recomendable para familias.'
  }
];

// Duplicate base reviews to make the track longer
const baseReviews = [...reviews, ...reviews];
// Duplicate again for the seamless marquee loop (translation -50%)
const marqueeReviews = [...baseReviews, ...baseReviews];

export default function GygReviews() {
  return (
    <section className="overflow-hidden bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-12 text-center">
        <p className="mb-3 text-sm font-semibold uppercase text-[#D4AF37]">Experiencias Reales</p>
        <h2 className="text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
          Lo que dicen nuestros clientes
        </h2>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Cientos de viajeros confían en nosotros para sus traslados en Barcelona. Reseñas verificadas por GetYourGuide.
        </p>
      </div>
      
      <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] py-4">
        <div className="flex w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
          {marqueeReviews.map((review, i) => (
            <div 
              key={`${review.id}-${i}`}
              className="mx-3 flex w-80 shrink-0 flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]"
            >
              <div className="mb-4 flex items-center gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${review.color}`}>
                  {review.initial}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{review.author}</h3>
                  <p className="text-xs text-gray-500">{review.date} - Reserva verificada</p>
                </div>
              </div>
              
              <div className="mb-3 flex text-[#D4AF37]">
                {[...Array(5)].map((_, index) => (
                  <Star 
                    key={index} 
                    className={`h-4 w-4 ${index < review.rating ? 'fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              
              <div className="relative flex-1">
                <p className="text-sm leading-relaxed text-gray-600 line-clamp-4">
                  "{review.description}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
