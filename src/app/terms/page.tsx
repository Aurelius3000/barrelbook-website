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
          <div className="mb-8">
            <p className="text-gray-400">Last Updated: August 1, 2026</p>
            <p className="mt-2 text-sm text-gray-400">
              Prior version: <Link href="/terms/2025-09-17" className="text-[#D2691E] underline hover:text-[#E07A2B]">September 17, 2025</Link>
            </p>
          </div>

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
                  <li><a className="text-gray-300 hover:text-white" href="#connected-services">9. Connected Services &amp; API</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#privacy">10. Privacy</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#legal-and-compliance-disclaimers">11. Legal &amp; Compliance</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#copyright-and-dmca">12. Copyright &amp; DMCA</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#no-warranties">13. No Warranties</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#limitation-of-liability">14. Limitation of Liability</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#indemnification">15. Indemnification</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#modifications">16. Modifications</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#termination">17. Termination</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#governing-law">18. Governing Law</a></li>
                  <li><a className="text-gray-300 hover:text-white" href="#contact-information">19. Contact</a></li>
                </ul>
              </nav>
            </aside>

            <article className="lg:col-span-8">
              <div className="prose prose-invert prose-lg sm:prose-xl leading-8 prose-headings:text-white prose-strong:text-white prose-a:text-[#D2691E] prose-a:underline prose-p:text-gray-200 prose-li:marker:text-[#D2691E] prose-li:my-3 prose-h2:scroll-mt-28 prose-h2:mt-20 md:prose-h2:mt-28 prose-h2:pt-10 md:prose-h2:pt-12 prose-h2:mb-6 prose-h2:border-t prose-h2:border-white/10 prose-h3:mt-6 prose-p:mt-4 prose-ul:mt-4 prose-ol:mt-4 tos">
                <h2 id="acceptance-of-terms">1. Acceptance of Terms</h2>
                <p>By downloading, installing, or using BarrelBook (the “App”), you agree to these Terms of Service (“Terms”). If you do not agree, do not use the App.</p>

                <h2 id="description-of-service">2. Description of Service</h2>
                <p>BarrelBook is a whiskey collection manager. Depending on the features available to you, you can:</p>
                <ul className="bullet">
                  <li>Catalog your bottles</li>
                  <li>Use AI to scan and identify labels</li>
                  <li>Track estimated values and personal notes</li>
                  <li>Save photos and tasting impressions</li>
                  <li>Ask B.B., an AI assistant that answers questions using your collection</li>
                  <li>Share selected bottles or collections with friends you choose</li>
                  <li>Publish lists or shelves you choose to make public</li>
                  <li>See community context derived from anonymous, aggregate statistics</li>
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
                  <li>Where available, publish lists or shelves you choose to make public.</li>
                  <li>Export your own data for personal reference.</li>
                </ul>
                <h3>You May Not:</h3>
                <ul>
                  <li>
                    Use the App for any illegal or regulated alcohol activity, including:
                    <ul>
                      <li>Buying, selling, trading, bartering, or otherwise transferring alcohol.</li>
                      <li>Coordinating or arranging shipments of alcohol.</li>
                      <li>Posting offers to purchase, solicitations to trade, or raffle/auction postings.</li>
                    </ul>
                  </li>
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
                  <li>You grant us a limited license to host, store, process, and share your content solely to provide the App’s features, to display content publicly at your direction (for example, lists you publish), and, if you enable community contribution, to use contributed facts, ratings, prices, and corrections to improve shared bottle information and to create de-identified, aggregated statistics that do not identify you, which may be displayed in the App and on public bottle pages. If you opt in to Ask B.B. conversation review, this license also covers temporary copies of those conversations for quality review.</li>
                  <li>If you choose to feature a photo on a public bottle page, you grant us a non-exclusive, royalty-free license to display that photo on that page and in previews of it, with attribution or anonymously as you choose, until you unfeature it or delete your account.</li>
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
                  <li>
                    You agree not to upload or share content that:
                    <ul>
                      <li>Infringes on intellectual property rights.</li>
                      <li>Contains offensive, obscene, or illegal material.</li>
                      <li>Promotes, arranges, or solicits alcohol sales, trades, raffles, or shipments.</li>
                    </ul>
                  </li>
                </ul>
                <p>Content you publish publicly (such as public lists or featured photos) is held to the same standards, including the prohibition on offering, soliciting, or arranging alcohol sales, trades, raffles, or shipments. We may unpublish or remove content that violates these Terms. Users can report inappropriate or unlawful content, and we will act on valid reports.</p>

                <h2 id="ai-and-data-processing">8. AI and Data Processing</h2>
                <ul>
                  <li>Images you scan and questions you ask Ask B.B. may be processed by third-party AI providers.</li>
                  <li>Ask B.B. is an artificial-intelligence assistant. Its responses are generated by AI using your recent conversation history and relevant context from your catalog, and may be inaccurate, incomplete, or out of date.</li>
                  <li>AI recognition results and Ask B.B. responses may not be 100% accurate; verify independently.</li>
                  <li>Ask B.B. does not provide professional, financial, valuation, medical, or legal advice.</li>
                  <li>Do not submit another person’s confidential or sensitive information to Ask B.B.</li>
                  <li>Feedback you submit may be used to improve the App.</li>
                  <li>We are not responsible for AI-generated errors.</li>
                </ul>

                <h2 id="connected-services">9. Connected Services &amp; API Access</h2>
                <p>Where available, BarrelBook offers an API (including MCP) that lets you connect third-party services you choose — such as AI assistants — to your own catalog.</p>
                <ul>
                  <li>Connecting a service is optional and happens at your direction. You authorize what it can access, and you can revoke access at any time in settings.</li>
                  <li>Connector access is read-only: a connected service can request approved information from your catalog but cannot modify your catalog.</li>
                  <li>Once data is shared with a service you connect, that provider’s own terms and privacy practices govern its use, retention, and security of your data. We are not responsible for third-party services.</li>
                  <li>Requests made through your connected clients are attributed to you, and these Terms — including Acceptable Use — apply to API access.</li>
                  <li>Keep connection credentials secure and do not share them.</li>
                  <li>We may apply rate limits and may suspend API access for abuse.</li>
                  <li>Outputs from connected AI assistants may be inaccurate; verify independently.</li>
                </ul>

                <h2 id="privacy">10. Privacy</h2>
                <p>Your use of the App is also governed by our Privacy Policy.</p>
                <ul>
                  <li>Some features may allow you to share bottles or collections with friends, or to publish lists you choose to make public.</li>
                  <li>You control what is shared or published, and you can revoke a public link at any time.</li>
                  <li>Anyone who can view your shared or published content may still capture it (e.g., screenshots).</li>
                </ul>

                <h2 id="legal-and-compliance-disclaimers">11. Legal &amp; Compliance Disclaimers</h2>
                <div className="rounded-lg border border-[#D2691E]/30 bg-[#D2691E]/10 p-4">
                  <ul>
                    <li><strong>No Marketplace:</strong> BarrelBook is not a platform for buying, selling, or trading alcohol.</li>
                    <li><strong>No Facilitation:</strong> We do not facilitate or endorse peer-to-peer exchanges, raffles, or shipments.</li>
                    <li><strong>User Responsibility:</strong> You are solely responsible for complying with all applicable laws regarding alcohol possession, gifting, and consumption in your jurisdiction.</li>
                    <li><strong>Georgia Law Compliance:</strong> In Georgia, resale or barter of alcohol by unlicensed persons is unlawful. BarrelBook prohibits use of the App in any manner that would violate Georgia’s three-tier alcohol distribution system or equivalent laws in other jurisdictions.</li>
                  </ul>
                </div>

                <h2 id="copyright-and-dmca">12. Copyright &amp; DMCA Takedowns</h2>
                <p>We respect intellectual property rights and respond to notices under the Digital Millennium Copyright Act (“DMCA”). If you believe content in the App or on our public pages infringes your copyright, send a notice to our designated agent using the contact information below.</p>
                <address className="not-italic rounded-lg border border-white/10 bg-white/[0.03] p-5">
                  <strong>DMCA Agent</strong><br />
                  BarrelBook, LLC<br />
                  3651 Peachtree Parkway<br />
                  Suite E141<br />
                  Suwanee, GA 30024<br />
                  <strong>Phone:</strong> <a href="tel:+16784270509">678-427-0509</a><br />
                  <strong>Email:</strong> <a href="mailto:legal@barrelbook.app">legal@barrelbook.app</a>
                </address>
                <p>Your notice should include:</p>
                <ul>
                  <li>Identification of the copyrighted work you claim is infringed.</li>
                  <li>The location of the allegedly infringing material (URL or in-app location).</li>
                  <li>Your name, address, email address, and telephone number.</li>
                  <li>A good-faith statement that the use is not authorized by the copyright owner, its agent, or the law.</li>
                  <li>A statement, under penalty of perjury, that the notice is accurate and that you are the owner or authorized to act for the owner.</li>
                  <li>Your physical or electronic signature.</li>
                </ul>
                <p>We may remove or disable access to the identified material and may terminate the accounts of repeat infringers. Counter-notices may be submitted to the same address.</p>

                <h2 id="no-warranties">13. No Warranties</h2>
                <p>The App is provided “as is” without warranty of any kind.</p>
                <ul>
                  <li>We disclaim all express or implied warranties, including merchantability and fitness for a particular purpose.</li>
                  <li>We do not guarantee the accuracy of bottle data, values, or AI results.</li>
                </ul>

                <h2 id="limitation-of-liability">14. Limitation of Liability</h2>
                <p>To the maximum extent permitted by law, BarrelBook shall not be liable for indirect, incidental, special, or consequential damages.</p>
                <p>Our total liability will not exceed the amount you paid for the App (if any) or $100, whichever is less.</p>

                <h2 id="indemnification">15. Indemnification</h2>
                <p>You agree to indemnify and hold us harmless from claims, damages, or expenses arising from:</p>
                <ul>
                  <li>Your violation of these Terms.</li>
                  <li>Your violation of applicable alcohol laws.</li>
                  <li>Content you upload or share.</li>
                </ul>

                <h2 id="modifications">16. Modifications</h2>
                <p>We may modify these Terms or the App at any time.</p>
                <ul>
                  <li>Material changes will be communicated via in-app notice or email.</li>
                  <li>Continued use of the App constitutes acceptance of the modified Terms.</li>
                </ul>

                <h2 id="termination">17. Termination</h2>
                <ul>
                  <li>We may suspend or terminate your account if you violate these Terms.</li>
                  <li>Upon termination, your right to use the App ceases immediately.</li>
                  <li>We may delete your data after a reasonable period.</li>
                </ul>

                <h2 id="governing-law">18. Governing Law</h2>
                <p>These Terms are governed by the laws of the State of Georgia (USA). Disputes shall be resolved in the courts of Georgia.</p>

                <h2 id="contact-information">19. Contact Information</h2>
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
