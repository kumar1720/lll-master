import {
  FaBed,
  FaBath,
  FaPhoneAlt,
  FaRulerCombined,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../assets/css/featureProperty.css";
import fp1 from "../assets/img/feature-property/fp-1.jpg";
import { fetchFeaturedListings, makeAbsoluteUrl } from "../utils/propertyData";

function formatLocation(location = {}) {
  return [location.area, location.city, location.state]
    .filter(Boolean)
    .join(", ");
}

function getPrimaryImage(listing) {
  const imagePath =
    listing?.main_image_url ||
    listing?.gallery_images_urls?.[0] ||
    listing?.dynamic_data?.media?.images?.[0];

  return makeAbsoluteUrl(imagePath) || fp1;
}

function mapFeaturedListing(listing) {
  const details = listing?.dynamic_data?.details || {};
  const location = listing?.dynamic_data?.location || {};
  const contact = listing?.dynamic_data?.contact || {};
  const category =
    listing?.dynamic_data?.category ||
    listing?.property_type?.name ||
    listing?.dynamic_data?.property_type;
  const rawPrice = details?.price || listing?.price;
  const numericPrice = Number(rawPrice);
  const formattedPrice =
    Number.isFinite(numericPrice) && numericPrice > 0
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(numericPrice)
      : "Price on request";

  return {
    id: listing?.id,
    title: listing?.title || "Featured Property",
    image: getPrimaryImage(listing),
    location: formatLocation(location) || "Prime location",
    listingType:
      listing?.dynamic_data?.property_type === "rent" ? "FOR RENT" : "FOR SALE",
    area: details?.areaSqft ? `${details.areaSqft} sqft` : "Area on request",
    beds: details?.bhk || category || "N/A",
    baths: details?.bathrooms || details?.approval || "N/A",
    phone: contact?.phone || "",
    contactHref: contact?.phone
      ? `tel:${String(contact.phone).replace(/\s+/g, "")}`
      : "/contact",
    contactLabel: contact?.phone || "Contact us",
    category: category || "Property",
    price: formattedPrice,
  };
}

export default function FeatureProperty() {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadFeaturedListings() {
      try {
        setLoading(true);
        setError("");
        const listings = await fetchFeaturedListings();

        if (mounted) {
          setFeaturedListings(listings.map(mapFeaturedListing));
        }
      } catch (requestError) {
        if (mounted) {
          setFeaturedListings([]);
          setError(
            requestError?.message ||
              "Unable to load featured properties right now.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadFeaturedListings();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(featuredListings.map((item) => item.category).filter(Boolean)),
    ];

    return uniqueCategories.slice(0, 6);
  }, [featuredListings]);

  return (
    <section className="feature-property-section">
      <div className="container feature-wrapper">
        <div className="feature-left">
          <h2>FEATURE PROPERTY</h2>

          <ul className="feature-category">
            {(categories.length > 0
              ? categories
              : ["Apartment", "House", "Office", "Villa"]
            ).map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>

          <Link to="/properties" className="view-property-btn">
            VIEW ALL PROPERTY
          </Link>
        </div>

        <div className="feature-right">
          {loading ? (
            <div
              className="feature-slide"
              style={{ backgroundImage: `url(${fp1})` }}
            >
              <div className="feature-overlay">
                <h3>Loading featured properties...</h3>
              </div>
            </div>
          ) : error ? (
            <div
              className="feature-slide"
              style={{ backgroundImage: `url(${fp1})` }}
            >
              <div className="feature-overlay">
                <h3>Featured properties are temporarily unavailable</h3>
                <p className="location">{error}</p>
                <button
                  type="button"
                  className="retry-btn"
                  onClick={() => navigate(0)}
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : featuredListings.length > 0 ? (
            <Swiper
              modules={[Navigation]}
              navigation
              loop={featuredListings.length > 1}
              className="feature-slider"
            >
              {featuredListings.map((property) => (
                <SwiperSlide key={property.id}>
                  <div
                    className="feature-slide"
                    style={{
                      backgroundImage: `url(${property.image})`,
                    }}
                  >
                    <div className="feature-overlay">
                      <h3>{property.title}</h3>

                      <p className="location">
                        <FaMapMarkerAlt /> {property.location}
                      </p>

                      <div className="feature-buttons">
                        <span className="rent-btn">{property.listingType}</span>
                        <a href={property.contactHref} className="contact-btn">
                          {property.phone ? "call now" : "contact us"}
                        </a>
                        <Link
                          to="/properties"
                          className="contact-btn feature-more-btn"
                        >
                          view more
                        </Link>
                      </div>

                      <div className="feature-details">
                        <span>
                          <FaRulerCombined /> {property.area}
                        </span>
                        <span>
                          <FaBed /> {property.beds}
                        </span>
                        <span>
                          <FaBath /> {property.baths}
                        </span>
                        <span>
                          <FaPhoneAlt /> {property.contactLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div
              className="feature-slide"
              style={{ backgroundImage: `url(${fp1})` }}
            >
              <div className="feature-overlay">
                <h3>No featured properties available yet</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
