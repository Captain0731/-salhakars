import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-3">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
              <p className="text-gray-600 mt-1">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">1. Introduction</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                This Cookie Policy ("Policy") explains how ExpertSetu LLP ("ExpertSetu", "Company",
                "we", "our", or "us") uses cookies, web beacons, pixels, and other tracking technologies
                (collectively, "Cookies") when you visit or use our website, applications, or any online
                services offered through the ExpertSetu AI-powered legal assistance platform
                ("Services").
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                This Policy should be read together with our Privacy Policy, which provides further
                details on how we collect, process, and protect your personal data.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-gray-700">
                  By continuing to browse or use our website, you consent to the use of cookies in
                  accordance with this Policy, unless you disable them through your browser settings.
                </p>
              </div>
            </div>
          </section>

          {/* What Are Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">2. What Are Cookies</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                Cookies are small text files that are placed on your device (computer, mobile phone, or
                tablet) by a website when you visit it. Cookies help websites function efficiently and
                provide information to the site owners to enhance performance and user experience.
              </p>
              <p className="mb-4 text-gray-700">Cookies may be:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Session Cookies</h3>
                  <p className="text-gray-700 text-sm">Temporary cookies that remain on your device only while your session is active and are deleted once you close your browser.</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Persistent Cookies</h3>
                  <p className="text-gray-700 text-sm">Stored on your device for a specific period, allowing the website to remember your preferences on future visits.</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">First-party Cookies</h3>
                  <p className="text-gray-700 text-sm">Set directly by the website you are visiting (in this case, ExpertSetu).</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Third-party Cookies</h3>
                  <p className="text-gray-700 text-sm">Placed by third-party service providers such as analytics or advertising networks.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Basis */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">3. Legal Basis for Using Cookies</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                Under the Digital Personal Data Protection Act, 2023 (DPDP Act) and the Information
                Technology Act, 2000, ExpertSetu uses cookies based on one or more of the following
                legal grounds:
              </p>
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-blue-50 rounded">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">1</span>
                  <span className="text-gray-700">User Consent: For non-essential cookies (e.g., analytics, advertising), obtained via consent banners or cookie preferences.</span>
                </div>
                <div className="flex items-start p-3 bg-blue-50 rounded">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">2</span>
                  <span className="text-gray-700">Legitimate Interest: For cookies essential to secure and deliver our Services effectively.</span>
                </div>
              </div>
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-gray-700">
                  Users have the right to withdraw or modify their cookie preferences at any time.
                </p>
              </div>
            </div>
          </section>

          {/* Types of Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">4. Types of Cookies We Use</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">We categorize the cookies used on our website as follows:</p>
              
              {/* Strictly Necessary Cookies */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">A</span>
                  Strictly Necessary Cookies
                </h3>
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <p className="mb-3 text-gray-700">
                    These cookies are essential for the operation of our website and platform. They enable
                    core functionalities such as secure login, session management, and payment
                    processing.
                  </p>
                  <p className="mb-3 text-red-700 font-medium">
                    Disabling these cookies may result in parts of the site not functioning properly.
                  </p>
                  <p className="text-gray-700 font-medium mb-2">Examples include:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Authentication cookies</li>
                    <li>Security and fraud prevention cookies</li>
                    <li>Load balancing session identifiers</li>
                  </ul>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">B</span>
                  Functional Cookies
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="mb-3 text-gray-700">
                    These cookies allow us to remember your preferences and personalize your experience,
                    such as language settings, saved searches, or previously used features.
                  </p>
                  <p className="mb-3 text-gray-700">
                    They help ensure a smoother user experience on repeated visits.
                  </p>
                  <p className="text-gray-700 font-medium mb-2">Examples include:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>User interface customization cookies</li>
                    <li>Preference retention cookies</li>
                  </ul>
                </div>
              </div>

              {/* Performance and Analytics Cookies */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">C</span>
                  Performance and Analytics Cookies
                </h3>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                  <p className="mb-3 text-gray-700">
                    These cookies collect anonymous data on how visitors interact with our website, such
                    as pages visited, time spent, and clicks to help us understand usage patterns and
                    improve performance.
                  </p>
                  <p className="mb-3 text-gray-700">
                    We use tools such as Google Analytics and Meta Pixel, which may collect anonymized
                    information in compliance with their own privacy policies.
                  </p>
                  <p className="text-gray-700 font-medium mb-2">Examples include:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Page view tracking cookies</li>
                    <li>Traffic source analytics cookies</li>
                  </ul>
                  <div className="mt-3 bg-green-100 p-3 rounded">
                    <p className="text-green-800 text-sm font-medium">
                      Note: No personally identifiable information is collected through these cookies without consent.
                    </p>
                  </div>
                </div>
              </div>

              {/* Advertising and Marketing Cookies */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">D</span>
                  Advertising and Marketing Cookies
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <p className="mb-3 text-gray-700">
                    We may use these cookies to deliver relevant content and advertisements to users and
                    measure the effectiveness of our marketing campaigns. These may be set by us or third-
                    party partners.
                  </p>
                  <p className="text-gray-700 font-medium mb-2">Examples include:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Retargeting or remarketing cookies</li>
                    <li>Ad performance tracking cookies</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">5. Third-Party Cookies and Tracking Technologies</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                Certain cookies used on our website are placed by third-party service providers,
                including but not limited to:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Google Analytics</h3>
                  <p className="text-gray-700 text-sm">For site analytics and performance measurement</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Payment Gateways</h3>
                  <p className="text-gray-700 text-sm">Stripe/Razorpay for secure transaction processing</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Meta Pixel</h3>
                  <p className="text-gray-700 text-sm">For social media analytics and marketing</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Other Partners</h3>
                  <p className="text-gray-700 text-sm">Various third-party service providers</p>
                </div>
              </div>
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-gray-700">
                  Each third party maintains its own cookie and privacy policies, which we encourage
                  users to review separately. ExpertSetu is not responsible for the privacy practices of third-party cookie providers.
                </p>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">6. Managing Cookies</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">You have full control over cookie usage. You may:</p>
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-blue-50 rounded">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">1</span>
                  <span className="text-gray-700">Modify your browser settings to block, delete, or restrict cookies.</span>
                </div>
                <div className="flex items-start p-3 bg-blue-50 rounded">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">2</span>
                  <span className="text-gray-700">Use browser plug-ins or add-ons to manage cookie preferences.</span>
                </div>
                <div className="flex items-start p-3 bg-blue-50 rounded">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">3</span>
                  <span className="text-gray-700">Withdraw previously granted consent through our cookie consent tool (if implemented).</span>
                </div>
              </div>
              <div className="mt-4 bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="text-gray-700">
                  Please note that disabling certain cookies may impair website functionality or restrict
                  access to some platform features.
                </p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions for common browsers:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Chrome</h4>
                    <p className="text-gray-700 text-sm">Settings → Privacy & Security → Cookies and other site data</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Firefox</h4>
                    <p className="text-gray-700 text-sm">Options → Privacy & Security → Cookies and Site Data</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
                    <p className="text-gray-700 text-sm">Preferences → Privacy → Manage Website Data</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Edge</h4>
                    <p className="text-gray-700 text-sm">Settings → Site Permissions → Cookies and site data</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Data Storage and Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">7. Data Storage and Security of Cookie Data</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                Any personal information collected through cookies is treated with the same level of
                security as other data we process.
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                We implement encryption, access control, and periodic audits to ensure compliance
                with the IT (Reasonable Security Practices and Procedures) Rules, 2011.
              </p>
            </div>
          </section>

          {/* Data Sharing and Transfer */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">8. Data Sharing and Transfer</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                Information derived from cookies may be shared with trusted third-party service
                providers solely for the purposes outlined in this Policy, such as analytics or fraud
                prevention.
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                All such transfers are governed by confidentiality obligations and comply with
                applicable Indian data protection laws.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-gray-700">
                  Currently, all cookie data is processed and stored within India. Any future cross-border
                  transfer of data will adhere to the provisions of the Digital Personal Data Protection
                  Act, 2023.
                </p>
              </div>
            </div>
          </section>

          {/* Changes to Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">9. Changes to This Policy</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                ExpertSetu reserves the right to update or modify this Cookie Policy at any time to
                reflect changes in technology, legal obligations, or operational practices.
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                Material updates will be communicated via our website or by email notification.
                Your continued use of our website following such updates constitutes acceptance of
                the revised Policy.
              </p>
            </div>
          </section>

          {/* Grievance Redressal */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">10. Grievance Redressal</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                In accordance with Rule 5(9) of the Information Technology (Reasonable Security
                Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011,
                the Company has designated a Grievance Officer for handling privacy and cookie-
                related concerns.
              </p>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Grievance Officer:</h3>
                <div className="space-y-2">
                  <p className="text-gray-700"><strong>Name:</strong> Mr. Pratham Shah</p>
                  <p className="text-gray-700">
                    <strong>Email:</strong>{' '}
                    <a href="mailto:inquiry@salhakar.com" className="text-blue-600 hover:text-blue-800 underline">
                      inquiry@salhakar.com
                    </a>
                  </p>
                  <p className="text-gray-700"><strong>Office Hours:</strong> Monday to Friday, 10:00 a.m. to 6:00 p.m. (IST)</p>
                  <p className="text-sm text-gray-600 mt-3">
                    All grievances shall be acknowledged within 48 hours and resolved within 30 days of receipt.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">11. Governing Law and Jurisdiction</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                This Policy shall be governed by and construed in accordance with the laws of India.
                Any disputes arising from or relating to this Policy shall be subject to the exclusive
                jurisdiction of the competent courts in Ahmedabad, Gujarat.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">12. Contact Information</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                For questions, clarifications, or requests regarding cookie usage or data processing,
                please contact:
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">ExpertSetu LLP</h3>
                    <p className="text-gray-600">Cookie Policy Team</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Email:</strong>{' '}
                    <a 
                      href="mailto:inquiry@salhakar.com" 
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      inquiry@salhakar.com
                    </a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Office Hours:</strong> Monday to Friday, 10:00 a.m. to 6:00 p.m. (IST)
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              This Cookie Policy is effective as of the date of last update and applies to all users of our Services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
