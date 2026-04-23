"use client";

import PhoneFrame from "@/components/PhoneFrame";

/**
 * HeroVideo — silent, looping product video used in the hero section.
 *
 * Behavior matches Apple's own product-page pattern:
 *   - autoPlay + muted + loop + playsInline (required for iOS mobile Safari)
 *   - preload="metadata" to avoid blocking LCP
 *   - poster frame renders immediately so the slot is never blank
 *
 * The video is wrapped in <PhoneFrame> so it reads as an actual iPhone
 * silhouette — bezel, rounded inner screen, Dynamic Island pill — rather
 * than a plain rounded rectangle.
 */

type HeroVideoProps = {
  /** Path to the video (URL-encoded, e.g. /Bottle%20Scanning%202-14-26.mov) */
  src: string;
  /** Path to a poster image (URL-encoded) */
  poster: string;
  /** Accessible description of what the video shows */
  ariaLabel: string;
  /** Intrinsic pixel width of the source video (for aspect ratio) */
  width?: number;
  /** Intrinsic pixel height of the source video */
  height?: number;
  /** Extra classes for sizing / positioning in the page */
  className?: string;
};

export default function HeroVideo({
  src,
  poster,
  ariaLabel,
  width = 886,
  height = 1920,
  className = "",
}: HeroVideoProps) {
  return (
    <PhoneFrame
      ariaLabel={ariaLabel}
      className={className}
      width={width}
      height={height}
    >
      <video
        className="h-full w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={ariaLabel}
      />
    </PhoneFrame>
  );
}
