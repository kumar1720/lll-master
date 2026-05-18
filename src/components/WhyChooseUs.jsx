import "../assets/css/WhyChooseUs.css";
import { FaHome, FaShoppingCart, FaUserTie, FaChartLine } from "react-icons/fa";
import bgImage from "../assets/img/chooseus/chooseus-bg.jpg";

const features = [
  {
    icon: <FaHome />,
    title: "Find Your Future Home",
    desc: "Discover homes that truly match your lifestyle, budget, and long-term goals.",
  },
  {
    icon: <FaShoppingCart />,
    title: "Buy or Rent with Confidence",
    desc: "Access verified properties for sale or rent in prime and emerging locations.",
  },
  {
    icon: <FaUserTie />,
    title: "Trusted & Experienced Agents",
    desc: "Work with professionals who understand the local market and your needs.",
  },
  {
    icon: <FaChartLine />,
    title: "List Your Property Easily",
    desc: "List your property with ease and reach genuine buyers or tenants faster.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      className="wcu-section"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="container">
        {/* ── Title Block ── */}
        <div className="wcu-title">
          <h2>WHY CHOOSE US</h2>
          <p>
            We are committed to making your property journey simple and
            transparent. With local expertise, verified listings, and
            personalized support, we help you make confident decisions—whether
            you're buying, renting, or selling.
          </p>
        </div>

        {/* ── 2×2 Grid ── */}
        <div className="wcu-grid">
          {features.map((f, i) => (
            <div className="wcu-item" key={i}>
              <div className="wcu-icon">{f.icon}</div>
              <div className="wcu-content">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
