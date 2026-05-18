import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "../assets/css/Hero.css";

import hero1 from "../assets/img/hero/hero-1.jpg";
import hero2 from "../assets/img/hero/hero-2.jpg";
import hero3 from "../assets/img/hero/hero-3.jpg";
import hero4 from "../assets/img/hero/hero-1.jpg";
import hero5 from "../assets/img/hero/hero-2.jpg";

const slides = [hero1, hero2, hero3, hero4, hero5];

export default function Hero() {
  return (
    <section className="hero-section">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        speed={800}
        pagination={{ clickable: true }}
        className="hs-slider"
        spaceBetween={0}
        centeredSlides={true}
        grabCursor={true}
      >
        {slides.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              className="hs-item set-bg"
              style={{ backgroundImage: `url(${img})` }}
            >
              <div className="hc-inner-text">
                <div className="hc-text">
                  <span className="label">FOR RENT</span>
                  <h4>DLF ONE MIDTOWN</h4>
                  <p>
                    <span>Moti Nagar</span>, New Delhi
                  </p>
                  <h5>
                    ₹2,50,000 <span>/ Month</span>
                  </h5>
                </div>

                <ul className="hc-widget">
                  <li>
                    <i className="fa fa-object-group"></i> 2500 sqft
                  </li>
                  <li>
                    <i className="fa fa-bed"></i> 3 Beds
                  </li>
                  <li>
                    <i className="fa fa-bath"></i> 2 Baths
                  </li>
                  <li>
                    <i className="fa fa-car"></i> 1 Parking
                  </li>
                </ul>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
