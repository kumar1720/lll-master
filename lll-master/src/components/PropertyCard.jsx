import "../assets/css/PropertyCard.css";
import { FaHeart, FaMapMarkerAlt, FaCar } from "react-icons/fa";
import { MdSquareFoot } from "react-icons/md";
import { IoBed } from "react-icons/io5";
import { FaShower } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import pb1 from "../assets/img/property/posted-by/pb-1.jpg";

export default function PropertyCard({
  id,
  slug,
  image,
  title,
  location,
  sqft = "2,283",
  beds = "03",
  baths = "03",
  parking = "02",
  agentImg = pb1,
  agentName = "Ashton Kutcher",
  agentPhone = "123-455-688",
  badge = "FOR RENT",
  listing = null,
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const openDetails = () => {
    navigate(`/properties/${slug || id}`, {
      state: listing ? { property: listing } : undefined,
    });
  };

  return (
    <article className="pc-card">
      {/* ── Image ── */}
      <button
        type="button"
        className="pc-image pc-image-button"
        style={{ backgroundImage: `url(${image})` }}
        onClick={openDetails}
      >
        <span className="pc-badge">{badge}</span>
      </button>

      {/* ── Body ── */}
      <div className="pc-body">
        <div className="pc-content">
          {/* Contact + Heart row */}
          <div className="pc-actions">
            <button className="pc-contact-btn">contact us</button>
            <button className="pc-heart-btn" aria-label="Save property">
              <FaHeart />
            </button>
          </div>

          {/* Title */}
          <button
            type="button"
            className="pc-title pc-title-button"
            onClick={openDetails}
          >
            {title}
          </button>

          {/* Location */}
          <p className="pc-location">
            <FaMapMarkerAlt className="pc-loc-icon" />
            <span>{location}</span>
          </p>

          {/* Specs grid */}
          <div className="pc-specs">
            <div className="pc-spec-item">
              <MdSquareFoot className="pc-spec-icon" />
              <span>{sqft} sqft</span>
            </div>
            <div className="pc-spec-item">
              <IoBed className="pc-spec-icon" />
              <span>{beds}</span>
            </div>
            <div className="pc-spec-item">
              <FaShower className="pc-spec-icon" />
              <span>{baths}</span>
            </div>
            <div className="pc-spec-item">
              <FaCar className="pc-spec-icon" />
              <span>{parking}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="pc-divider" />

        {/* Agent row */}
        <div className="pc-agent">
          <img
            src={agentImg || pb1}
            alt={agentName}
            className="pc-agent-img"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = pb1;
            }}
          />
          <span className="pc-agent-name">{agentName}</span>
          {isAuthenticated ? (
            <span className="pc-agent-phone">{agentPhone}</span>
          ) : (
            <Link to="/signin" className="pc-agent-phone pc-agent-phone-hidden">
              Login to view
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
