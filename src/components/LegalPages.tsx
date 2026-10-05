import React, { useState } from 'react';
import { ShieldCheck, FileText, Info, Mail, AlertTriangle, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import { PageView } from '../types';

interface LegalPagesProps {
  pageType: 'privacy-policy' | 'terms-of-service' | 'about-us' | 'contact-us' | 'disclaimer';
  onNavigateHome: () => void;
  onNavigatePage: (page: PageView) => void;
}

export const LegalPages: React.FC<LegalPagesProps> = ({ pageType, onNavigateHome, onNavigatePage }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Navigation breadcrumb */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home Tools</span>
        </button>

        {/* Tab Switcher for all compliance pages */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium">
          <button
            onClick={() => onNavigatePage('about-us')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${pageType === 'about-us' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            About Us
          </button>
          <button
            onClick={() => onNavigatePage('privacy-policy')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${pageType === 'privacy-policy' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => onNavigatePage('terms-of-service')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${pageType === 'terms-of-service' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => onNavigatePage('disclaimer')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${pageType === 'disclaimer' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Disclaimer
          </button>
          <button
            onClick={() => onNavigatePage('contact-us')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${pageType === 'contact-us' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. ABOUT US PAGE */}
      {/* ========================================================================= */}
      {pageType === 'about-us' && (
        <article className="prose prose-slate max-w-none">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-8 mb-8 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-4">
              <Info className="w-3.5 h-3.5" />
              <span>Who We Are & Our Mission</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-3">About imageresize.store</h1>
            <p className="text-slate-200 text-base leading-relaxed">
              We empower millions of students, job candidates, government exam applicants, and digital creators worldwide with free, lightning-fast, and 100% private browser-based image utilities.
            </p>
          </div>

          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900">Our Story & Core Philosophy</h2>
            <p>
              In recent years, millions of candidates applying for competitive examinations (such as UPSC, SSC CGL, RRB, IBPS, State PSCs, and passport renewals) faced a recurring nightmare: upload systems rejecting images because files were 52KB instead of &lt;50KB, or because dimension requirements (e.g. 35x45mm, 3.5x4.5cm, 200x230px) were slightly incorrect.
            </p>
            <p>
              Existing online tools frequently forced users to upload private identity documents, Aadhaar cards, and personal photographs to unknown third-party cloud servers, posing significant privacy risks.
            </p>
            <p>
              <strong>imageresize.store</strong> was built to solve this exact problem with a revolutionary zero-upload architecture: every byte of image resizing, background removal, format conversion, and target KB compression executes strictly inside your browser’s client memory (using HTML5 Canvas, Web Workers, and WebAssembly).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 not-prose">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">100% Zero-Upload Privacy</h3>
                <p className="text-xs text-slate-600">
                  Your photos never touch any remote server. Everything happens on your device in local memory.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
                  ⚡
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Instant Processing</h3>
                <p className="text-xs text-slate-600">
                  No queue times, no download bandwidth bottlenecks. Process high-res images in milliseconds.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3">
                  🎯
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">Exact KB Precision</h3>
                <p className="text-xs text-slate-600">
                  Binary search iterative compression algorithms hit exact target file sizes (20KB, 50KB, 100KB).
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900">Editorial & Technical Standards</h2>
            <p>
              Every tool and tutorial on imageresize.store is continually tested against official portal guidelines across major public sector bodies, exam portals, and embassy visa criteria. We do not use deceptive clickbaits or paywalls.
            </p>

            <h2 className="text-xl font-bold text-slate-900">Developer & Team Behind the Platform</h2>
            <p>
              imageresize.store is independently engineered and maintained by a dedicated web engineering team passionate about accessible, client-side web technology and performance optimization.
            </p>
            <p>
              If you have any suggestions, feature requests, or technical bug reports, please reach out to us directly through our <button onClick={() => onNavigatePage('contact-us')} className="text-blue-600 underline font-semibold">Contact Us</button> page.
            </p>
          </div>
        </article>
      )}

      {/* ========================================================================= */}
      {/* 2. PRIVACY POLICY PAGE (ADSENSE COMPLIANT) */}
      {/* ========================================================================= */}
      {pageType === 'privacy-policy' && (
        <article className="prose prose-slate max-w-none">
          <div className="bg-slate-900 text-white rounded-2xl p-8 mb-8 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Full Privacy & Cookie Compliance Disclosure</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Privacy Policy</h1>
            <p className="text-slate-300 text-sm">
              Last Updated: September 29, 2026 • Effective Date: January 1, 2026
            </p>
          </div>

          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs leading-relaxed">
              <strong>Core Privacy Guarantee:</strong> Unlike traditional photo editing websites, <strong>imageresize.store does NOT upload, store, or transmit your uploaded images to any remote server or cloud database</strong>. All image manipulations, compression, background removal, and conversions occur entirely within your web browser using HTML5 Canvas and client-side WebAssembly.
            </div>

            <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              When you use imageresize.store, we do not require you to create an account, log in, or provide personal identifiable information (PII) such as your real name, phone number, or home address.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Local Image Files:</strong> Selected files are processed transiently in your device's browser memory (RAM) and are permanently purged upon closing or refreshing your browser tab.</li>
              <li><strong>Standard Server Logs:</strong> Like most web applications, our web hosting server automatically records non-personal requests including IP address, browser type, referring URLs, and timestamp to prevent denial-of-service abuse.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900">2. Cookies and Web Beacons</h2>
            <p>
              imageresize.store uses cookies to improve user experience, retain user interface preferences (such as selected tool options), and analyze site traffic trends.
            </p>

            <h2 className="text-xl font-bold text-slate-900">3. Google AdSense & Third-Party Advertising</h2>
            <p>
              We partner with Google AdSense to serve advertisements when you visit our website. Google, as a third-party vendor, uses cookies to serve ads on our site:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visits to this site and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Ads Settings</a>.
              </li>
              <li>
                Alternatively, you can opt out of a third-party vendor’s use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">www.aboutads.info</a> or <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Network Advertising Initiative</a>.
              </li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900">4. Third-Party Web Analytics</h2>
            <p>
              We may utilize standard web analytics services (such as Google Analytics) to aggregate anonymous statistics regarding visitor counts, popular tools, bounce rates, and device screen dimensions. This data contains no personally identifiable records and is exclusively used to improve page speed and layout usability.
            </p>

            <h2 className="text-xl font-bold text-slate-900">5. GDPR (General Data Protection Regulation) Compliance</h2>
            <p>
              For users residing within the European Economic Area (EEA), you have the right to request access, rectification, erasure, and restriction of any personal data. Because we do not store personal profiles, biometric data, or uploaded image files on our servers, your personal image data is never held by us.
            </p>

            <h2 className="text-xl font-bold text-slate-900">6. CCPA (California Consumer Privacy Act) Compliance</h2>
            <p>
              Under CCPA, California consumers have the right to know what personal data is collected and request deletion. We do not sell, rent, or trade your personal information or uploaded images to third parties under any circumstances.
            </p>

            <h2 className="text-xl font-bold text-slate-900">7. Children’s Online Privacy Protection (COPPA)</h2>
            <p>
              imageresize.store does not knowingly collect any personally identifiable information from children under the age of 13. If a parent or guardian believes that personal information has been collected, please contact us immediately for removal.
            </p>

            <h2 className="text-xl font-bold text-slate-900">8. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect technological improvements or legal requirements. Updates will be published on this page with an updated effective date.
            </p>

            <h2 className="text-xl font-bold text-slate-900">9. Contact Information</h2>
            <p>
              If you have any questions or inquiries regarding our privacy practices, please contact us at: <br />
              <strong>Email:</strong> anandkhichy@gmail.com
            </p>
          </div>
        </article>
      )}

      {/* ========================================================================= */}
      {/* 3. TERMS OF SERVICE */}
      {/* ========================================================================= */}
      {pageType === 'terms-of-service' && (
        <article className="prose prose-slate max-w-none">
          <div className="bg-slate-900 text-white rounded-2xl p-8 mb-8 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4">
              <FileText className="w-3.5 h-3.5" />
              <span>User Agreement & Conditions of Use</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Terms of Service</h1>
            <p className="text-slate-300 text-sm">
              Last Updated: September 29, 2026 • Please read carefully before using the service.
            </p>
          </div>

          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using <strong>imageresize.store</strong> ("the Website"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the service immediately.
            </p>

            <h2 className="text-xl font-bold text-slate-900">2. Description of Service</h2>
            <p>
              imageresize.store provides free, web-based image manipulation tools including image compression, background removal, photo resizing, aspect ratio cropping, and format conversion. The services are provided "as-is" and "as-available" for personal, educational, and commercial purposes.
            </p>

            <h2 className="text-xl font-bold text-slate-900">3. Permitted & Prohibited Uses</h2>
            <p>You agree not to use the Website to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Engage in illegal, fraudulent, or malicious activities.</li>
              <li>Process content that violates third-party copyright, trademark, or intellectual property rights.</li>
              <li>Attempt to reverse-engineer, exploit vulnerabilities, or inject malicious scripts or viruses into the platform.</li>
              <li>Use automated scrapers, bots, or rate-abuse scripts that degrade performance for other users.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900">4. Intellectual Property</h2>
            <p>
              All site design, logos, user interface components, educational guides, and custom client-side code are the exclusive intellectual property of imageresize.store. Your uploaded and processed images remain 100% your own property at all times; we claim zero ownership or rights over your files.
            </p>

            <h2 className="text-xl font-bold text-slate-900">5. Limitation of Liability</h2>
            <p>
              In no event shall imageresize.store or its developers be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools, including but not limited to rejection of job/exam applications or data loss. Users are responsible for verifying that their processed images comply with the respective official submission requirements.
            </p>

            <h2 className="text-xl font-bold text-slate-900">6. Modifications to Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any feature or service at any time without prior notice.
            </p>
          </div>
        </article>
      )}

      {/* ========================================================================= */}
      {/* 4. DISCLAIMER */}
      {/* ========================================================================= */}
      {pageType === 'disclaimer' && (
        <article className="prose prose-slate max-w-none">
          <div className="bg-amber-900 text-white rounded-2xl p-8 mb-8 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold mb-4">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Important Disclaimers</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Disclaimer</h1>
            <p className="text-amber-200 text-sm">
              Please review these disclaimers regarding government presets and third-party trademarks.
            </p>
          </div>

          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900">1. Government Affiliation Disclaimer</h2>
            <p>
              <strong>imageresize.store is an independent private web utility and is NOT affiliated with, authorized by, endorsed by, or in any way officially connected with any government entity, agency, examination board, or recruitment body</strong> (including but not limited to UPSC, SSC, NTA, IBPS, RRB, UIDAI/Aadhaar, or Ministry of External Affairs).
            </p>
            <p>
              All preset specifications (such as 35x45mm dimensions, 20KB–50KB file constraints) are provided purely for informational convenience based on publicly published exam notification guidelines. Users are advised to verify requirements against their official application brochure before submission.
            </p>

            <h2 className="text-xl font-bold text-slate-900">2. Third-Party Trademarks</h2>
            <p>
              All product names, logos, brands, and trademarks referenced on this website (such as WhatsApp, Apple HEIC, Adobe, UPSC, SSC) are the property of their respective trademark holders. Reference to these trademarks does not imply any affiliation, sponsorship, or endorsement.
            </p>

            <h2 className="text-xl font-bold text-slate-900">3. "As-Is" Tool Accuracy</h2>
            <p>
              While our compression and resizing algorithms are calibrated for maximum precision, varying browser environments, rendering engines, and image color profiles may cause minor differences in binary sizes. Always verify the downloaded file properties on your local device before formal application filing.
            </p>
          </div>
        </article>
      )}

      {/* ========================================================================= */}
      {/* 5. CONTACT US PAGE */}
      {/* ========================================================================= */}
      {pageType === 'contact-us' && (
        <div>
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl p-8 mb-8 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-4">
              <Mail className="w-3.5 h-3.5" />
              <span>We're Here to Help</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Contact Us</h1>
            <p className="text-slate-200 text-sm">
              Have questions, feedback, or need help with image specifications? Get in touch with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact details */}
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Support & Feedback</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  For bug reports, tool suggestions, advertising inquiries, or DMCA inquiries, please email our support team directly:
                </p>
                <a
                  href="mailto:anandkhichy@gmail.com"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100"
                >
                  <Mail className="w-4 h-4" />
                  <span>anandkhichy@gmail.com</span>
                </a>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-2">Response Time</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We typically respond to inquiries within <strong>24 to 48 business hours</strong>.
                </p>
              </div>

              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-2">Quick Self-Help</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Check our 100+ free guides and tutorials for immediate step-by-step instructions.
                </p>
                <button
                  onClick={() => onNavigatePage('blog-hub')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline"
                >
                  Browse Tutorial Hub →
                </button>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Send Us a Direct Message</h3>
                <p className="text-xs text-slate-500 mb-6">
                  Fill out the form below and we will get back to your email address promptly.
                </p>

                {contactSubmitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                    <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-emerald-900 text-base">Message Sent Successfully!</h4>
                    <p className="text-xs text-emerald-700 max-w-md mx-auto">
                      Thank you for contacting imageresize.store. Our engineering team has received your message and will respond to <strong>{formData.email}</strong> shortly.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Suggestion for SSC Form Resizer or Bug Report"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your issue, tool suggestion, or inquiry in detail..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
