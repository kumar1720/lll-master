import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaBath,
  FaBed,
  FaBolt,
  FaBuilding,
  FaCar,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaHome,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaShareAlt,
  FaShieldAlt,
  FaTint,
  FaWhatsapp,
  FaHeart,
} from "react-icons/fa";
import "../assets/css/PropertyDetailPage.css";
import { fetchPropertyById } from "../utils/propertyData";
import mapListingToPropertyDetail from "../utils/mapListingToPropertyDetail";
import { useAuth } from "../context/AuthContext";

const AMENITY_ICONS = {
  faCar: FaCar,
  faBolt: FaBolt,
  faBuilding: FaBuilding,
  faShieldAlt: FaShieldAlt,
  faTint: FaTint,
  faCheck: FaCheck,
};

function formatMetaValue(value, suffix = "") {
  if (value === "N/A" || value === "" || value === null || value === undefined) {
    return "Not specified";
  }

  return suffix ? `${value} ${suffix}` : String(value);
}

export default function PropertyDetailPage() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState(routeLocation.state?.property || null);
  const [loading, setLoading] = useState(!routeLocation.state?.property);
  const [error, setError] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (property) {
      return;
    }

    let mounted = true;

    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");
        const listing = await fetchPropertyById(id);

        if (!listing) {
          throw new Error("Property not found.");
        }

        if (mounted) {
          setProperty(listing);
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message || "Unable to load property details.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProperty();

    return () => {
      mounted = false;
    };
  }, [id, property]);

  const detail = useMemo(
    () => (property ? mapListingToPropertyDetail(property) : null),
    [property],
  );

  const activeImage = detail?.images?.[activeImageIndex] || detail?.images?.[0];

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: detail?.title,
          text: detail?.location,
          url,
        });
        return;
      } catch {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      window.alert("Property link copied to clipboard.");
    } catch {
      window.alert(url);
    }
  };

  if (loading) {
    return (
      <section className="pdp-state">
        <div className="container">
          <p>Loading property details...</p>
        </div>
      </section>
    );
  }

  if (error || !detail) {
    return (
      <section className="pdp-state">
        <div className="container">
          <p>{error || "Property not found."}</p>
          <button
            type="button"
            className="pdp-back-home"
            onClick={() => navigate("/properties")}
          >
            Back to Properties
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="pdp-page">
      <section className="pdp-hero">
        <div className="container pdp-hero-inner">
          <div className="pdp-hero-copy">
            <span className="pdp-badge">{detail.badge}</span>
            <h1>{detail.title}</h1>
            <p className="pdp-location">
              <FaMapMarkerAlt />
              <span>{detail.location}</span>
            </p>
            <div className="pdp-trail">
              <FaHome />
              <NavLink to="/">Home</NavLink>
              <FaChevronRight />
              <NavLink to="/properties">Properties</NavLink>
              <FaChevronRight />
              <span>{detail.title}</span>
            </div>
          </div>

          <div className="pdp-price-card">
            <p className="pdp-price-label">Starting Price</p>
            <h2>{detail.price}</h2>
            <p className="pdp-price-subtitle">
              A premium web presentation inspired by the mobile property detail
              experience and styled to match the current brand palette.
            </p>
            <div className="pdp-price-actions">
              <a
                className="pdp-primary-btn"
                href={detail.ownerPhone ? `tel:${detail.ownerPhone}` : "#"}
              >
                <FaPhoneAlt />
                Call Now
              </a>
              <button type="button" className="pdp-ghost-btn" onClick={handleShare}>
                <FaShareAlt />
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="pdp-main">
        <div className="container pdp-grid">
          <div className="pdp-content">
            <div className="pdp-gallery-card">
              <div className="pdp-gallery-stage">
                <img src={activeImage} alt={detail.title} className="pdp-main-image" />

                {detail.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="pdp-gallery-arrow pdp-gallery-arrow-left"
                      onClick={() =>
                        setActiveImageIndex((current) =>
                          current === 0 ? detail.images.length - 1 : current - 1,
                        )
                      }
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      type="button"
                      className="pdp-gallery-arrow pdp-gallery-arrow-right"
                      onClick={() =>
                        setActiveImageIndex((current) =>
                          current === detail.images.length - 1 ? 0 : current + 1,
                        )
                      }
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}

                <div className="pdp-gallery-overlay">
                  <span>
                    {activeImageIndex + 1} / {detail.images.length}
                  </span>
                  <button type="button" onClick={() => setIsSaved((value) => !value)}>
                    <FaHeart />
                    {isSaved ? "Saved" : "Save"}
                  </button>
                </div>
              </div>

              <div className="pdp-thumbnail-row">
                {detail.images.map((image, index) => (
                  <button
                    type="button"
                    key={`${detail.id || "property"}-${index}`}
                    className={`pdp-thumbnail ${activeImageIndex === index ? "active" : ""}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img src={image} alt={`${detail.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="pdp-section-card">
              <div className="pdp-section-heading">
                <h3>Key Information</h3>
                <p>Important property specifications presented in a clean grid.</p>
              </div>

              <div className="pdp-info-grid">
                <div className="pdp-info-item">
                  <span>Area</span>
                  <strong>{formatMetaValue(detail.area, "sqft")}</strong>
                </div>
                <div className="pdp-info-item">
                  <span>BHK</span>
                  <strong>{formatMetaValue(detail.bhk)}</strong>
                </div>
                <div className="pdp-info-item">
                  <span>Bathrooms</span>
                  <strong>{formatMetaValue(detail.bathrooms)}</strong>
                </div>
                <div className="pdp-info-item">
                  <span>Floor</span>
                  <strong>{formatMetaValue(detail.floor)}</strong>
                </div>
                <div className="pdp-info-item">
                  <span>Facing</span>
                  <strong>{formatMetaValue(detail.facing)}</strong>
                </div>
                {detail.totalFloors ? (
                  <div className="pdp-info-item">
                    <span>Total Floors</span>
                    <strong>{detail.totalFloors}</strong>
                  </div>
                ) : null}
                {detail.furnishing ? (
                  <div className="pdp-info-item">
                    <span>Furnishing</span>
                    <strong>{detail.furnishing}</strong>
                  </div>
                ) : null}
              </div>
            </div>

            {detail.amenities.length > 0 && (
              <div className="pdp-section-card">
                <div className="pdp-section-heading">
                  <h3>Amenities</h3>
                  <p>Comfort-focused features and infrastructure highlights.</p>
                </div>

                <div className="pdp-amenities-grid">
                  {detail.amenities.map((amenity) => {
                    const Icon = AMENITY_ICONS[amenity.icon] || FaCheck;

                    return (
                      <div
                        key={amenity.id}
                        className={`pdp-amenity-card ${amenity.available ? "" : "is-unavailable"}`}
                      >
                        <span className="pdp-amenity-icon">
                          <Icon />
                        </span>
                        <div>
                          <h4>{amenity.name}</h4>
                          <p>{amenity.available ? "Available" : "Not available"}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pdp-section-card">
              <div className="pdp-section-heading">
                <h3>Description</h3>
              </div>
              <p className="pdp-description">
                {detail.description || "Description not available for this property yet."}
              </p>
            </div>
          </div>

          <aside className="pdp-sidebar">
            {isAuthenticated ? (
              <div className="pdp-contact-card">
                <p className="pdp-sidebar-eyebrow">Verified Contact</p>
                <div className="pdp-agent-header">
                  <img src={detail.ownerImage} alt={detail.ownerName} />
                  <div>
                    <h3>{detail.ownerName}</h3>
                    <p>Property Consultant</p>
                  </div>
                </div>

                <ul className="pdp-contact-list">
                  <li>
                    <FaPhoneAlt />
                    <a href={detail.ownerPhone ? `tel:${detail.ownerPhone}` : "#"}>
                      {detail.ownerPhone || "Phone not available"}
                    </a>
                  </li>
                  <li>
                    <FaWhatsapp />
                    <a
                      href={
                        detail.ownerWhatsapp
                          ? `https://wa.me/${String(detail.ownerWhatsapp).replace(/\D/g, "")}`
                          : "#"
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {detail.ownerWhatsapp || "WhatsApp not available"}
                    </a>
                  </li>
                  <li>
                    <FaMapMarkerAlt />
                    <span>{detail.location}</span>
                  </li>
                </ul>

                <div className="pdp-contact-actions">
                  <a
                    className="pdp-primary-btn"
                    href={detail.ownerPhone ? `tel:${detail.ownerPhone}` : "#"}
                  >
                    <FaPhoneAlt />
                    Call Agent
                  </a>
                  <a
                    className="pdp-whatsapp-btn"
                    href={
                      detail.ownerWhatsapp
                        ? `https://wa.me/${String(detail.ownerWhatsapp).replace(/\D/g, "")}`
                        : "#"
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaWhatsapp />
                    WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="pdp-contact-card">
                <p className="pdp-sidebar-eyebrow">Contact Details</p>
                <p>Please log in to view contact information.</p>
                <button
                  className="pdp-primary-btn"
                  onClick={() => navigate("/signin")}
                >
                  Log In
                </button>
              </div>
            )}

            <div className="pdp-sticky-summary">
              <h3>Quick Snapshot</h3>
              <div className="pdp-summary-grid">
                <div>
                  <FaHome />
                  <span>{detail.badge}</span>
                </div>
                <div>
                  <FaBed />
                  <span>{formatMetaValue(detail.bhk)}</span>
                </div>
                <div>
                  <FaBath />
                  <span>{formatMetaValue(detail.bathrooms)}</span>
                </div>
                <div>
                  <FaBuilding />
                  <span>{formatMetaValue(detail.floor)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
