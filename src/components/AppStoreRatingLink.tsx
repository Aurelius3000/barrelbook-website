import { Star } from "lucide-react";
import { APP_STORE_RATING_COUNT, APP_STORE_URL } from "@/lib/app-store";

type AppStoreRatingLinkProps = {
  className?: string;
};

export default function AppStoreRatingLink({
  className = "inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors",
}: AppStoreRatingLinkProps) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Read ${APP_STORE_RATING_COUNT} five-star App Store reviews`}
      className={className}
    >
      <span className="flex" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="w-4 h-4 text-[#D2691E] fill-current" />
        ))}
      </span>
      <span>
        <span className="font-semibold text-white">{APP_STORE_RATING_COUNT}</span> five-star ratings on the App Store
      </span>
    </a>
  );
}
