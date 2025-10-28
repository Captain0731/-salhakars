import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
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
              <h1 className="text-3xl font-bold text-gray-900">Refund Policy</h1>
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
                This Refund Policy ("Policy") outlines the terms and conditions under which
                ExpertSetu LLP ("Company", "ExpertSetu", "we", "our", or "us") provides refunds for
                payments made for the use of our website, mobile application, and AI-powered legal
                assistance platform ("Services").
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                By subscribing to, purchasing, or using any of our Services, you acknowledge that you
                have read, understood, and agreed to this Policy.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-gray-700">
                  This Policy forms an integral part of our Terms of Service and must be read together
                  with our Privacy Policy and Cookie Policy.
                </p>
              </div>
            </div>
          </section>

          {/* Nature of Services */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">2. Nature of Our Services</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                ExpertSetu provides AI-driven legal assistance and SaaS-based solutions intended to
                help users access, organize, and research legal information efficiently.
              </p>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <p className="text-gray-700">
                  Given the intangible, digital, and subscription-based nature of these services, we do
                  not provide refunds once a payment or subscription has been successfully processed.
                </p>
              </div>
            </div>
          </section>

          {/* No Refund Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">3. No Refund Policy</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                All payments made for any subscription plan, credit purchase, consultation, or
                custom legal data access on the ExpertSetu platform are final and non-refundable.
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="mb-3 text-gray-700 font-medium">Once a service is purchased or activated:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>No refund or cancellation will be permitted, whether partially or in full.</li>
                  <li>This applies even if the user does not utilize or access the service after purchase.</li>
                </ul>
              </div>
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="text-gray-700">
                  We strongly encourage users to review the service details, pricing, and features
                  before completing a transaction.
                </p>
              </div>
            </div>
          </section>

          {/* Exceptions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">4. Exceptions</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">
                Notwithstanding the above, refunds may be issued only under the following limited
                circumstances:
              </p>
              
              <div className="space-y-6">
                {/* Duplicate Payment */}
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">A</span>
                    Duplicate Payment
                  </h3>
                  <p className="text-gray-700">
                    If a user is charged more than once for the same transaction due to a technical or
                    payment gateway error, we will refund the duplicate amount upon verification.
                  </p>
                </div>

                {/* Incorrect or Failed Transaction */}
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">B</span>
                    Incorrect or Failed Transaction
                  </h3>
                  <p className="text-gray-700">
                    If a transaction fails but the payment is still debited from your account, and the service
                    is not delivered, the amount will be refunded once confirmed by our payment
                    processor.
                  </p>
                </div>

                {/* Unauthorized Payment */}
                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">C</span>
                    Unauthorized Payment
                  </h3>
                  <p className="text-gray-700">
                    If a payment is made without the account holder's authorization and is reported within 7
                    working days, we will investigate and issue a refund if verified as unauthorized.
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 font-medium mb-2">Note:</p>
                <p className="text-gray-700">
                  All refund requests under these exceptions must be supported by relevant transaction
                  details (payment receipt, order ID, or screenshot).
                </p>
              </div>
            </div>
          </section>

          {/* Refund Request Procedure */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">5. Refund Request Procedure</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">To request a refund under the above exceptions, users must:</p>
              
              <div className="space-y-4">
                <div className="flex items-start p-3 bg-blue-50 rounded">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">1</span>
                  <span className="text-gray-700">Send an email to <a href="mailto:inquiry@salhakar.com" className="text-blue-600 hover:text-blue-800 underline">inquiry@salhakar.com</a> with the subject line: "Refund Request – [Transaction ID]"</span>
                </div>
                <div className="flex items-start p-3 bg-blue-50 rounded">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">2</span>
                  <div className="text-gray-700">
                    <p className="mb-2">Provide:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Full name and registered email address</li>
                      <li>Payment ID or transaction reference</li>
                      <li>Reason for refund request</li>
                      <li>Supporting evidence (such as payment confirmation, error message, or gateway reference)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">Refund requests will be reviewed by our support and finance teams.</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Acknowledgment of the request will be sent within 48 business hours</li>
                  <li>Approved refunds will be processed within 7 to 14 working days, depending on your bank or payment provider</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refund Mode and Timeline */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">6. Refund Mode and Timeline</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                Approved refunds will be made only through the original payment method used
                during the transaction.
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                No cash or alternate refund channels will be provided.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Processing timelines may vary based on the payment method:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-gray-900 mb-2">UPI/Credit Card/Debit Card</h4>
                    <p className="text-gray-700">7–10 working days</p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-gray-900 mb-2">Net Banking or Wallet Payments</h4>
                    <p className="text-gray-700">10–14 working days</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Non-Eligible Transactions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">7. Non-Eligible Transactions</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700">Refunds will not be provided for the following situations:</p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Change of mind or dissatisfaction with features</li>
                  <li>User error or incorrect data input</li>
                  <li>Service interruptions or delays due to internet or device issues</li>
                  <li>Account suspension or termination due to violation of Terms of Service</li>
                  <li>Expired or unused subscription credits</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cancellation of Subscription */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">8. Cancellation of Subscription</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                Users may choose to cancel their subscription or recurring plan at any time.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <p className="mb-3 text-gray-700">
                  However, cancellation will only stop future renewals — it will not trigger a refund for
                  the current billing period.
                </p>
                <p className="text-gray-700">
                  Access to paid features will continue until the subscription term expires.
                </p>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">9. Governing Law and Jurisdiction</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                This Policy shall be governed by and construed in accordance with the laws of India,
                without regard to conflict of law principles.
              </p>
              <p className="mb-4 text-gray-700 leading-relaxed">
                Any disputes, claims, or proceedings arising out of or relating to this Policy shall be
                subject to the exclusive jurisdiction of the competent courts located in Ahmedabad,
                Gujarat.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">10. Contact Information</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                For refund-related queries, disputes, or support, please contact:
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
                    <p className="text-gray-600">Refund Support Team</p>
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

          {/* Grievance Officer */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">11. Grievance Officer</h2>
            <div className="prose max-w-none">
              <p className="mb-4 text-gray-700 leading-relaxed">
                In compliance with Rule 5(9) of the Information Technology (Reasonable Security
                Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011,
                and Section 13(2) of the Digital Personal Data Protection Act, 2023, the following
                officer has been appointed to handle user grievances and payment-related issues:
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
                    All grievances will be acknowledged within 48 hours and resolved within 30 days of receipt.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              This Refund Policy is effective as of the date of last update and applies to all users of our Services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
