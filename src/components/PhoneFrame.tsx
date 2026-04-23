import type { ReactNode } from "react";

/**
 * PhoneFrame — pure-CSS iPhone silhouette that wraps any product media
 * (video, screenshot, or other node) in a consistent device mockup.
 *
 * Design contract:
 * - Outer `<figure>` provides the dark bezel, rounded outer corners, subtle
 *   border (`#1f1f1f` to match existing palette), and a soft shadow.
 * - Inner screen has its own rounded corners (slightly smaller radius to
 *   read as a bezel inset) and clips children with `overflow-hidden`.
 * - A Dynamic Island pill is absolutely positioned at the top center of
 *   the screen, marked `aria-hidden` since it's decorative.
 *
 * Children should fill the inner screen — videos use `object-cover` with
 * `h-full w-full`, images do the same.
 *
 * The outer width is controlled by the `className` prop (e.g.
 * `max-w-[300px] sm:max-w-[340px]`). The inner screen aspect ratio is
 * driven by `width` / `height` so the frame keeps its phone shape no
 * matter how narrow the container gets.
 */

type PhoneFrameProps = {
  /** What goes on the screen — a <video>, <Image>, <img>, etc. */
  children: ReactNode;
  /** Accessible label describing what the media shows. */
  ariaLabel?: string;
  /** Tailwind width classes for the outer figure (e.g. `max-w-[300px]`). */
  className?: string;
  /** Intrinsic media width — used to compute screen aspect ratio. */
  width?: number;
  /** Intrinsic media height — used to compute screen aspect ratio. */
  height?: number;
};

export default function PhoneFrame({
  children,
  ariaLabel,
  className = "",
  width = 886,
  height = 1920,
}: PhoneFrameProps) {
  return (
    <figure
      className={`relative mx-auto ${className}`}
      aria-label={ariaLabel}
    >
      {/* Outer bezel — dark ring around the screen, subtle border + shadow */}
      <div
        className="relative w-full rounded-[2.75rem] border border-[#1f1f1f] bg-black p-[6px] shadow-2xl ring-1 ring-white/5"
      >
        {/* Inner screen — clips children and holds the Dynamic Island */}
        <div
          className="relative w-full overflow-hidden rounded-[2.25rem] bg-black"
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          {children}

          {/* Dynamic Island — decorative pill centered at the top of the screen.
              Sized as a percentage of the screen width so it scales with the
              frame regardless of outer width. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[1.2%] -translate-x-1/2 h-[3%] w-[32%] max-h-[28px] min-h-[18px] rounded-full bg-black"
          />
        </div>
      </div>
    </figure>
  );
}
