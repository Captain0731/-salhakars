import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
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
                This Privacy Policy ("Policy") describes how ExpertSetu LLP, a limited liability
                partnership registered under the Limited Liability Partnership Act, 2008 and having its
                principal place of business in India ("ExpertSetu", "Company", "we", "our", or "us"),
                collects, uses, stores, discloses, and protects the personal information of users
                ("User", "you", or "your") who access or use our website, platform, mobile applications,
                and associated services ("Services").
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                By accessing or using the Services, you agree to the collection and use of your personal
                information in accordance with this Policy.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="font-medium text-gray-800 mb-2">This Policy is prepared in compliance with:</p>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Digital Personal Data Protection Act, 2023 (DPDP Act)</li>
                  <li>Information Technology Act, 2000 and the Information Technology Rules, 2011</li>
                  <li>Other applicable data protection regulations within India</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Definitions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">2. Definitions</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">For the purpose of this Policy:</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="font-semibold text-gray-900 w-32">Personal Data:</span>
                    <span className="text-gray-700">Any data about an individual who is identifiable by or in relation to such data.</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold text-gray-900 w-32">Processing:</span>
                    <span className="text-gray-700">The collection, storage, use, sharing, or deletion of personal data.</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold text-gray-900 w-32">Data Principal:</span>
                    <span className="text-gray-700">The individual to whom the personal data relates (you, the user).</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold text-gray-900 w-32">Data Fiduciary:</span>
                    <span className="text-gray-700">ExpertSetu LLP, the entity determining the purpose and means of processing personal data.</span>
                  </li>
                  <li className="flex">
                    <span className="font-semibold text-gray-900 w-32">Sensitive Personal Data:</span>
                    <span className="text-gray-700">Information such as financial data, passwords, and authentication credentials.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">3. Information We Collect</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">We may collect and process the following categories of information:</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Information You Provide</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Name, email address, mobile number</li>
                    <li>• Account registration details</li>
                    <li>• Payment and billing information</li>
                    <li>• Content you upload or input</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Information Collected Automatically</h3>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Device and browser information</li>
                    <li>• IP address and geolocation</li>
                    <li>• Log files and usage statistics</li>
                    <li>• Cookies and tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Purpose and Legal Basis */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">4. Purpose and Legal Basis for Processing</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">We process personal data only for lawful and legitimate purposes:</p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Service Delivery",
                  "User Account Management", 
                  "AI Personalization",
                  "Communication",
                  "Billing and Payments",
                  "Legal Compliance",
                  "Security",
                  "Analytics and Development"
                ].map((purpose, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{purpose}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-gray-700">
                We rely on user consent, contractual necessity, and legitimate interest as the
                primary legal bases for processing under Indian law.
              </p>
            </div>
          </section>

          {/* Consent */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">5. Consent</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">
                By accessing or using the Services, you consent to the collection and use of your data
                as described herein.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-gray-700">
                  You may withdraw consent at any time by contacting us at{' '}
                  <a href="mailto:inquiry@salhakar.com" className="text-blue-600 hover:text-blue-800 underline">
                    inquiry@salhakar.com
                  </a>.
                  However, withdrawal of consent may affect your continued use of certain features or Services.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">9. Data Security</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">
                We implement technical and organizational measures to safeguard personal data
                against unauthorized access, alteration, disclosure, or destruction:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Secure servers and data encryption (SSL/TLS)",
                  "Access controls and authentication protocols",
                  "Regular system audits and vulnerability assessments",
                  "Compliance with ISO/IEC 27001-aligned security frameworks"
                ].map((measure, index) => (
                  <div key={index} className="flex items-start p-3 bg-green-50 rounded">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{measure}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">10. User Rights Under Indian Law</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">
                As a data principal under the Digital Personal Data Protection Act, 2023, you have the
                following rights:
              </p>
              <div className="space-y-3">
                {[
                  { title: "Right to Access", desc: "You may request a copy of your personal data held by us." },
                  { title: "Right to Correction", desc: "You may request correction or updating of inaccurate or incomplete data." },
                  { title: "Right to Erasure", desc: "You may request deletion of your personal data, subject to legal obligations." },
                  { title: "Right to Withdraw Consent", desc: "You may withdraw consent for data processing at any time." },
                  { title: "Right to Grievance Redressal", desc: "You may raise a grievance or complaint regarding data processing." }
                ].map((right, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-semibold text-gray-900 mb-2">{right.title}</h3>
                    <p className="text-gray-700">{right.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-gray-700">
                Requests can be submitted via email at{' '}
                <a href="mailto:inquiry@salhakar.com" className="text-blue-600 hover:text-blue-800 underline">
                  inquiry@salhakar.com
                </a>. We will process such
                requests within a reasonable time frame in accordance with applicable law.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">17. Contact Information</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">
                For any questions or clarifications regarding this Policy or our data handling practices,
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
                    <p className="text-gray-600">Data Protection Team</p>
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
                    <strong>Response Time:</strong> Within 48 hours
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              This Privacy Policy is effective as of the date of last update and applies to all users of our Services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;