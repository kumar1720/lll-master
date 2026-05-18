import React from "react";
import "../assets/css/AboutPage.css";
import { FaHome, FaChevronRight, FaPlay } from "react-icons/fa";
import {
  MdHomeWork,
  MdPeopleAlt,
  MdHandshake,
  MdAddHome,
} from "react-icons/md";
import aboutBg from "../assets/img/hero/hero-1.jpg"; // replace with your image
import aboutVideo from "../assets/img/hero/hero-2.jpg"; // replace with your image

const features = [
  {
    icon: <MdHomeWork />,
    title: "Find Your Future Home",
    desc: "Explore carefully selected properties that match your lifestyle, budget, and long-term goals.",
  },
  {
    icon: <MdPeopleAlt />,
    title: "Experienced & Trusted Agents",
    desc: "Work with knowledgeable professionals who understand the local market and your requirements.",
  },
  {
    icon: <MdHandshake />,
    title: "Buy or Rent with Confidence",
    desc: "Choose from a wide range of verified homes and apartments in prime and emerging locations.",
  },
  {
    icon: <MdAddHome />,
    title: "List Your Property Easily",
    desc: "Create your listing in minutes and connect with genuine buyers or tenants faster.",
  },
];

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* ── Hero Banner ── */}
      <div
        className="about-hero"
        style={{ backgroundImage: `url(${aboutBg})` }}
      >
        <div className="about-breadcrumb">
          <h2>ABOUT US</h2>
          <div className="breadcrumb-trail">
            <FaHome className="bc-home-icon" />
            <span className="bc-link">Home</span>
            <FaChevronRight className="bc-arrow" />
            <span className="bc-current">About</span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <section className="about-content">
        <div className="about-container">
          {/* Left: Text + Features */}
          <div className="about-text">
            <h1 className="about-heading">WELCOME TO LAGAN LAKSHMI INFRA</h1>

            <p className="about-desc">
              Lagan Lakshmi Infra is a trusted real estate platform dedicated to
              helping you buy, rent, and sell properties with ease. We focus on
              transparency, verified listings, and expert guidance to make your
              property journey smooth and reliable.
            </p>

            <div className="about-features">
              {features.map((f, i) => (
                <div className="feature-row" key={i}>
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-body">
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Video Thumbnail */}
          <div className="about-media">
            <div
              className="about-video-thumb"
              style={{ backgroundImage: `url(${aboutVideo})` }}
            >
              <button className="play-btn" aria-label="Play video">
                <FaPlay />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
