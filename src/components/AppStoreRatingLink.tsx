import { Star } from "lucide-react";
import {
  APP_STORE_RATING_DISPLAY_COUNT,
  APP_STORE_RATING_VALUE,
  APP_STORE_URL,
} from "@/lib/app-store";

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
      aria-label={`Read App Store reviews for BarrelBook, rated ${APP_STORE_RATING_VALUE} stars from ${APP_STORE_RATING_DISPLAY_COUNT} ratings`}
      className={className}
    >
      <span className="flex" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="w-4 h-4 text-[#D2691E] fill-current" />
        ))}
      </span>
      <span>
        <span className="font-semibold text-white">{APP_STORE_RATING_VALUE}</span> stars from{" "}
        <span className="font-semibold text-white">{APP_STORE_RATING_DISPLAY_COUNT}</span> App Store ratings
      </span>
    </a>
  );
}
