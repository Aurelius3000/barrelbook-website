import { Star } from "lucide-react";

export type ReviewCardData = {
  title: string;
  text: string;
  author: string;
  date: string;
  version: string;
};

type ReviewCardProps = {
  review: ReviewCardData;
  featured?: boolean;
  className?: string;
};

export default function ReviewCard({
  review,
  featured = false,
  className = "",
}: ReviewCardProps) {
  return (
    <div
      className={`border border-[#333333] bg-[#0A0A0A] flex flex-col ${
        featured ? "rounded-2xl p-8" : "rounded-xl p-6"
      } ${className}`.trim()}
    >
      <div className="flex mb-3">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="w-4 h-4 text-[#D2691E] fill-current" />
        ))}
      </div>
      <h3 className={`text-white font-semibold mb-2 ${featured ? "text-lg" : "text-base"}`}>
        {review.title}
      </h3>
      <p className={`text-gray-300 flex-1 ${featured ? "text-base leading-relaxed" : "text-base"}`}>
        {review.text}
      </p>
      <div className="flex items-center justify-between gap-4 text-xs text-gray-500 mt-5">
        <span>{review.author}</span>
        <span>{review.date} · v{review.version}</span>
      </div>
    </div>
  );
}
