import Link from "next/link";
import PrintButton from "@/components/PrintButton";

export const metadata = {
  title: "Terms of Service | BarrelBook",
  description: "BarrelBook Terms of Service",
};

export default function TermsPage() {
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
              <span className="text-gray-300">Terms of Service</span>
            </nav>
            <PrintButton className="hidden sm:inline-flex items-center justify-center rounded-md border border-[#333333] px-3 py-1.5 text-gray-300 hover:text-white hover:bg-[#121212]" />
          </div>

          <h1 className="text-4xl md:text-5xl mb-2 tos">Terms of Service for BarrelBook</h1>
          <p className="text-gray-400 mb-8">Last Updated: September 17, 2025</p>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <aside className="hidden lg:block lg:col-span-4">
              <nav className="sticky top-24 rounded-lg border border-[#333333] bg-[#0F0F0F] p-4 text-sm">
                <div className="mb-2 text-gray-400">On this page</div>
                <ul className="space-y-2">
                  <li><a className="text-gray-300 hover:text-white" href="#acceptance-of-terms">1. Acceptance of Terms</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#description-of-service">2. Description of Service</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#eligibility">3. Eligibility</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#user-accounts">4. User Accounts</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#acceptable-use">5. Acceptable Use</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#intellectual-property">6. Intellectual Property</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#user-generated-content-and-sharing">7. User-Generated Content &amp; Sharing</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#ai-and-data-processing">8. AI and Data Processing</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#privacy">9. Privacy</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#legal-and-compliance-disclaimers">10. Legal &amp; Compliance</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#no-warranties">11. No Warranties</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#limitation-of-liability">12. Limitation of Liability</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#indemnification">13. Indemnification</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#modifications">14. Modifications</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#termination">15. Termination</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#governing-law">16. Governing Law</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#contact-information">17. Contact</a></li>
                </ul>
              </nav>
            </aside>

            <article className="lg:col-span-8">
              <div className="prose prose-invert prose-lg sm:prose-xl leading-8 prose-headings:text-white prose-strong:text-white prose-a:text-[#D2691E] prose-a:underline prose-p:text-gray-200 prose-li:marker:text-gray-500 prose-li:my-2 prose-h2:scroll-mt-28 prose-h2:mt-20 md:prose-h2:mt-28 prose-h2:pt-10 md:prose-h2:pt-12 prose-h2:mb-6 prose-h2:border-t prose-h2:border-white/10 prose-h3:mt-6 prose-p:mt-4 prose-ul:mt-4 prose-ol:mt-4 tos">
                <h2 id="acceptance-of-terms">1. Acceptance of Terms</h2>
                <p>By downloading, installing, or using BarrelBook (the “App”), you agree to these Terms of Service (“Terms”). If you do not agree, do not use the App.</p>

                <h2 id="description-of-service">2. Description of Service</h2>
                <p>BarrelBook is a whiskey collection manager. You can:</p>
                <ul className="bullet">
                  <li>Catalog your bottles</li>
                  <li>Use AI to scan and identify labels</li>
                  <li>Track estimated values and personal notes</li>
                  <li>Save photos and tasting impressions</li>
                  <li>Share selected bottles or collections with friends you choose</li>
                </ul>
                <aside className="callout callout--warning" role="note" aria-label="Important">
                  <div className="callout__icon" aria-hidden="true">!</div>
                  <div className="callout__content">
                    <div className="callout__label">Important</div>
                    <p>BarrelBook is <strong>not</strong> a marketplace. The App does not allow buying, selling, trading, bartering, auctioning, raffling, or shipping alcohol.</p>
                  </div>
                </aside>

                <h2 id="eligibility">3. Eligibility</h2>
                <ul>
                  <li>You must be at least <strong>21 years old</strong> to use BarrelBook.</li>
                  <li>By using the App, you represent and warrant that you are 21 years of age or older.</li>
                </ul>

                <h2 id="user-accounts">4. User Accounts</h2>
                <h3>Account Types</h3>
                <ul>
                  <li>Guest Account: Limited functionality, data may not persist.</li>
                  <li>Registered Account: Full features with data sync and backup.</li>
                </ul>
                <h3>Your Responsibilities</h3>
                <ul>
                  <li>Maintain confidentiality of your account.</li>
                  <li>Accept responsibility for all activity under your account.</li>
                  <li>Notify us immediately of unauthorized use.</li>
                </ul>

                <h2 id="acceptable-use">5. Acceptable Use</h2>
                <h3>You May:</h3>
                <ul>
                  <li>Use the App for lawful, personal, non-commercial purposes.</li>
                  <li>Share your collection with friends you choose.</li>
                  <li>Export your own data for personal reference.</li>
                </ul>
                <h3>You May Not:</h3>
                <ul>
                  <li>Use the App for any illegal or regulated alcohol activity, including:</li>
                </ul>
                <ul>
                  <li>Buying, selling, trading, bartering, or otherwise transferring alcohol.</li>
                  <li>Coordinating or arranging shipments of alcohol.</li>
                  <li>Posting offers to purchase, solicitations to trade, or raffle/auction postings.</li>
                </ul>
                <ul>
                  <li>Upload content that encourages or enables unlicensed alcohol transactions.</li>
                  <li>Promote excessive or irresponsible alcohol consumption.</li>
                  <li>Scrape or harvest data from other users.</li>
                  <li>Reverse engineer or hack the App.</li>
                </ul>

                <h2 id="intellectual-property">6. Intellectual Property</h2>
                <h3>Our Content</h3>
                <ul>
                  <li>The BarrelBook name, logo, and design are trademarks of BarrelBook.</li>
                  <li>The App’s code and design are protected by copyright.</li>
                  <li>AI models and algorithms are proprietary technology.</li>
                </ul>
                <h3>Your Content</h3>
                <ul>
                  <li>You retain ownership of photos, notes, and data you upload.</li>
                  <li>You grant us a limited license to host, store, process, and share your content solely to provide the App’s features.</li>
                  <li>You are responsible for ensuring you have rights to any content you upload.</li>
                </ul>
                <h3>Whiskey Brand Information</h3>
                <ul>
                  <li>Brand names and product information belong to their respective owners.</li>
                  <li>We display this information only for identification purposes.</li>
                </ul>

                <h2 id="user-generated-content-and-sharing">7. User-Generated Content &amp; Sharing</h2>
                <ul>
                  <li>By uploading content, you confirm you have the rights to it.</li>
                  <li>You agree not to upload or share content that:</li>
                </ul>
                <ul>
                  <li>Infringes on intellectual property rights.</li>
                  <li>Contains offensive, obscene, or illegal material.</li>
                  <li>Promotes, arranges, or solicits alcohol sales, trades, raffles, or shipments.</li>
                </ul>
                <p>We may remove content that violates these Terms. Users can report inappropriate or unlawful content, and we will act on valid reports.</p>

                <h2 id="ai-and-data-processing">8. AI and Data Processing</h2>
                <ul>
                  <li>Images you scan may be processed by third-party AI providers.</li>
                  <li>AI recognition results may not be 100% accurate; verify independently.</li>
                  <li>We are not responsible for AI-generated errors.</li>
                </ul>

                <h2 id="privacy">9. Privacy</h2>
                <p>Your use of the App is also governed by our Privacy Policy.</p>
                <ul>
                  <li>Some features allow you to share bottles or collections with friends.</li>
                  <li>You control what is shared.</li>
                  <li>Friends who can view your shared content may still capture it (e.g., screenshots).</li>
                </ul>

                <h2 id="legal-and-compliance-disclaimers">10. Legal &amp; Compliance Disclaimers</h2>
                <div className="rounded-lg border border-[#D2691E]/30 bg-[#D2691E]/10 p-4">
                  <ul>
                    <li><strong>No Marketplace:</strong> BarrelBook is not a platform for buying, selling, or trading alcohol.</li>
                    <li><strong>No Facilitation:</strong> We do not facilitate or endorse peer-to-peer exchanges, raffles, or shipments.</li>
                    <li><strong>User Responsibility:</strong> You are solely responsible for complying with all applicable laws regarding alcohol possession, gifting, and consumption in your jurisdiction.</li>
                    <li><strong>Georgia Law Compliance:</strong> In Georgia, resale or barter of alcohol by unlicensed persons is unlawful. BarrelBook prohibits use of the App in any manner that would violate Georgia’s three-tier alcohol distribution system or equivalent laws in other jurisdictions.</li>
                  </ul>
                </div>

                <h2 id="no-warranties">11. No Warranties</h2>
                <p>The App is provided “as is” without warranty of any kind.</p>
                <ul>
                  <li>We disclaim all express or implied warranties, including merchantability and fitness for a particular purpose.</li>
                  <li>We do not guarantee the accuracy of bottle data, values, or AI results.</li>
                </ul>

                <h2 id="limitation-of-liability">12. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, BarrelBook shall not be liable for indirect, incidental, special, or consequential damages.</p>
                <p>Our total liability will not exceed the amount you paid for the App (if any) or $100, whichever is less.</p>

                <h2 id="indemnification">13. Indemnification</h2>
                <p>You agree to indemnify and hold us harmless from claims, damages, or expenses arising from:</p>
                <ul>
                  <li>Your violation of these Terms.</li>
                  <li>Your violation of applicable alcohol laws.</li>
                  <li>Content you upload or share.</li>
                </ul>

                <h2 id="modifications">14. Modifications</h2>
                <p>We may modify these Terms or the App at any time.</p>
                <ul>
                  <li>Material changes will be communicated via in-app notice or email.</li>
                  <li>Continued use of the App constitutes acceptance of the modified Terms.</li>
                </ul>

                <h2 id="termination">15. Termination</h2>
                <ul>
                  <li>We may suspend or terminate your account if you violate these Terms.</li>
                  <li>Upon termination, your right to use the App ceases immediately.</li>
                  <li>We may delete your data after a reasonable period.</li>
                </ul>

                <h2 id="governing-law">16. Governing Law</h2>
                <p>These Terms are governed by the laws of the State of Georgia (USA). Disputes shall be resolved in the courts of Georgia.</p>

                <h2 id="contact-information">17. Contact Information</h2>
                <p>For questions about these Terms, please contact:</p>
                <p><strong>Email:</strong> <a href="mailto:info@barrelbook.app">info@barrelbook.app</a><br />
                <strong>Developer:</strong> BarrelBook</p>

                <p>By using BarrelBook, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
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


