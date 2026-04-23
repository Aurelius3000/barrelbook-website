import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A] border-t border-[#333333]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="relative flex items-center mb-4 md:mb-0 overflow-visible">
            <div className="h-8 md:h-10 lg:h-12">
              <Image
                src="/BarrelBook%20Logo%20Large.png"
                alt="BarrelBook logo"
                width={280}
                height={96}
                className="h-full w-auto origin-left scale-[1.125]"
              />
            </div>
          </div>

          <div className="flex gap-6 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

        <div className="flex justify-center md:justify-end mt-6">
          <div className="flex items-center gap-5 text-gray-400">
            <a
              href="https://www.instagram.com/barrelbook_app/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/barrelbook_app"
              aria-label="X (Twitter)"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/share/19tKbWea4A/?mibextid=wwXIfr"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-[#333333] mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2025–{new Date().getFullYear()} BarrelBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
