import React, { useState } from "react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const pricingData = {
  student: [
    {
      title: "Free",
      subtitle: "Full access to all premium features",
      price: "₹0/mo",
      features: [
        { text: "Unlimited Judgment Access", included: true },
        { text: "Access to the full legal library ", included: true },
        { text: "Access to sakhi AI ", included: true },

        { text: "50 Youtube video summerisations", included: true },
        { text: "5000+ legal templates", included: true },


        { text: "24/7 AI support ", included: true },
        { text: "150+ PDF Uploads", included: true },
        { text: "Smart Dashboard", included: true },
        { text: "API Access", included: false }
      ],
      button: "Get Started",
      popular: false
    },
    {
      title: "Pro",
      subtitle: "Ideal for advanced legal research",
      price: "₹499/mo",
      features: [
        { text: "Unlimited Judgment Access", included: true },
        { text: "Access to the full legal library ", included: true },
        { text: "Access to sakhi AI ", included: true },

        { text: "50 Youtube video summerisations", included: true },
        { text: "5000+ legal templates", included: true },


        { text: "24/7 AI support ", included: true },
        { text: "150+ PDF Uploads", included: true },
        { text: "Smart Dashboard", included: true },
        { text: "API Access", included: false }
      ],
      button: "Start Free Trial",
      popular: true
    },
    {
      title: "Ultimate",
      subtitle: "Unleash the best of Salhakar AI",
      price: "₹999/mo",
      features: [
        { text: "Unlimited Judgment Access", included: true },
        { text: "Access to the full legal library ", included: true },
        { text: "All Pro features", included: true },
        { text: "Priority Support (24/7)", included: true },
        { text: "API Access", included: true },
        { text: "Custom Integrations", included: true },
        { text: "Early Access to New Features", included: true },
        { text: "Dedicated Account Manager", included: true },
        { text: "Usage Analytics", included: true }
      ],
      button: "Start Free Trial",
      popular: false
    }
  ],
  professional: [
    {
      title: "free",
      subtitle: "Full access to all premium features",
      price: "₹/mo",
      features: [
        { text: "Access to 50,000+ Legal Judgments", included: true },
        { text: "Professional Legal Templates", included: true },
        { text: "AI Chatbot Support", included: true },
        { text: "YouTube Video Summaries", included: true },
        { text: "Basic Law Mapping", included: true },
        { text: "Advanced Search Filters", included: false },
        { text: "Priority Support", included: false },
        { text: "API Access", included: false }
      ],
      button: "Start Free Trial",
      popular: false
    },
    {
      title: "Pro",
      subtitle: "Comprehensive solution for legal professionals",
      price: "₹699/mo",
      features: [
        { text: "Access to 100,000+ Legal Judgments", included: true },
        { text: "Premium Legal Templates", included: true },
        { text: "Unlimited AI Chatbot", included: true },
        { text: "Unlimited Video Summaries", included: true },
        { text: "Old to New Law Mapping", included: true },
        { text: "Advanced Search Filters", included: true },
        { text: "Priority Support", included: true },
        { text: "API Access", included: false }
      ],
      button: "Start Free Trial",
      popular: true
    },
    {
      title: "Ultimate",
      subtitle: "Full-featured plan for growing practices",
      price: "₹1499/mo",
      features: [
        { text: "All Pro features", included: true },
        { text: "Unlimited Judgment Access", included: true },
        { text: "Full API Access", included: true },
        { text: "Custom Integrations", included: true },
        { text: "Priority Support (24/7)", included: true },
        { text: "Dedicated Account Manager", included: true },
        { text: "Usage Analytics & Reports", included: true },
        { text: "On-Site Training", included: true }
      ],
      button: "Start Free Trial",
      popular: false
    }
  ],
  corporate: [
    {
      title: "Basic",
      subtitle: "Tailored solutions for small teams",
      price: "Custom",
      features: [
        { text: "Unlimited Judgment Access", included: true },
        { text: "Custom Legal Templates", included: true },
        { text: "Advanced AI Chatbot", included: true },
        { text: "Video Summary Services", included: true },
        { text: "Basic Law Mapping", included: true },
        { text: "Dedicated Support", included: true },
        { text: "Custom Integration", included: true },
        { text: "Team Collaboration Tools", included: true }
      ],
      button: "Contact Sales Team",
      popular: false
    },
    {
      title: "Pro",
      subtitle: "Enterprise-grade features for mid-size organizations",
      price: "Custom",
      features: [
        { text: "Unlimited Legal Judgment Access", included: true },
        { text: "Enterprise Templates Library", included: true },
        { text: "Unlimited AI Chatbot", included: true },
        { text: "Unlimited Video Summaries", included: true },
        { text: "Complete Law Mapping Suite", included: true },
        { text: "Advanced Search & Filters", included: true },
        { text: "Priority Support (24/7)", included: true },
        { text: "Full API Access", included: true }
      ],
      button: "Contact Sales Team",
      popular: true
    },
    {
      title: "Ultimate",
      subtitle: "Complete solution for large enterprises",
      price: "Custom",
      features: [
        { text: "All Corporate Features", included: true },
        { text: "Unlimited Access to All Resources", included: true },
        { text: "Custom Enterprise Templates", included: true },
        { text: "Dedicated Account Manager", included: true },
        { text: "Custom SLAs", included: true },
        { text: "On-Site Training", included: true },
        { text: "White-Label Options", included: true },
        { text: "Priority SLA", included: true }
      ],
      button: "Contact Sales Team",
      popular: false
    }
  ]
};

