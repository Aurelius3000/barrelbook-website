"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ANDROID_EARLY_ACCESS_FORM_URL,
  type AndroidInterestPlacement,
} from "@/lib/android-interest";
import { trackAndroidInterest } from "@/lib/cta-analytics";

type AndroidInterestFormProps = {
  placement: AndroidInterestPlacement;
};

export default function AndroidInterestForm({
  placement,
}: AndroidInterestFormProps) {
  useEffect(() => {
    trackAndroidInterest("android_interest_form_view", { placement });
  }, [placement]);

  return (
    <div className="space-y-4">
      <a
        href={ANDROID_EARLY_ACCESS_FORM_URL}
        onClick={() =>
          trackAndroidInterest("android_interest_form_opened", { placement })
        }
        className="block w-full rounded-xl bg-[#D2691E] px-5 py-3 text-center font-medium text-white transition-colors hover:bg-[#C05E17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2691E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
      >
        Continue to Google Form
      </a>
      <p className="text-center text-sm text-gray-400">
        You&apos;ll continue in Google Forms to provide your email, confirm 21+, and
        consent before joining the list. See the{" "}
        <Link href="/privacy" className="text-[#D2691E] underline hover:text-[#E38A49]">
          Privacy Policy
        </Link>.
      </p>
    </div>
  );
}
