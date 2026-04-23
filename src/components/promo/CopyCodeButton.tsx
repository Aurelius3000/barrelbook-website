"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyCodeButtonProps {
  code: string;
  buttonClassName?: string;
  containerClassName?: string;
  messageClassName?: string;
}

export function CopyCodeButton({
  code,
  buttonClassName,
  containerClassName,
  messageClassName,
}: CopyCodeButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timeoutRef = useRef<number | null>(null);

  async function handleCopy() {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }

    timeoutRef.current = window.setTimeout(() => {
      setStatus("idle");
    }, 2000);
  }

  return (
    <div className={`flex flex-col items-end gap-2 ${containerClassName ?? ""}`}>
      <Button
        type="button"
        onClick={handleCopy}
        className={`h-11 rounded-full bg-[#D2691E] px-5 text-sm text-white hover:bg-[#B85714] ${buttonClassName ?? ""}`}
      >
        {status === "copied" ? (
          <Check className="mr-2 h-4 w-4" />
        ) : (
          <Copy className="mr-2 h-4 w-4" />
        )}
        {status === "copied" ? "Copied" : "Copy code"}
      </Button>
      {status === "failed" ? (
        <span className={`text-xs text-[#FFB020] ${messageClassName ?? ""}`}>
          Copy failed. Select the code manually.
        </span>
      ) : null}
    </div>
  );
}