function PricingPage() {
  const [activeCategory, setActiveCategory] = useState("student");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);

  const faqData = [
    {
      id: 1,
      question: "How does the pricing work?",
      answer: "You get full access to Pro features for one month at no cost. After the trial, you can upgrade to Pro or Ultimate to continue uninterrupted research."
    },
    {
      id: 2,
      question: "Is my payment safe and private?",
      answer: "Yes, payments are securely processed. Your personal data is encrypted and protected to comply with Indian data privacy laws."
    },
    {
      id: 3,
      question: "Can I upgrade, downgrade or cancel anytime?",
      answer: "You can change or cancel your plan whenever you wish. Your data remains safe, and you retain access until the current billing cycle ends.​"
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer: " We accept UPI, major credit/debit cards, and Indian netbanking. GST-compliant invoices are provided for Pro and Ultimate plans."
    },
    {
      id: 5,
      question: "Will there be any hidden charges or setup fees?",
      answer: "No, our pricing is fully transparent, with zero hidden fees on all plans."
    },
    {
      id: 6,
      question: "Will I lose my saved research if I cancel?",
      answer: "If you cancel, you retain access until your renewal date. Saved searches are protected, but premium features will be paused until you resume service.​"
    },
    {
      id: 7,
      question: "Do you offer discounts for teams, students, or law colleges?",
      answer: "Yes, special discounts are available. Contact support for details or custom plans for academic/corporate bulk users."
    },
    {
      id: 8,
      question: "How do monthly and annual billing differ?",
      answer: "Monthly billing gives flexibility to switch plans. Annual billing offers extra savings and uninterrupted access for 12 months."
    },
    {
      id: 9,
      question: "Can multiple users from my firm share one subscription?",
      answer: "Our Ultimate plan is designed for team/firm use and supports multiple user dashboards​"
    },
    {
      id: 10,
      question: "How do I upgrade my plan?",
      answer: "You can upgrade your plan at any time. Simply contact our support team, and we'll guide you through the process."
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleButtonClick = (buttonText) => {
    if (buttonText === "Start Free Trial") {
      window.location.href = "/signup";
    } else {
      window.location.href = "/legal-chatbot";
    }
  };

  // Calculate yearly prices (assuming 20% discount for yearly)
  const getPrice = (monthlyPrice) => {
    // Handle free plans - they stay free regardless of billing cycle
    if (!monthlyPrice || monthlyPrice === "₹/mo" || monthlyPrice === "₹0/mo" || monthlyPrice.includes("Custom")) {
      return monthlyPrice;
    }
    
    if (billingCycle === "yearly") {
      const priceValue = parseFloat(monthlyPrice.replace("₹", "").replace("/mo", ""));
      // If parsing fails (NaN), return original price
      if (isNaN(priceValue) || priceValue === 0) {
        return monthlyPrice;
      }
      const yearlyPrice = priceValue * 12 * 0.8;
      return `₹${Math.round(yearlyPrice)}/mo`;
    }
    return monthlyPrice;
  };



  return (
    <div className="min-h-screen bg-[#F9FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-30 pb-12 md:pt-28 md:pb-16 bg-white relative z-20 border-2 border-gray-200  shadow-lg p-10 md:p-14 ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-7">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            style={{
              color: "#1E65AD",
              fontFamily: "'Heebo', 'Helvetica Hebrew Bold', sans-serif",
              fontWeight: 700
            }}
          >
            Pricing Plans
          </h1>
          <div className="w-20 h-1 bg-[#CF9B63] mx-auto rounded-full"></div>
          <p
            className="text-lg md:text-xl text-[#8C969F] max-w-2xl mx-auto mb-6 leading-relaxed pt-4"
            style={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 400
            }}
          >
            Discover India’s most user-friendly AI legal research tool with straightforward pricing and no hidden fees.
          </p>
        </div>
      </section>



      {/* Category Toggle Section */}
      <section className="py-10 md:py-12 bg-[#F9FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          {/* Category Toggle */}
          <div className="flex justify-center mb-8">
            <div className="relative inline-flex items-center bg-gray-100 rounded-xl p-1 shadow-inner">
              {/* Sliding background indicator */}
              <div
                className={`absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-in-out z-0`}
                style={{
                  left: activeCategory === 'student' ? '4px' : activeCategory === 'professional' ? 'calc(33.33% + 2px)' : 'calc(66.66% + 2px)',
                  width: 'calc(33.33% - 4px)',
                  backgroundColor: activeCategory === 'student' ? '#1E65AD' : activeCategory === 'professional' ? '#CF9B63' : '#1E65AD',
                  boxShadow: activeCategory === 'student'
                    ? '0 2px 8px rgba(30, 101, 173, 0.3)'
                    : activeCategory === 'professional'
                      ? '0 2px 8px rgba(207, 155, 99, 0.3)'
                      : '0 2px 8px rgba(30, 101, 173, 0.3)',
                }}
              />

              {["student", "professional", "corporate"].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base capitalize transition-all duration-300 relative z-10 min-w-[120px] md:min-w-[160px] ${activeCategory === category
                      ? "text-white"
                      : "text-[#8C969F] hover:text-[#1E65AD]"
                    }`}
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 600
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {activeCategory === "student" && (
            <div className="flex justify-center items-center gap-4 mb-2">
              <span className=" md:text-base font-semibold transition-colors duration-300 text-[#8C969F] text-center">
                <p
                  className="text-lg md:text-xl text-[#8C969F] max-w-2xl mx-auto mb-6 leading-relaxed pt-1"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 400
                  }}
                >

                  Premium tools and unlimited legal research for students and academic learners who want to ace their law studies. </p>
              </span>
            </div>

          )}

          {activeCategory === "professional" && (
            <div className="flex justify-center items-center gap-4 mb-2">
              <span className="text-sm md:text-base font-semibold transition-colors duration-300 text-[#8C969F] text-center">
                <p
                  className="text-lg md:text-xl text-[#8C969F] max-w-2xl mx-auto mb-6 leading-relaxed pt-1"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 400
                  }}
                >

                  Full-featured legal research for independent lawyers and professionals needing smarter, faster case solutions.
                </p>
              </span>
            </div>
          )}

          {activeCategory === "corporate" && (
            <div className="flex justify-center items-center gap-4 mb-2">
              <span className="text-sm md:text-base font-semibold transition-colors duration-300 text-[#8C969F] text-center">
                <p
                  className="text-lg md:text-xl text-[#8C969F] max-w-2xl mx-auto mb-6 leading-relaxed pt-1"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 400
                  }}
                >

                  Ultimate premium for law firms, legal teams, and businesses requiring unlimited access, analytics, and team collaboration.
                </p>
              </span>
            </div>
          )}



          {/* Billing Cycle Toggle Switch */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <span
              className={`text-sm md:text-base font-semibold transition-colors duration-300 ${billingCycle === "m" ? "text-[#1E65AD]" : "text-[#8C969F]"
                }`}
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              Monthly
            </span>
            <label className="relative inline-block cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={billingCycle === "yearly"}
                onChange={(e) => setBillingCycle(e.target.checked ? "yearly" : "monthly") }
              />
              <div
                className="relative overflow-hidden"
                style={{
                  width: "60px",
                  height: "30px",
                  backgroundColor: billingCycle === "yearly" ? "#1E65AD" : "#d3d3d3",
                  borderRadius: "20px",
                  border: "4px solid transparent",
                  transition: "0.3s",
                  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.25) inset",
                  cursor: "pointer"
                }}
              >
                <div
                  className="absolute top-0 left-0 rounded-full transition-transform duration-300"
                  style={{
                    backgroundColor: "#fff",
                    transform: billingCycle === "yearly" ? "translateX(30px)" : "translateX(-30px)",
                    borderRadius: "20px",
                    boxShadow: "0 0 10px 3px rgba(0, 0, 0, 0.25)",
                    width: "100%",
                    height: "100%"
                  }}
                />
              </div>
            </label>
            <span
              className={`text-sm md:text-base font-semibold transition-colors duration-300 ${billingCycle === "yearly" ? "text-[#1E65AD]" : "text-[#8C969F]"
                }`}
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              Yearly
            </span>
          </div>

          {/* Pricing Cards Section */}
          {(() => {
            const filteredPlans = pricingData[activeCategory].filter((plan) => {
              // Hide free plan when yearly billing is selected
              if (billingCycle === "yearly") {
                const isFree = !plan.price || plan.price === "₹/mo" || plan.price === "₹0/mo" || plan.price.toLowerCase().includes("free");
                return !isFree;
              }
              return true;
            });
            
            const planCount = filteredPlans.length;
            const useFlex = planCount < 3;
            const gridCols = planCount === 2 ? "md:grid-cols-2" : planCount === 1 ? "md:grid-cols-1" : "md:grid-cols-3";
            
            return (
              <div className={useFlex 
                ? `flex flex-col md:flex-row justify-center items-center gap-6 md:gap-8 mb-20` 
                : `grid grid-cols-1 ${gridCols} gap-6 md:gap-8 mb-20`
              }>
                {filteredPlans.map((plan, index) => (
              <div
                key={plan.title}
                className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 relative hover:shadow-xl transition-shadow duration-300${plan.popular ? "border-2 border-[#1E65AD]" : "border border-gray-200"
                  }`}
              >
                {/* Most Popular Badge */}
                {plan.popular && (
                  <div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#1E65AD] text-white px-4 py-1.5 rounded-full text-xs font-semibold"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="mb-8 text-center" style={{ marginTop: plan.popular ? "1rem" : "0" }}>
                  <h3
                    className="text-2xl md:text-3xl font-bold mb-3"
                    style={{
                      color: "#1E65AD",
                      fontFamily: "'Heebo', 'Helvetica Hebrew Bold', sans-serif",
                      fontWeight: 700,
                      letterSpacing: "-0.02em"
                    }}
                  >
                    {plan.title}
                  </h3>
                  <p
                    className="text-sm md:text-base text-[#8C969F] mb-6 leading-relaxed"
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: 400
                    }}
                  >
                    {plan.subtitle}
                  </p>
                  <div className="flex items-baseline justify-center gap-1 mb-6">
                    {(() => {
                      const isFree = !plan.price || plan.price === "₹/mo" || plan.price === "₹0/mo" || plan.price.toLowerCase().includes("free");
                      const isCustom = plan.price === "Custom";
                      const displayPrice = isFree ? "Free" : isCustom ? plan.price : getPrice(plan.price).replace("/mo", "").replace("/yr", "");
                      
                      return (
                        <>
                          <span
                            className="text-4xl md:text-5xl font-bold"
                            style={{
                              color: "#1E65AD",
                              fontFamily: "'Heebo', 'Helvetica Hebrew Bold', sans-serif",
                              fontWeight: 700,
                              letterSpacing: "-0.02em"
                            }}
                          >
                            {displayPrice}
                          </span>
                          {!isFree && !isCustom && (
                            <span
                              className="text-lg md:text-xl font-normal text-[#1E65AD]"
                              style={{
                                fontFamily: "'Heebo', 'Helvetica Hebrew Bold', sans-serif",
                                fontWeight: 400
                              }}
                            >
                              {billingCycle === "yearly" ? "/year" : "/month"}
                            </span>
                          )}
                          {!isFree && !isCustom && billingCycle === "yearly" && (
                            <span
                              className="ml-2 text-xs text-red-500 font-semibold"
                              style={{ fontFamily: "'Roboto', sans-serif" }}
                            >
                              (Save 20%)
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>

                <button
                  onClick={() => handleButtonClick(plan.button)}
                  className={`w-full py-3.5 md:py-4 rounded-xl font-semibold text-sm md:text-base transition-all duration-200 ${plan.popular
                      ? "bg-[#1E65AD] text-white hover:bg-[#185a9a] hover:shadow-lg"
                      : "bg-white text-[#1E65AD] border-2 border-[#1E65AD] hover:bg-[#F9FAFC]"
                    }`}
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontWeight: 600
                  }}
                >
                  {plan.button}
                </button>

                <ul className="mb-8 space-y-4 mt-10">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <svg
                          className="w-5 h-5 text-[#1E65AD] mt-0.5 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-[#8C969F] mt-0.5 flex-shrink-0 opacity-40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                      <span
                        className={`text-sm md:text-base leading-relaxed ${feature.included ? "text-[#8C969F]" : "text-[#8C969F] line-through opacity-40"
                          }`}
                        style={{
                          fontFamily: "'Roboto', sans-serif",
                          fontWeight: 400
                        }}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>


              </div>
            ))}
              </div>
            );
          })()}
        </div>
      </section>

   

      {/* Contact Sales Team Card */}
      <section className="py-12 pb-20 md:pb-24 bg-[#F9FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="bg-white rounded-2xl p-8 md:p-12 text-center border border-[#1E65AD]"
            style={{
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)"
            }}
          >
            <h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1E65AD] mb-4 leading-tight"
              style={{ 
                fontFamily: "'Heebo', 'Helvetica Hebrew Bold', sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.02em"
              }}
            >
              Need a Custom Solution?
            </h2>
            <p
              className="text-base md:text-lg text-[#8C969F] mb-8 max-w-2xl mx-auto leading-relaxed"
              style={{ 
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 400
              }}
            >
              Contact our sales team for enterprise solutions, integrations, and volume discounts.
            </p>
            <button
              onClick={() => handleButtonClick("Contact Sales Team")}
              className="px-8 md:px-12 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-200 bg-white border-2 border-[#1E65AD] text-[#1E65AD] hover:bg-[#F9FAFC]"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 600
              }}
            >
              Contact Sales Team
            </button>
          </div>
        </div>
      </section>

      
         {/* FAQ Section */}
         <section className="py-10 md:py-20 bg-[#F9FAFC]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-14 xl:px-18">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 "
            style={{
              color: "#1E65AD",
              fontFamily: "'Heebo', 'Helvetica Hebrew Bold', sans-serif",
              fontWeight: 700,
              letterSpacing: "-0.02em"
            }}
          >
            FAQ
          </h2>
          
          <div className="space-y-0 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
            {faqData.map((item, index) => (
              <div
                key={item.id}
                
              >
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full py-5 md:py-6 px-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <span
                    className="text-base md:text-lg font-semibold flex-1 pr-4"
                    style={{
                      color: "#1E65AD",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: 600
                    }}
                  >
                    {item.question}
                  </span>
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${
                        openFaq === item.id ? "rotate-180" : ""
                      }`}
                      style={{
                        color: openFaq === item.id ? "#1E65AD" : "#8C969F"
                      }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {openFaq === item.id ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      )}
                    </svg>
                  </div>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === item.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-4 pb-5 md:pb-6">
                    <p
                      className="text-sm md:text-base leading-relaxed"
                      style={{
                        color: "#8C969F",
                        fontFamily: "'Roboto', sans-serif",
                        fontWeight: 400
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default PricingPage;

