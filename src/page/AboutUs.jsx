import React from "react";
import Header from "../components/Header";
import Consultants from "../components/Consultants";
import Testimonials from "../components/Testimonials";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import AboutPage from "../components/AboutPage";

const AboutUs = () => {
  return (
    <>
      <Header />
      <AboutPage />
      <Consultants />
      <Testimonials />
      <ContactSection />
      <Footer />
    </>
  );
};

export default AboutUs;
