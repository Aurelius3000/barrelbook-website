import { Star } from "lucide-react";
import {
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
      aria-label={`Open BarrelBook's ${APP_STORE_RATING_VALUE}-star App Store rating`}
      className={className}
    >
      <span className="inline-flex items-center gap-2" aria-hidden="true">
        <span className="text-xl font-semibold leading-none text-white">
          {APP_STORE_RATING_VALUE}
        </span>
        <span className="flex gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="h-5 w-5 fill-current text-[#D2691E]" />
          ))}
        </span>
      </span>
      <span>App Store rating</span>
    </a>
  );
}
