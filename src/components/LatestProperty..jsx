import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import mapListingToPropertyCard from "../utils/mapListingToPropertyCard";

export default function LatestProperty() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/listings");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        let listings = [];
        if (Array.isArray(data)) {
          listings = data;
        } else if (
          data.data &&
          data.data.data &&
          Array.isArray(data.data.data)
        ) {
          listings = data.data.data;
        } else if (data.data && Array.isArray(data.data)) {
          listings = data.data;
        }
        const mappedListings = listings
          .slice(0, 3)
          .map(mapListingToPropertyCard);
        setProperties(mappedListings);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setError(error.message);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section className="property-section spad">
        <div className="container">
          <div className="section-title">
            <h4>Latest Property</h4>
          </div>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Loading properties...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="property-section spad">
        <div className="container">
          <div className="section-title">
            <h4>Latest Property</h4>
          </div>
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#e53935" }}
          >
            <p>Error loading properties: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="property-section spad">
      <div className="container">
        <div className="section-title">
          <h4>Latest Property</h4>
        </div>

        <div className="row">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} {...prop} />
          ))}
        </div>
      </div>
    </section>
  );
}
