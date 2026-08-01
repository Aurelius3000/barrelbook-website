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
          <div className="mb-8">
            <p className="text-gray-400">Last Updated: August 1, 2026</p>
            <p className="mt-2 text-sm text-gray-400">
              Prior version: <Link href="/privacy/2025-09-17" className="text-[#D2691E] underline hover:text-[#E07A2B]">September 17, 2025</Link>
            </p>
          </div>

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
              <div className="prose prose-invert prose-lg sm:prose-xl leading-8 prose-headings:text-white prose-strong:text-white prose-a:text-[#D2691E] prose-a:underline prose-p:text-gray-200 prose-li:marker:text-gray-500 prose-li:my-2 prose-h2:scroll-mt-28 prose-h2:mt-20 md:prose-h2:mt-28 prose-h2:pt-10 md:prose-h2:pt-12 prose-h2:mb-6 prose-h2:border-t prose-h2:border-white/10 prose-h3:mt-6 prose-p:mt-4 prose-ul:mt-4 prose-ol:mt-4 tos">
                <h2 id="introduction">1. Introduction</h2>
                <p>This Privacy Policy explains how BarrelBook (“we,” “our,” or “us”) collects, uses, and protects your information when you use our mobile app (“the App”).</p>
                <p>By using the App, you agree to the practices described here. BarrelBook is a collection and social sharing app only — it does not allow buying, selling, trading, or shipping of alcohol.</p>
                <p>Some features described in this Policy may become available over time. We do not use or disclose your information for a feature-specific purpose described here unless and until that feature and its corresponding controls are available to you. Where we describe opt-in consent, that processing begins only after you provide it.</p>

                <h2 id="information-we-collect">2. Information We Collect</h2>
                <h3>Information You Provide</h3>
                <ul>
                  <li><strong>Account Information:</strong> Email address, password, display name, and age verification (21+).</li>
                  <li><strong>Bottle Data:</strong> Information you add or confirm about bottles (brand, release, proof, fill level, notes, etc.).</li>
                  <li><strong>Photos &amp; Media:</strong> Images you capture or upload of bottles.</li>
                  <li><strong>Ask B.B. Conversations:</strong> Questions you ask, AI responses, and feedback you give. Conversation history is stored on your device, and Ask B.B. uses recent history to continue the conversation. Separately, and only if you opt in to the Ask B.B. improvement program, we collect limited information about how you use Ask B.B., and temporary copies of your future questions and answers are stored on our servers with your user ID and diagnostic metadata so a small number of authorized BarrelBook staff can review quality.</li>
                </ul>
                <h3>Information We Collect Automatically</h3>
                <ul>
                  <li><strong>Device Information:</strong> Device type, operating system, and app version.</li>
                  <li><strong>Usage Data:</strong> Features used, frequency of scans, and interactions with your catalog.</li>
                  <li><strong>Log Data:</strong> Crash reports, error logs, and performance metrics.</li>
                </ul>
                <h3>Information from Third Parties</h3>
                <p><strong>AI Services:</strong> Photos you submit for scanning and questions you ask Ask B.B. (together with recent conversation history and relevant context from your catalog) may be temporarily processed by trusted AI providers (currently OpenAI) to extract label data and generate answers. Providers retain this data only for a limited period (up to 30 days for abuse monitoring) and do not use it to train their models.</p>

                <h2 id="how-we-use">3. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul>
                  <li>Provide and improve the App’s features (cataloging, scanning, personal valuation).</li>
                  <li>Sync your bottle data and photos across devices.</li>
                  <li>Support offline use with background uploads when you reconnect.</li>
                  <li>Allow you to share selected bottles or collections with friends you choose.</li>
                  <li>If and when public-list features are available, publish lists you choose to make public.</li>
                  <li>Match your scans to shared bottle reference records to improve accuracy and autofill, and use bottle facts read from labels and our own research to keep shared bottle reference data accurate. These are facts about bottles, not about you, and are not linked to your account in shared data.</li>
                  <li>If you enable community contribution, use selected facts from your current and future catalog and lists — such as ratings, prices paid, corrections, and bottle details — to improve shared bottle information and to compute de-identified, aggregate statistics (such as how many collectors track a bottle and median prices) shown in the App and on public bottle pages.</li>
                  <li>If and when featured-photo functionality is available, display photos you choose to feature on public bottle pages.</li>
                  <li>If and when connected-service functionality is available, provide connections you authorize to third-party services (such as AI assistants) through our API.</li>
                  <li>Answer your Ask B.B. questions using AI, including relevant context from your catalog.</li>
                  <li>If and when the Ask B.B. improvement program is available, and with your separate opt-in consent, collect Ask B.B. usage information and review conversations to evaluate and improve the feature.</li>
                  <li>Send important notices, such as security alerts or updates to Terms.</li>
                </ul>
                <p>We do not use your information to enable alcohol sales or trades.</p>

                <h2 id="sharing-and-visibility">4. Sharing &amp; Visibility</h2>
                <h3>Private by Default</h3>
                <p>Your catalog, photos, and notes are private unless you choose to share them.</p>
                <h3>Friend Sharing</h3>
                <p>If you share bottles or collections with friends, those users will see the shared photos, data, and notes. We cannot prevent recipients from saving or redistributing your content outside the App.</p>
                <h3>Public Lists (Opt-In)</h3>
                <p>If public-list features are available, you may choose to publish certain lists (such as a Want List) to a public link. Anyone with the link can view it — no account needed — and links can be forwarded, copied, cached, or indexed, so treat a published list as public. The page always shows the list’s current contents: every item on the list, with item details, target prices, public notes, your display name, and photo thumbnails. Private notes, your other lists, and your catalog are never included. You can revoke or regenerate the link at any time; revoking stops future access, but copies made while the list was public may persist.</p>
                <h3>Aggregate Statistics</h3>
                <p>Your individual catalog, photos, notes, and entries are never made publicly visible unless you publish them yourself. If we offer community statistics and you enable contribution, we may publish anonymous, aggregated statistics computed across many users (for example, “tracked by 340 collectors, median paid $189”) in the App and on public bottle pages. These statistics never include your name, photos, notes, or any individual entry. Community statistics are computed only from users who have enabled contribution, and the contribution controls are provided before this processing begins.</p>
                <h3>Community Contribution (Opt-In)</h3>
                <p>If community contribution is available and you enable it, selected facts from your catalog and lists — bottle details, ratings, corrections, and prices you paid (which you can exclude at any time in settings) — feed shared bottle information, combined with contributions from other collectors. Contribution records are kept internally attributable to your account so we can honor withdrawal, deletion, and quality controls, but they are never shown to other users, and shared results never identify you or any individual transaction. You can contribute facts without sharing prices paid, and you can turn contribution off at any time; previously published de-identified statistics may persist.</p>
                <h3>Aggregated &amp; De-identified Data</h3>
                <p>If we publish community statistics, they are aggregated and de-identified: they are computed across many users, are only shown when enough collectors track a bottle, and cannot reasonably be used to identify you. De-identified data is not personal information. We maintain it in de-identified form, will not attempt to re-identify it, and require the same of our service providers.</p>
                <h3>Featured Photos (Opt-In, Per Photo)</h3>
                <p>If featured-photo functionality is available, you can choose to feature individual photos of yours on public bottle pages — we may suggest a photo, but it appears only if you approve it. A featured photo is visible to anyone on the internet and is shown with your display name or anonymously — your choice. We remove location and other hidden metadata before display, and we review photos before they appear. You can unfeature a photo at any time, and deleting your account removes your featured photos; copies made while public may persist.</p>
                <h3>Services You Connect (Opt-In)</h3>
                <p>If connected-service functionality is available and you connect a third-party AI assistant or other service to your BarrelBook account (for example, through our API or MCP), the data you authorize it to access is disclosed to that service at your direction. Its use of your data — including any retention or model-training behavior — is governed by your agreement with that provider, not this policy. Access is read-only: a connected service can request the information you approve from your catalog but cannot modify it. BarrelBook does not receive your conversations with the connected service; we receive only the requests it makes to your catalog. You can review and revoke connected services at any time in settings.</p>
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
                  <li><strong>Deletion:</strong> You may delete your account through the App. We will remove your personal information after a reasonable retention period. Aggregate statistics computed before deletion are not linked to you and may persist.</li>
                  <li><strong>Sharing Controls:</strong> You decide whether to share bottles or collections with friends, and whether to publish lists publicly. You can revoke a public link at any time.</li>
                  <li><strong>Community Contribution:</strong> If available, you choose whether your data contributes to shared bottle information and aggregate statistics, and separately whether your prices paid are included. You can change either at any time in settings.</li>
                  <li><strong>Featured Photos:</strong> If available, you choose which photos, if any, appear on public bottle pages, and you can unfeature them at any time.</li>
                  <li><strong>Connected Services:</strong> If available, you can review the services you have connected and revoke their access at any time.</li>
                  <li><strong>Ask B.B. Improvement Program:</strong> If available, participation (usage analytics and conversation review) is opt-in, applies only to future conversations, and is never required to use Ask B.B. You can withdraw consent and delete captured conversations at any time in settings. Opting out does not turn off conversation history or Ask B.B. itself.</li>
                </ul>

                <h2 id="data-retention">7. Data Retention</h2>
                <ul>
                  <li><strong>Bottle Photos &amp; Data:</strong> Stored as long as your account is active.</li>
                  <li><strong>Shared Content:</strong> Remains accessible to friends you shared with unless you delete it or revoke access.</li>
                  <li><strong>Published Lists:</strong> Remain publicly accessible until you revoke or regenerate the link or delete the list; links do not expire automatically. Copies or caches made while public may persist beyond our control.</li>
                  <li><strong>Featured Photos:</strong> Displayed until you unfeature them or delete your account. Copies or caches made while public may persist beyond our control.</li>
                  <li><strong>AI Processing:</strong> Photos sent for AI extraction are retained for ≤30 days for quality assurance and are never used to train AI models.</li>
                  <li><strong>Ask B.B. Review Transcripts (opt-in):</strong> Retained for up to 30 days; access-audit logs are kept for 90 days. Encrypted disaster-recovery backups may persist for up to 14 weeks before automatic deletion.</li>
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
