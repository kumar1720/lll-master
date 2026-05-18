import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaBuilding,
  FaCheckCircle,
  FaEnvelope,
  FaHeart,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaPlusCircle,
  FaRegClock,
  FaSignOutAlt,
  FaSyncAlt,
  FaUserEdit,
} from "react-icons/fa";
import "../assets/css/ProfileDashboard.css";
import avatarImage from "../assets/img/property/posted-by/pb-1.jpg";
import { fetchProfile, fetchProfileProperties } from "../utils/propertyData";
import mapListingToPropertyCard from "../utils/mapListingToPropertyCard";
import PropertyCard from "./PropertyCard";
import { useAuth } from "../context/AuthContext";

const PROFILE_FALLBACK = {
  name: "Lagan Lakshmi Member",
  phone: "+91 85955 43869",
  email: "info@laganlakshmiinfra.com",
  city: "Hyderabad, Telangana",
  company: "Lagan Lakshmi Infra",
  status: "active",
  verified: true,
  avatar: avatarImage,
};

const QUICK_ACTIONS = [
  {
    icon: <FaUserEdit />,
    title: "Edit Profile",
    description: "Update your personal details and company information.",
    cta: "Coming Soon",
    muted: true,
  },
  {
    icon: <FaPlusCircle />,
    title: "Post Property",
    description: "Add a new property and reach buyers or tenants faster.",
    cta: "Post Now",
    href: "/submit-property",
  },
  {
    icon: <FaHeart />,
    title: "Saved Properties",
    description: "Review shortlisted homes and compare them later.",
    cta: "Browse",
    href: "/properties",
  },
  {
    icon: <FaSyncAlt />,
    title: "Refresh Listings",
    description: "Reload your dashboard with the latest listing data.",
    cta: "Refresh",
    action: "refresh",
  },
];

