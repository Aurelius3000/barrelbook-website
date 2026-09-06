"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import PlatformDownloadCtas from "@/components/PlatformDownloadCtas";

export type SiteHeaderNavItem = {
  href: string;
  label: string;
};

const DEFAULT_NAV_ITEMS: SiteHeaderNavItem[] = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "/releases/kbf-2026", label: "KBF 2026" },
  { href: "#download", label: "Download" },
];

type SiteHeaderProps = {
  navItems?: SiteHeaderNavItem[];
  showAppStoreBadge?: boolean;
  showMobileMenu?: boolean;
};

export default function SiteHeader({
  navItems = DEFAULT_NAV_ITEMS,
  showAppStoreBadge = true,
  showMobileMenu = false,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#333333]"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          event.preventDefault();
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setMenuOpen(false);
        }
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          <div className={`relative flex overflow-visible ${showMobileMenu ? "flex-col items-start sm:flex-row sm:items-center sm:gap-6 lg:gap-0" : "items-center"}`}>
            <div className="h-8 md:h-10 lg:h-12">
              <Image
                src="/BarrelBook%20Logo%20Large.png"
                alt="BarrelBook logo"
                width={280}
                height={96}
                className="h-full w-auto origin-left scale-[1.125]"
                priority
              />
            </div>
            {showMobileMenu ? (
              <button
                ref={menuButtonRef}
                type="button"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md px-2 text-sm text-gray-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E38A49] lg:hidden"
              >
                {menuOpen ? <X aria-hidden="true" className="h-4 w-4" /> : <Menu aria-hidden="true" className="h-4 w-4" />}
                Menu
              </button>
            ) : null}
          </div>

          {showMobileMenu ? (
            <div
              id={menuId}
              hidden={!menuOpen}
              className="absolute inset-x-0 top-full border-b border-[#333333] bg-[#0A0A0A] shadow-xl lg:hidden"
            >
              <nav aria-label="Main" className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      setMenuOpen(false);
                      menuButtonRef.current?.focus({ preventScroll: true });
                    }}
                    className="flex min-h-[44px] items-center rounded-md px-3 text-gray-300 hover:bg-[#1A1A1A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E38A49]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          ) : null}

          <nav aria-label="Main" className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="rounded-sm text-gray-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E38A49] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0A0A]">
                {item.label}
              </a>
            ))}
          </nav>

          {showAppStoreBadge ? (
            <PlatformDownloadCtas
              variant="header"
              analytics={{ location: "header" }}
              priority
            />
          ) : null}
        </div>
      </div>
    </header>
  );
}
