import BrandSlider from "../components/BrandSlider";
import Consultants from "../components/Consultants";
import ContactSection from "../components/ContactSection";
import FeatureProperty from "../components/FeatureProperty";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import PropertySection from "../components/PropertySection";
import SearchSection from "../components/SearchSection";
import Testimonials from "../components/Testimonials";
import WhyChooseUs from "../components/WhyChooseUs";
import ChatbotIcon from "../components/ChatbotIcon";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <SearchSection />
      <PropertySection />
      <WhyChooseUs />
      <FeatureProperty />
      <Consultants />
      <Testimonials />
      <BrandSlider />
      <ContactSection />
      <ChatbotIcon />
      <Footer />
    </>
  );
};

export default Home;