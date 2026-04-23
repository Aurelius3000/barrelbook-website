"use client";

import PhoneFrame from "@/components/PhoneFrame";

/**
 * StoryVideo — silent, looping product video for in-page "story" sections.
 *
 * Same behavior contract as HeroVideo (autoplay/muted/loop/playsInline,
 * preload="metadata", poster to avoid blank first frame). Wrapped in
 * <PhoneFrame> so it matches the hero video and the screenshot frames.
 */

type StoryVideoProps = {
  /** Path to the video (URL-encoded) */
  src: string;
  /** Path to a poster image (URL-encoded) */
  poster: string;
  /** Accessible description of what the video shows */
  ariaLabel: string;
  /** Intrinsic video width in pixels */
  width?: number;
  /** Intrinsic video height in pixels */
  height?: number;
  /** Max width of the video container */
  maxWidthClass?: string;
};

export default function StoryVideo({
  src,
  poster,
  ariaLabel,
  width = 886,
  height = 1920,
  maxWidthClass = "max-w-[280px] sm:max-w-[320px]",
}: StoryVideoProps) {
  return (
    <PhoneFrame
      ariaLabel={ariaLabel}
      className={maxWidthClass}
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
