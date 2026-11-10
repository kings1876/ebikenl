import React, { useState } from 'react';
import { TRUSTPILOT_OVERALL_SCORE, SITE_TRUSTPILOT_REVIEWS } from '../data/ebikes';
import { CheckCircle, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';

interface TrustpilotWidgetProps {
  variant?: 'banner' | 'full' | 'compact';
}

export const TrustpilotWidget: React.FC<TrustpilotWidgetProps> = ({ variant = 'full' }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % SITE_TRUSTPILOT_REVIEWS.length);
  };

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + SITE_TRUSTPILOT_REVIEWS.length) % SITE_TRUSTPILOT_REVIEWS.length);
  };

  // Trustpilot Star Icon (official 5-star green box)
  const renderStars = (rating: number = 5, size: 'sm' | 'md' | 'lg' = 'md') => {
    const boxSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`${boxSize} flex items-center justify-center rounded-[2px] ${
              star <= rating ? 'bg-[#00b67a]' : 'bg-slate-200'
            }`}
          >
            <svg
              className="w-3/4 h-3/4 text-white fill-current"
              viewBox="0 0 24 24"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
        ))}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2.5 text-xs text-slate-700">
        <span className="font-semibold text-slate-900">Trustpilot</span>
        {renderStars(5, 'sm')}
        <span className="font-bold tabular-nums">4.8</span>
        <span className="text-slate-500">· 1.428 reviews</span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="bg-slate-900 text-white py-3 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight">Trustpilot</span>
              {renderStars(5, 'sm')}
            </div>
            <span className="text-slate-300">
              Score <strong className="text-white">4.8 / 5</strong> gebaseerd op{' '}
              <strong className="text-white">1.428 geverifieerde reviews</strong>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-slate-300">
            <span>✓ 100% Rijklaar bezorgd aan huis</span>
            <span>✓ Betaal veilig met iDEAL, SEPA & Crypto</span>
            <span>✓ Tot 10 jaar fabrieksgarantie</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#00b67a] uppercase mb-1">
              <span>Geverifieerde Klantbeoordelingen</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Wat onze klanten zeggen op Trustpilot
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Echte ervaringen van e-bike rijders in heel Nederland over onze service, levering en betaling.
            </p>
          </div>

          {/* TrustScore Summary Card */}
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base">Trustpilot</span>
                {renderStars(5, 'sm')}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                TrustScore <strong className="text-slate-900">4.8</strong> | {TRUSTPILOT_OVERALL_SCORE.totalReviews} reviews
              </div>
            </div>
            <div className="pl-3 border-l border-slate-200 text-right">
              <span className="inline-block text-xs font-bold text-[#00b67a] bg-emerald-50 px-2 py-0.5 rounded">
                Uitstekend
              </span>
            </div>
          </div>
        </div>

        {/* Carousel / Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SITE_TRUSTPILOT_REVIEWS.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="flex flex-col justify-between p-5 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  {renderStars(review.rating, 'sm')}
                  <span className="text-xs text-slate-400">{review.date}</span>
                </div>

                <h3 className="font-semibold text-slate-900 text-sm mb-2 leading-snug">
                  "{review.title}"
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {review.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-medium text-slate-900">{review.author}</div>
                  <div className="text-slate-500">{review.city}</div>
                </div>
                {review.verified && (
                  <div className="flex items-center gap-1 text-[#00b67a] font-medium text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Geverifieerd</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Trust Indicators */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4 text-slate-400" />
            <span>89% van onze klanten geeft ons de maximale 5-sterren waardering</span>
          </div>
          <div className="flex items-center gap-6">
            <span>✓ Onafhankelijk getoetst door Trustpilot</span>
            <span>✓ Transparante garantievoorwaarden</span>
            <span>✓ Eigen bezorgservice in héél Nederland</span>
          </div>
        </div>
      </div>
    </section>
  );
};
