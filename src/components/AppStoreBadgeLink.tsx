import Image from "next/image";
import { APP_STORE_URL } from "@/lib/app-store";

type AppStoreBadgeLinkProps = {
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  ariaLabel?: string;
};

export default function AppStoreBadgeLink({
  className = "inline-flex items-center",
  imageClassName,
  width = 180,
  height = 60,
  priority = false,
  ariaLabel = "Download on the App Store",
}: AppStoreBadgeLinkProps) {
  return (
    <a
      href={APP_STORE_URL}
      aria-label={ariaLabel}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="/badges/app-store.svg"
        alt="Download on the App Store"
        width={width}
        height={height}
        priority={priority}
        className={imageClassName}
      />
    </a>
  );
}
