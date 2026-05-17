import React, { useState } from "react";
import "../assets/css/testimonials.css";

const testimonials = [
  {
    id: 1,
    text: "Extremely professional agents with deep local market knowledge in Bangalore. They guided us through the documentation and made renting our new villa a completely stress-free experience.",
    name: "Vikas Mehta",
    role: "Tenant",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    text: "The entire process was smooth and transparent. The team understood our specific requirements for a 4BHK in Noida and helped us secure a great deal within our budget. Highly recommended.",
    name: "Rohit Sharma",
    role: "Home Buyer",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    id: 3,
    text: "Listing my commercial property in Mumbai was quick and hassle-free. I received high-quality inquiries and closed the lease faster than expected. Exceptional service and backend support.",
    name: "Arjun Malhotra",
    role: "Property Owner",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    id: 4,
    text: "I had a great experience finding my dream apartment. The team was responsive, knowledgeable, and always available to answer my questions. Would definitely recommend to friends and family.",
    name: "Priya Nair",
    role: "Home Buyer",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 5,
    text: "Outstanding support throughout our property search in Hyderabad. The consultants were patient, well-informed, and helped us compare multiple options before making the best decision.",
    name: "Sneha Kapoor",
    role: "Tenant",
    rating: 4,
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
];

const StarRating = ({ rating }) => (
  <div className="testi-stars">
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star} className={star <= rating ? "star filled" : "star"}>
        ★
      </span>
    ))}
  </div>
);

const VISIBLE = 2;

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [animating, setAnimating] = useState(false);

  const canPrev = index > 0;
  const canNext = index + VISIBLE < testimonials.length;

  const slide = (dir) => {
    if (animating) return;
    if (dir === "prev" && !canPrev) return;
    if (dir === "next" && !canNext) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setIndex((i) => (dir === "next" ? i + 1 : i - 1));
      setAnimating(false);
      setDirection(null);
    }, 380);
  };

  const goTo = (i) => {
    if (animating || i === index) return;
    setDirection(i > index ? "next" : "prev");
    setAnimating(true);
    setTimeout(() => {
      setIndex(i);
      setAnimating(false);
      setDirection(null);
    }, 380);
  };

  const visible = testimonials.slice(index, index + VISIBLE);
  const slideClass = animating
    ? direction === "next"
      ? "slide-out-left"
      : "slide-out-right"
    : "";

  return (
    <section className="testi-section">
      <div className="testi-container">
        <div className="testi-header">
          <h2 className="testi-title">WHAT OUR CLIENTS SAY</h2>
          <div className="testi-nav">
            <button
              className={`testi-nav-btn${!canPrev ? " disabled" : ""}`}
              onClick={() => slide("prev")}
              aria-label="Previous"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="18"
                height="18"
              >
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              className={`testi-nav-btn${!canNext ? " disabled" : ""}`}
              onClick={() => slide("next")}
              aria-label="Next"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="18"
                height="18"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="testi-viewport">
          <div className={`testi-cards ${slideClass}`}>
            {visible.map((t) => (
              <div className="testi-card" key={t.id}>
                <div className="testi-bubble">
                  <p className="testi-text">{t.text}</p>
                  <div className="testi-bubble-tail" />
                </div>
                <div className="testi-author">
                  <img src={t.image} alt={t.name} className="testi-avatar" />
                  <div className="testi-author-info">
                    <h4 className="testi-name">{t.name}</h4>
                    <span className="testi-role">{t.role}</span>
                    <StarRating rating={t.rating} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testi-dots">
          {Array.from({ length: testimonials.length - VISIBLE + 1 }).map(
            (_, i) => (
              <button
                key={i}
                className={`testi-dot${i === index ? " active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
