import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/PrivacyPolicy.css";

const sections = [
  {
    title: "Introduction",
    content: (
      <p>
        At Lagan Lakshmi Infra, we are committed to protecting your privacy and
        ensuring the security of your personal information. This Privacy Policy
        explains how we collect, use, disclose, and safeguard your information
        when you visit our website or use our services.
      </p>
    ),
  },
  {
    title: "Information We Collect",
    content: (
      <>
        <div className="pap-subsection">
          <h3 className="pap-sub-title">
            <span className="pap-dot" />
            Personal Information
          </h3>
          <p>
            We may collect personal information that you provide directly to us,
            including:
          </p>
          <ul>
            <li>Name and contact information (email address, phone number)</li>
            <li>Account information (username, password)</li>
            <li>Property preferences and search history</li>
            <li>Communication preferences</li>
          </ul>
        </div>
        <div className="pap-subsection">
          <h3 className="pap-sub-title">
            <span className="pap-dot" />
            Automatically Collected Information
          </h3>
          <p>
            When you visit our website, we may automatically collect certain
            information, including:
          </p>
          <ul>
            <li>IP address and location information</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on our site</li>
            <li>Device information</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    title: "How We Use Your Information",
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide and improve our services</li>
          <li>Communicate with you about our services</li>
          <li>Process transactions and send related information</li>
          <li>Send marketing communications (with your consent)</li>
          <li>Analyze website usage and improve user experience</li>
          <li>Comply with legal obligations</li>
        </ul>
      </>
    ),
  },
  {
    title: "Information Sharing",
    content: (
      <>
        <p>
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your consent, except as described in this
          policy:
        </p>
        <ul>
          <li>With service providers who assist us in operating our website</li>
          <li>When required by law or to protect our rights</li>
          <li>In connection with a business transfer or merger</li>
        </ul>
      </>
    ),
  },
  {
    title: "Data Security",
    content: (
      <p>
        We implement appropriate security measures to protect your personal
        information against unauthorized access, alteration, disclosure, or
        destruction. However, no method of transmission over the internet is
        100% secure.
      </p>
    ),
  },
  {
    title: "Your Rights",
    content: (
      <>
        <p>You have the right to:</p>
        <ul>
          <li>Access and update your personal information</li>
          <li>Request deletion of your data</li>
          <li>Opt out of marketing communications</li>
          <li>Request data portability</li>
        </ul>
      </>
    ),
  },
  {
    title: "Cookies",
    content: (
      <p>
        We use cookies and similar technologies to enhance your browsing
        experience, analyze website traffic, and personalize content. You can
        control cookie settings through your browser preferences.
      </p>
    ),
  },
  {
    title: "Third-Party Links",
    content: (
      <p>
        Our website may contain links to third-party websites. We are not
        responsible for the privacy practices of these external sites.
      </p>
    ),
  },
  {
    title: "Children's Privacy",
    content: (
      <p>
        Our services are not intended for children under 13. We do not knowingly
        collect personal information from children under 13.
      </p>
    ),
  },
  {
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new policy on this page and updating the
        "Last Updated" date.
      </p>
    ),
  },
  {
    title: "Contact Us",
    content: (
      <>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <p className="pap-contact-line">Email: info@laganlakshmiinfra.com</p>
        <p className="pap-contact-line">Phone: +918595543869</p>
      </>
    ),
  },
];

const PrivacyPolicy = () => {
  return (
    <>
      <Header />
      <div className="pap-page">
        <div className="pap-card">
          {/* Header */}
          <div className="pap-header">
            <h1 className="pap-title">Privacy Policy</h1>
            <div className="pap-title-bar" />
          </div>

          {/* Sections */}
          <div className="pap-body">
            {sections.map((section, index) => (
              <div className="pap-section" key={index}>
                <h2 className="pap-section-title">
                  <span className="pap-icon">📋</span>
                  {section.title}
                </h2>
                <div className="pap-section-content">{section.content}</div>
              </div>
            ))}

            {/* Last Updated */}
            <p className="pap-last-updated">
              <strong>Last Updated:</strong> March 19, 2026
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
