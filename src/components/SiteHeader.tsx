import Image from "next/image";
import AppStoreBadgeLink from "@/components/AppStoreBadgeLink";

export type SiteHeaderNavItem = {
  href: string;
  label: string;
};

const DEFAULT_NAV_ITEMS: SiteHeaderNavItem[] = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#download", label: "Download" },
];

type SiteHeaderProps = {
  navItems?: SiteHeaderNavItem[];
};

export default function SiteHeader({
  navItems = DEFAULT_NAV_ITEMS,
}: SiteHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#333333]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          <div className="relative flex items-center overflow-visible">
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
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-gray-300 hover:text-white transition-colors">
                {item.label}
              </a>
            ))}
          </nav>

          <AppStoreBadgeLink
            className="inline-flex items-center"
            width={140}
            height={46}
            imageClassName="h-9 w-auto"
            priority
          />
        </div>
      </div>
    </header>
  );
}
