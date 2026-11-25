import React from 'react';
import { Star } from 'lucide-react';
import { TrailReview } from '../types/trail';

interface ReviewCardProps {
  review: TrailReview;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <article className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[18px] p-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h4 className="font-display text-sm font-bold text-[#242923]">{review.author}</h4>
          <p className="text-xs text-[#858B80]">
            {review.date} · {review.conditions}
          </p>
        </div>
        <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#242923] tabular-nums">
          <Star className="w-3.5 h-3.5 text-[#D9A85D] fill-[#D9A85D]" aria-hidden="true" />
          <span>{review.rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-sm text-[#242923]/90 leading-relaxed">{review.comment}</p>
    </article>
  );
};
