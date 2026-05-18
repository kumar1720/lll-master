import React from "react";
import "../assets/css/TandC.css";

const sections = [
  {
    title: "Acceptance of Terms",
    content: (
      <p>
        By accessing and using the Lagan Lakshmi Infra website and services, you
        accept and agree to be bound by the terms and provision of this
        agreement. If you do not agree to abide by the above, please do not use
        this service.
      </p>
    ),
  },
  {
    title: "Use License",
    content: (
      <>
        <p>
          Permission is granted to temporarily download one copy of the
          materials on Lagan Lakshmi Infra's website for personal,
          non-commercial transitory viewing only. This is the grant of a
          license, not a transfer of title, and under this license you may not:
        </p>
        <ul>
          <li>Modify or copy the materials</li>
          <li>
            Use the materials for any commercial purpose or for any public
            display
          </li>
          <li>
            Attempt to decompile or reverse engineer any software contained on
            the website
          </li>
          <li>
            Remove any copyright or other proprietary notations from the
            materials
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "User Accounts",
    content: (
      <p>
        When you create an account with us, you must provide information that is
        accurate, complete, and current at all times. You are responsible for
        safeguarding the password and for all activities that occur under your
        account.
      </p>
    ),
  },
  {
    title: "Property Listings — Accuracy of Information",
    content: (
      <p>
        While we strive to provide accurate property information, we cannot
        guarantee the accuracy, completeness, or reliability of any property
        listings. Users should verify all information independently.
      </p>
    ),
  },
  {
    title: "User-Generated Content",
    content: (
      <p>
        By posting content on our platform, you grant us a non-exclusive,
        royalty-free, perpetual, and worldwide license to use, display, and
        distribute your content in connection with our services.
      </p>
    ),
  },
  {
    title: "Prohibited Uses",
    content: (
      <>
        <p>You may not use our services:</p>
        <ul>
          <li>
            For any unlawful purpose or to solicit others to perform unlawful
            acts
          </li>
          <li>
            To violate any international, federal, provincial, or state
            regulations, rules, laws, or local ordinances
          </li>
          <li>
            To infringe upon or violate our intellectual property rights or the
            intellectual property rights of others
          </li>
          <li>
            To harass, abuse, insult, harm, defame, slander, disparage,
            intimidate, or discriminate
          </li>
          <li>To submit false or misleading information</li>
          <li>
            To upload or transmit viruses or any other type of malicious code
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Service Availability",
    content: (
      <p>
        We reserve the right to withdraw or amend our service, and any service
        or material we provide on the website, in our sole discretion without
        notice. We will not be liable if for any reason all or any part of the
        website is unavailable at any time or for any period.
      </p>
    ),
  },
  {
    title: "Disclaimer",
    content: (
      <p>
        The information on this website is provided on an 'as is' basis. To the
        fullest extent permitted by law, Lagan Lakshmi Infra excludes all
        representations, warranties, conditions, and terms whether express or
        implied, statutory or otherwise.
      </p>
    ),
  },
  {
    title: "Limitations",
    content: (
      <p>
        In no event shall Lagan Lakshmi Infra, nor its directors, employees,
        partners, agents, suppliers, or affiliates, be liable for any indirect,
        incidental, special, consequential, or punitive damages, including
        without limitation, loss of profits, data, use, goodwill, or other
        intangible losses.
      </p>
    ),
  },
  {
    title: "Indemnification",
    content: (
      <p>
        You hereby indemnify Lagan Lakshmi Infra and undertake to keep Lagan
        Lakshmi Infra indemnified from and against any losses, damages, costs,
        liabilities, and expenses (including without limitation legal expenses
        and any amounts paid by Lagan Lakshmi Infra to a third party in
        settlement of a claim or dispute) incurred or suffered by Lagan Lakshmi
        Infra arising out of any breach by you of any provision of these terms.
      </p>
    ),
  },
  {
    title: "Termination",
    content: (
      <p>
        We may terminate or suspend your account and bar access to the service
        immediately, without prior notice or liability, under our sole
        discretion, for any reason whatsoever and without limitation, including
        but not limited to a breach of the Terms.
      </p>
    ),
  },
  {
    title: "Governing Law",
    content: (
      <p>
        These Terms shall be interpreted and governed by the laws of the
        jurisdiction in which Lagan Lakshmi Infra operates, without regard to
        its conflict of law provisions.
      </p>
    ),
  },
  {
    title: "Changes to Terms",
    content: (
      <p>
        We reserve the right, at our sole discretion, to modify or replace these
        Terms at any time. If a revision is material, we will try to provide at
        least 30 days notice prior to any new terms taking effect.
      </p>
    ),
  },
  {
    title: "Contact Information",
    content: (
      <>
        <p>
          If you have any questions about these Terms &amp; Conditions, please
          contact us at:
        </p>
        <p className="tc-contact-line">Email: info@laganlakshmiinfra.com</p>
        <p className="tc-contact-line">Phone: +918595543869</p>
      </>
    ),
  },
];

const TandC = () => {
  return (
    <div className="tc-page">
      <div className="tc-card">
        {/* Header */}
        <div className="tc-header">
          <h1 className="tc-title">Terms &amp; Conditions</h1>
          <div className="tc-title-bar" />
        </div>

        {/* Sections */}
        <div className="tc-body">
          {sections.map((section, index) => (
            <div className="tc-section" key={index}>
              <h2 className="tc-section-title">
                <span className="tc-icon">⚖️</span>
                {section.title}
              </h2>
              <div className="tc-section-content">{section.content}</div>
            </div>
          ))}

          {/* Last Updated */}
          <p className="tc-last-updated">
            <strong>Last Updated:</strong> March 19, 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default TandC;