function StatCard({ label, value, icon }) {
  return (
    <div className="profile-stat-card">
      <span className="profile-stat-icon">{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default function ProfileDashboard() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const [profileData, setProfileData] = useState(() => ({
    ...PROFILE_FALLBACK,
    ...user,
    phone: user?.phone || user?.mobile || PROFILE_FALLBACK.phone,
  }));
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState("");
  const [properties, setProperties] = useState([]);
  const [highlightProperties, setHighlightProperties] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadProfileDashboard() {
      try {
        setLoading(true);
        setPropertiesLoading(true);
        setPropertiesError("");

        const [profileResponse, profilePropertiesResponse] = await Promise.all([
          fetchProfile().catch(() => null),
          fetchProfileProperties(),
        ]);

        if (!mounted) {
          return;
        }

        if (profileResponse) {
          const locationValue = [
            profileResponse.city,
            profileResponse.state,
          ]
            .filter(Boolean)
            .join(", ");

          setProfileData((prev) => ({
            ...prev,
            ...profileResponse,
            name:
              profileResponse.name ||
              profileResponse.full_name ||
              prev.name,
            email: profileResponse.email || prev.email,
            phone:
              profileResponse.phone ||
              profileResponse.mobile ||
              prev.phone,
            city: locationValue || profileResponse.location || prev.city,
            company:
              profileResponse.company ||
              profileResponse.company_name ||
              prev.company,
            avatar:
              profileResponse.avatar ||
              profileResponse.profile_image ||
              prev.avatar,
            status: profileResponse.status || prev.status,
            verified:
              typeof profileResponse.verified === "boolean"
                ? profileResponse.verified
                : prev.verified,
          }));
        }

        const mapped = profilePropertiesResponse
          .slice(0, 3)
          .map((item, index) => mapListingToPropertyCard(item, index));

        setProperties(mapped);
      } catch (error) {
        if (mounted) {
          setProperties([]);
          setPropertiesError(
            error.message || "Unable to load profile properties right now.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setPropertiesLoading(false);
        }
      }
    }

    loadProfileDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (loading || location.hash !== "#my-properties") {
      return undefined;
    }

    const section = document.getElementById("my-properties");
    if (!section) {
      return undefined;
    }

    const scrollTimer = window.setTimeout(() => {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlightProperties(true);
    }, 120);

    const highlightTimer = window.setTimeout(() => {
      setHighlightProperties(false);
    }, 2200);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(highlightTimer);
    };
  }, [loading, location.hash]);

  const stats = useMemo(
    () => [
      {
        label: "Active Listings",
        value: propertiesLoading
          ? "..."
          : String(properties.length).padStart(2, "0"),
        icon: <FaBuilding />,
      },
      {
        label: "Account Status",
        value: profileData.status === "active" ? "Active" : "Pending",
        icon: <FaCheckCircle />,
      },
      {
        label: "Member Since",
        value: "2026",
        icon: <FaRegClock />,
      },
    ],
    [profileData.status, properties.length, propertiesLoading],
  );

  if (loading) {
    return (
      <section className="profile-shell">
        <div className="container profile-loading-state">
          <div className="profile-spinner" />
          <p>Loading profile...</p>
        </div>
      </section>
    );
  }

  return (
    <main className="profile-shell pt-4">
      <section className="profile-content">
        <div className="container profile-grid">
          <aside className="profile-sidebar-card">
            <div className="profile-avatar-wrap">
              <img
                src={profileData.avatar || avatarImage}
                alt={profileData.name}
                className="profile-avatar"
              />
              <span className="profile-status-pill">
                {profileData.status === "active"
                  ? "Active"
                  : profileData.status}
              </span>
            </div>

            <h2>{profileData.name}</h2>
            <p className="profile-company">{profileData.company}</p>

            <div className="profile-contact-list">
              <div>
                <FaPhoneAlt />
                <span>{profileData.phone}</span>
              </div>
              <div>
                <FaEnvelope />
                <span>{profileData.email}</span>
              </div>
              <div>
                <FaMapMarkerAlt />
                <span>{profileData.city}</span>
              </div>
            </div>

            <div className="profile-sidebar-actions">
              <Link to="/submit-property" className="profile-primary-btn">
                Post Property
              </Link>
              <button
                type="button"
                className="profile-secondary-btn"
                onClick={logout}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </aside>

          <div className="profile-main">
            <section className="profile-stats-grid">
              {stats.map((item) => (
                <StatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  icon={item.icon}
                />
              ))}
            </section>

            <section className="profile-info-panel">
              <div className="profile-section-head">
                <div>
                  <span className="profile-mini-kicker">Profile Details</span>
                  <h3>Account Overview</h3>
                </div>
                {profileData.verified ? (
                  <span className="profile-verified-chip">
                    <FaCheckCircle />
                    Verified
                  </span>
                ) : null}
              </div>

              <div className="profile-info-grid">
                <div className="profile-info-card">
                  <span>Full Name</span>
                  <strong>{profileData.name}</strong>
                </div>
                <div className="profile-info-card">
                  <span>Email Address</span>
                  <strong>{profileData.email}</strong>
                </div>
                <div className="profile-info-card">
                  <span>Phone Number</span>
                  <strong>{profileData.phone}</strong>
                </div>
                <div className="profile-info-card">
                  <span>Location</span>
                  <strong>{profileData.city}</strong>
                </div>
                <div className="profile-info-card">
                  <span>Company</span>
                  <strong>{profileData.company}</strong>
                </div>
                <div className="profile-info-card">
                  <span>Verification</span>
                  <strong>
                    {profileData.verified ? "Verified" : "Pending"}
                  </strong>
                </div>
              </div>
            </section>

            <section className="profile-actions-panel">
              <div className="profile-section-head">
                <div>
                  <span className="profile-mini-kicker">Quick Actions</span>
                  <h3>Useful Shortcuts</h3>
                </div>
              </div>

              <div className="profile-actions-grid">
                {QUICK_ACTIONS.map((item) =>
                  item.href ? (
                    <Link
                      to={item.href}
                      className="profile-action-card"
                      key={item.title}
                    >
                      <span className="profile-action-icon">{item.icon}</span>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      <span className="profile-action-link">{item.cta}</span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className={`profile-action-card ${item.muted ? "is-muted" : ""}`}
                      key={item.title}
                    >
                      <span className="profile-action-icon">{item.icon}</span>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      <span className="profile-action-link">{item.cta}</span>
                    </button>
                  ),
                )}
              </div>
            </section>

            <section
              id="my-properties"
              className={`profile-properties-panel ${highlightProperties ? "profile-properties-panel-highlight" : ""}`}
            >
              <div className="profile-section-head">
                <div>
                  <span className="profile-mini-kicker">My Properties</span>
                  <h3>Listing Snapshot</h3>
                </div>
                <Link to="/properties" className="profile-inline-link">
                  View all properties
                </Link>
              </div>

              {propertiesLoading ? (
                <div className="profile-inline-state">
                  <div className="profile-spinner small" />
                  <p>Loading properties...</p>
                </div>
              ) : propertiesError ? (
                <div className="profile-inline-state error">
                  <p>{propertiesError}</p>
                  <Link to="/properties" className="profile-primary-btn small">
                    Browse Listings
                  </Link>
                </div>
              ) : properties.length > 0 ? (
                <div className="profile-property-grid">
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      id={property.id}
                      slug={property.slug}
                      image={property.image}
                      title={property.title}
                      location={property.location}
                      sqft={property.sqft}
                      beds={property.beds}
                      baths={property.baths}
                      parking={property.parking}
                      agentImg={property.agentImg}
                      agentName={property.agentName}
                      agentPhone={property.agentPhone}
                      badge={property.badge}
                      listing={property.listing}
                    />
                  ))}
                </div>
              ) : (
                <div className="profile-empty-state">
                  <h4>No properties yet</h4>
                  <p>Start by posting a property to populate your dashboard.</p>
                  <Link
                    to="/submit-property"
                    className="profile-primary-btn small"
                  >
                    Post a Property
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
