import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaChevronRight } from "react-icons/fa";
import PropertyCard from "./PropertyCard";
import "../assets/css/PropertyPage.css";
import mapListingToPropertyCard from "../utils/mapListingToPropertyCard";

import heroBg from "../assets/img/hero/hero-2.jpg";

const PAGE_SIZE = 6;

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔄 Starting API fetch...");

        const response = await fetch("/api/listings");
        console.log("📡 API Response status:", response.status);
        console.log("📡 API Response ok:", response.ok);

        if (!response.ok) {
          if (response.status === 0) {
            throw new Error(
              "Network error: Unable to connect to the API server. Please check your internet connection.",
            );
          } else if (response.status >= 500) {
            throw new Error(
              `Server error: The API server is currently unavailable (${response.status}). Please try again later.`,
            );
          } else if (response.status >= 400) {
            throw new Error(
              `Client error: Invalid request to the API (${response.status}).`,
            );
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const data = await response.json();
        console.log("📦 Raw API Response:", data);

        // Handle different response formats
        let listings = [];
        if (Array.isArray(data)) {
          listings = data;
          console.log("✅ Data is an array with", listings.length, "items");
        } else if (
          data.data &&
          data.data.data &&
          Array.isArray(data.data.data)
        ) {
          listings = data.data.data; // API returns {status, message, data: {data: [...]}}
          console.log(
            "✅ Data found in data.data.data with",
            listings.length,
            "items",
          );
        } else if (data.data && Array.isArray(data.data)) {
          listings = data.data;
          console.log(
            "✅ Data found in data.data with",
            listings.length,
            "items",
          );
        } else {
          console.log(
            "❌ Unexpected data structure:",
            typeof data,
            Object.keys(data || {}),
          );
        }

        console.log("📋 Listings to map:", listings);

        const mappedListings = listings.map((item, index) => {
          console.log("🔄 Mapping item", index + 1, ":", item.title || item.id);
          const mappedItem = mapListingToPropertyCard(item, index);
          console.log("✅ Mapped item:", mappedItem.title);
          return mappedItem;
        });

        console.log(
          "🎯 Final mapped listings:",
          mappedListings.length,
          "items",
        );
        setProperties(mappedListings);
      } catch (error) {
        console.error("❌ Error fetching properties:", error);
        setError(error.message);
        // Fall back to empty array on error
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const showLoadMore = visible < properties.length;

  return (
    <div className="pp-page">
      {/* ── Hero Banner ── */}
      <div className="pp-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="pp-breadcrumb">
          <h2>PROPERTY GRID</h2>
          <div className="pp-trail">
            <FaHome className="pp-trail-home" />
            <NavLink to="/" className="pp-trail-link">
              Home
            </NavLink>
            <FaChevronRight className="pp-trail-arrow" />
            <span className="pp-trail-current">Property</span>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <section className="pp-content">
        <div className="container">
          {/* Section title */}
          <div className="pp-section-title">
            <h4>PROPERTY GRID</h4>
          </div>

          {/* Cards grid */}
          <div className="pp-grid">
            {properties.slice(0, visible).map((prop) => (
              <PropertyCard
                key={prop.id}
                id={prop.id}
                slug={prop.slug}
                image={prop.image}
                badge={prop.badge}
                title={prop.title}
                location={prop.location}
                sqft={prop.sqft}
                beds={prop.beds}
                baths={prop.baths}
                parking={prop.parking}
                agentImg={prop.agentImg}
                agentName={prop.agentName}
                agentPhone={prop.agentPhone}
                listing={prop.listing}
              />
            ))}
          </div>

          {/* Load More */}
          {showLoadMore && (
            <div className="pp-loadmore">
              <button
                className="pp-loadmore-btn"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
              >
                LOAD MORE
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
