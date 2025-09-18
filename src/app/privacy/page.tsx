import Link from "next/link";
import PrintButton from "@/components/PrintButton";

export const metadata = {
  title: "Privacy Policy | BarrelBook",
  description: "BarrelBook Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#333333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="text-sm text-gray-300 hover:text-white">← Back to Home</Link>
            <Link href="/" className="flex items-center gap-2 text-white">
              <img src="/BarrelBook%20Logo%20Large.png" alt="BarrelBook" className="h-6 w-auto" />
            </Link>
          </div>
        </div>
      </header>
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
            <nav className="space-x-2">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>/</span>
              <span className="text-gray-300">Privacy Policy</span>
            </nav>
            <PrintButton className="hidden sm:inline-flex items-center justify-center rounded-md border border-[#333333] px-3 py-1.5 text-gray-300 hover:text-white hover:bg-[#121212]" />
          </div>

          <h1 className="text-4xl md:text-5xl mb-2 tos">Privacy Policy for BarrelBook</h1>
          <p className="text-gray-400 mb-8">Last Updated: September 17, 2025</p>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <aside className="hidden lg:block lg:col-span-4">
              <nav className="sticky top-24 rounded-lg border border-[#333333] bg-[#0F0F0F] p-4 text-sm">
                <div className="mb-2 text-gray-400">On this page</div>
                <ul className="space-y-2">
                  <li><a className="text-gray-300 hover:text-white" href="#introduction">1. Introduction</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#information-we-collect">2. Information We Collect</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#how-we-use">3. How We Use Your Information</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#sharing-and-visibility">4. Sharing &amp; Visibility</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#compliance">5. Compliance and Legal Restrictions</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#rights-and-choices">6. Your Rights &amp; Choices</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#data-retention">7. Data Retention</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#security">8. Security</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#children">9. Children’s Privacy</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#changes">10. Changes to This Policy</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#contact">11. Contact Us</a></li>
                </ul>
              </nav>
            </aside>

            <article className="lg:col-span-8">
              <div className="prose prose-invert prose-lg sm:prose-xl leading-8 prose-headings:text-white prose-strong:text-white prose-a:text-[#D2691E] prose-a:underline prose-p:text-gray-200 prose-li:marker:text-gray-500 prose-h2:scroll-mt-28 prose-h2:mt-20 md:prose-h2:mt-28 prose-h2:pt-10 md:prose-h2:pt-12 prose-h2:mb-6 prose-h2:border-t prose-h2:border-white/10 prose-h3:mt-6 prose-p:mt-4 prose-ul:mt-4 prose-ol:mt-4 tos">
                <h2 id="introduction">1. Introduction</h2>
                <p>This Privacy Policy explains how BarrelBook (“we,” “our,” or “us”) collects, uses, and protects your information when you use our mobile app (“the App”).</p>
                <p>By using the App, you agree to the practices described here. BarrelBook is a collection and social sharing app only — it does not allow buying, selling, trading, or shipping of alcohol.</p>

                <h2 id="information-we-collect">2. Information We Collect</h2>
                <h3>Information You Provide</h3>
                <ul>
                  <li><strong>Account Information:</strong> Email address, password, display name, and age verification (21+).</li>
                  <li><strong>Bottle Data:</strong> Information you add or confirm about bottles (brand, release, proof, fill level, notes, etc.).</li>
                  <li><strong>Photos &amp; Media:</strong> Images you capture or upload of bottles.</li>
                </ul>
                <h3>Information We Collect Automatically</h3>
                <ul>
                  <li><strong>Device Information:</strong> Device type, operating system, and app version.</li>
                  <li><strong>Usage Data:</strong> Features used, frequency of scans, and interactions with your catalog.</li>
                  <li><strong>Log Data:</strong> Crash reports, error logs, and performance metrics.</li>
                </ul>
                <h3>Information from Third Parties</h3>
                <p><strong>AI Services:</strong> Photos you submit for scanning may be temporarily processed by trusted AI providers (e.g., OpenAI) to extract label data. Images and metadata are not retained beyond the processing period.</p>

                <h2 id="how-we-use">3. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul>
                  <li>Provide and improve the App’s features (cataloging, scanning, personal valuation).</li>
                  <li>Sync your bottle data and photos across devices.</li>
                  <li>Support offline use with background uploads when you reconnect.</li>
                  <li>Allow you to share selected bottles or collections with friends you choose.</li>
                  <li>Send important notices, such as security alerts or updates to Terms.</li>
                </ul>
                <p>We do not use your information to enable alcohol sales or trades.</p>

                <h2 id="sharing-and-visibility">4. Sharing &amp; Visibility</h2>
                <h3>Private by Default</h3>
                <p>Your catalog, photos, and notes are private unless you choose to share them.</p>
                <h3>Friend Sharing</h3>
                <p>If you share bottles or collections with friends, those users will see the shared photos, data, and notes. We cannot prevent recipients from saving or redistributing your content outside the App.</p>
                <h3>No Public Posting</h3>
                <p>Your catalog is never made publicly visible on the internet. Sharing is limited to the friends you select.</p>
                <h3>Third Parties</h3>
                <ul>
                  <li>We do not sell or rent your personal information.</li>
                  <li>Limited third-party services (e.g., AI providers, Firebase) process data only as needed to provide features. These providers are contractually bound to protect your information.</li>
                </ul>

                <h2 id="compliance">5. Compliance and Legal Restrictions</h2>
                <ul>
                  <li>BarrelBook is not a marketplace and does not allow buying, selling, trading, bartering, auctioning, or shipping of alcohol.</li>
                  <li>We prohibit and may remove any content that attempts to arrange unlicensed transactions.</li>
                  <li>Users are responsible for complying with all alcohol laws in their jurisdiction.</li>
                </ul>

                <h2 id="rights-and-choices">6. Your Rights &amp; Choices</h2>
                <ul>
                  <li><strong>Access &amp; Correction:</strong> You can view and edit your account and catalog entries at any time.</li>
                  <li><strong>Deletion:</strong> You may delete your account through the App. We will remove your personal information after a reasonable retention period.</li>
                  <li><strong>Sharing Controls:</strong> You decide whether to share bottles or collections and with whom.</li>
                </ul>

                <h2 id="data-retention">7. Data Retention</h2>
                <ul>
                  <li><strong>Bottle Photos &amp; Data:</strong> Stored as long as your account is active.</li>
                  <li><strong>Shared Content:</strong> Remains accessible to friends you shared with unless you delete it or revoke access.</li>
                  <li><strong>AI Processing:</strong> Photos sent for AI extraction are retained for ≤30 days for quality assurance and are never used to train AI models.</li>
                </ul>

                <h2 id="security">8. Security</h2>
                <p>We use industry-standard safeguards to protect your data:</p>
                <ul>
                  <li><strong>In Transit:</strong> TLS 1.3 encryption</li>
                  <li><strong>At Rest:</strong> AES-256 encryption</li>
                  <li><strong>Storage:</strong> Data and images stored in U.S.-based regions only</li>
                </ul>
                <p>No system is completely secure; we cannot guarantee absolute protection.</p>

                <h2 id="children">9. Children’s Privacy</h2>
                <p>The App is not intended for anyone under the legal drinking age in their jurisdiction (21+ in Georgia and most U.S. states). We do not knowingly collect information from underage users.</p>

                <h2 id="changes">10. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. If material changes are made, we will notify you through:</p>
                <ul>
                  <li>In-app notifications, and</li>
                  <li>Email (if you have a registered account).</li>
                </ul>

                <h2 id="contact">11. Contact Us</h2>
                <p>If you have questions about this Privacy Policy, please contact us:</p>
                <p><strong>Email:</strong> <a href="mailto:info@barrelbook.app">info@barrelbook.app</a><br />
                <strong>Developer:</strong> BarrelBook</p>
              </div>

              <div className="mt-10">
                <Link href="/" className="inline-flex items-center justify-center rounded-md bg-[#D2691E] text-white px-4 py-2 hover:bg-[#D2691E]/90">
                  Back to Home
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}


