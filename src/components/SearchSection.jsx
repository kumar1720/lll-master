import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Select from "react-select";
import "../assets/css/SearchSection.css";

const cityOptions = [
  { value: "noida", label: "Noida" },
  { value: "delhi", label: "New Delhi" },
  { value: "mumbai", label: "Mumbai" },
];

const locationOptions = [
  { value: "sector150", label: "Sector 150" },
  { value: "dwarka", label: "Dwarka" },
  { value: "bandra", label: "Bandra" },
];

const statusOptions = [
  { value: "rent", label: "For Rent" },
  { value: "sale", label: "For Sale" },
];

const propertyTypeOptions = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "builderfloor", label: "Builder Floor" },
];

const bedroomOptions = [
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
  { value: "4", label: "4 Bedrooms" },
];

const bathroomOptions = [
  { value: "1", label: "1 Bathroom" },
  { value: "2", label: "2 Bathrooms" },
  { value: "3", label: "3 Bathrooms" },
];

const amenities = [
  "Air conditioning",
  "Laundry",
  "Refrigerator",
  "Washer",
  "Barbeque",
  "Lawn",
  "Sauna",
  "Wifi",
  "Dryer",
  "Microwave",
  "Swimming Pool",
  "Window Coverings",
  "Gym",
  "Outdoor Shower",
  "Tv Cable",
];

const selectProps = {
  className: "react-select-container",
  classNamePrefix: "react-select",
  menuPortalTarget: document.body,
  menuPosition: "fixed",
};

export default function SearchSection() {
  const [type, setType] = useState("rent");
  const [size, setSize] = useState([300, 1200]);
  const [price, setPrice] = useState([100, 1000]);
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="search-section">
      <div className="container">
        {/* ── Top row: title + toggle ── */}
        <div className="search-top">
          <h4>Choose Your Preferred Location</h4>

          <div className="change-btn">
            <button
              className={type === "rent" ? "active" : ""}
              onClick={() => setType("rent")}
            >
              For Rent
            </button>
            <button
              className={type === "sale" ? "active" : ""}
              onClick={() => setType("sale")}
            >
              For Sale
            </button>
          </div>
        </div>

        {/* ── Search form grid ── */}
        <div className="search-form">
          <Select
            {...selectProps}
            options={cityOptions}
            placeholder="Choose The City"
          />
          <Select
            {...selectProps}
            options={locationOptions}
            placeholder="Location"
          />
          <Select
            {...selectProps}
            options={statusOptions}
            placeholder="Property Status"
          />
          <Select
            {...selectProps}
            options={propertyTypeOptions}
            placeholder="Property Type"
          />
          <Select
            {...selectProps}
            options={bedroomOptions}
            placeholder="No Of Bedrooms"
          />
          <Select
            {...selectProps}
            options={bathroomOptions}
            placeholder="No Of Bathrooms"
          />

          {/* Size range */}
          <div className="range-wrapper">
            <label>
              Size: [{size[0]} – {size[1]}] sqft
            </label>
            <Slider
              range
              min={100}
              max={2000}
              value={size}
              onChange={setSize}
            />
          </div>

          {/* Price range */}
          <div className="range-wrapper">
            <label>
              Price: [{price[0]} – {price[1]}] $
            </label>
            <Slider
              range
              min={50}
              max={5000}
              value={price}
              onChange={setPrice}
            />
          </div>

          <button className="search-btn">SEARCH</button>
        </div>

        {/* ── More search options ── */}
        <div className="more-search">
          <div className="more-header" onClick={() => setShowMore(!showMore)}>
            <span className="toggle-icon">{showMore ? "−" : "+"}</span>
            <h5>More Search Options</h5>
          </div>

          {showMore && (
            <div className="checkbox-grid">
              {amenities.map((item) => (
                <label key={item} className="checkbox-item">
                  <input type="checkbox" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
