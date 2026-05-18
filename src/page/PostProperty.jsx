import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/css/PostProperty.css";

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Basic Info", icon: "📋" },
  { id: 2, label: "Location", icon: "📍" },
  { id: 3, label: "Details", icon: "🏠" },
  { id: 4, label: "Amenities", icon: "✨" },
  { id: 5, label: "Media", icon: "📷" },
  { id: 6, label: "Contact", icon: "📞" },
  { id: 7, label: "Preview", icon: "👁️" },
];

const CATEGORIES = [
  { id: 1, name: "Flat", icon: "🏢" },
  { id: 2, name: "Villa", icon: "🏡" },
  { id: 3, name: "Plot", icon: "📐" },
  { id: 4, name: "Office", icon: "🏬" },
  { id: 5, name: "Apartment", icon: "🏠" },
  { id: 6, name: "House", icon: "🏘️" },
];

const BHK = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "6+ BHK"];
const BATHS = ["1", "2", "3", "4", "5+"];
const FURN = ["Furnished", "Semi-Furnished", "Unfurnished"];

const DETAILS_MAP = {
  Plot: [
    {
      key: "areaSqft",
      label: "Plot Area (sq ft)",
      type: "num",
      ph: "e.g. 2400",
    },
    {
      key: "plotLength",
      label: "Plot Length (ft)",
      type: "num",
      ph: "e.g. 60",
    },
    {
      key: "plotBreadth",
      label: "Plot Breadth (ft)",
      type: "num",
      ph: "e.g. 40",
    },
    {
      key: "boundaryWall",
      label: "Boundary Wall",
      type: "sel",
      opts: ["Yes", "No", "Partial"],
    },
    {
      key: "facing",
      label: "Facing",
      type: "sel",
      opts: ["East", "West", "North", "South", "NE", "NW", "SE", "SW"],
    },
    {
      key: "approval",
      label: "Approval",
      type: "sel",
      opts: ["Approved", "Non-Approved", "Pending"],
    },
  ],
  Villa: [
    {
      key: "areaSqft",
      label: "Built-up Area (sq ft)",
      type: "num",
      ph: "e.g. 3000",
    },
    {
      key: "plotArea",
      label: "Plot Area (sq ft)",
      type: "num",
      ph: "e.g. 5000",
    },
    { key: "bhk", label: "BHK", type: "sel", opts: BHK },
    { key: "bathrooms", label: "Bathrooms", type: "sel", opts: BATHS },
    { key: "totalFloors", label: "Total Floors", type: "num", ph: "e.g. 2" },
    { key: "furnishing", label: "Furnishing", type: "sel", opts: FURN },
  ],
  Office: [
    {
      key: "areaSqft",
      label: "Office Area (sq ft)",
      type: "num",
      ph: "e.g. 1000",
    },
    { key: "floor", label: "Floor", type: "num", ph: "e.g. 5" },
    { key: "totalFloors", label: "Total Floors", type: "num", ph: "e.g. 15" },
    {
      key: "washrooms",
      label: "Washrooms",
      type: "sel",
      opts: ["1", "2", "3", "4+"],
    },
    {
      key: "furnishing",
      label: "Furnishing",
      type: "sel",
      opts: [...FURN, "Shell"],
    },
    { key: "cabins", label: "Cabins / Rooms", type: "num", ph: "e.g. 5" },
  ],
  default: [
    { key: "areaSqft", label: "Area (sq ft)", type: "num", ph: "e.g. 1500" },
    { key: "bhk", label: "BHK", type: "sel", opts: BHK },
    { key: "bathrooms", label: "Bathrooms", type: "sel", opts: BATHS },
    { key: "floor", label: "Floor", type: "num", ph: "e.g. 3" },
    { key: "totalFloors", label: "Total Floors", type: "num", ph: "e.g. 10" },
    { key: "furnishing", label: "Furnishing", type: "sel", opts: FURN },
  ],
};

const AMENITIES_MAP = {
  Plot: [
    { id: 1, n: "Security", i: "👮" },
    { id: 2, n: "Park", i: "🌳" },
    { id: 3, n: "Green Area", i: "🌿" },
    { id: 4, n: "Water Supply", i: "💧" },
    { id: 5, n: "Electricity", i: "⚡" },
    { id: 6, n: "Boundary Wall", i: "🧱" },
    { id: 7, n: "Gated Community", i: "🚪" },
    { id: 8, n: "Street Lights", i: "💡" },
  ],
  Villa: [
    { id: 1, n: "Parking", i: "🚗" },
    { id: 2, n: "Security", i: "👮" },
    { id: 3, n: "Power Backup", i: "⚡" },
    { id: 4, n: "Water Supply", i: "💧" },
    { id: 5, n: "Garden", i: "🌳" },
    { id: 6, n: "Swimming Pool", i: "🏊" },
    { id: 7, n: "Gym", i: "🏋️" },
    { id: 8, n: "Garage", i: "🚙" },
    { id: 9, n: "Terrace", i: "🏠" },
    { id: 10, n: "CCTV Security", i: "📹" },
    { id: 11, n: "Maintenance Staff", i: "🧹" },
  ],
  Office: [
    { id: 1, n: "Parking", i: "🚗" },
    { id: 2, n: "Lift", i: "🛗" },
    { id: 3, n: "Security", i: "👮" },
    { id: 4, n: "Power Backup", i: "⚡" },
    { id: 5, n: "Water Supply", i: "💧" },
    { id: 6, n: "Central AC", i: "❄️" },
    { id: 7, n: "Reception", i: "🛎️" },
    { id: 8, n: "Conference Room", i: "📋" },
    { id: 9, n: "CCTV Security", i: "📹" },
    { id: 10, n: "Fire Safety", i: "🔥" },
    { id: 11, n: "WiFi", i: "📶" },
    { id: 12, n: "Pantry", i: "☕" },
  ],
  default: [
    { id: 1, n: "Parking", i: "🚗" },
    { id: 2, n: "Lift", i: "🛗" },
    { id: 3, n: "Security", i: "👮" },
    { id: 4, n: "Power Backup", i: "⚡" },
    { id: 5, n: "Water Supply", i: "💧" },
    { id: 6, n: "Gym", i: "🏋️" },
    { id: 7, n: "Swimming Pool", i: "🏊" },
    { id: 8, n: "Club House", i: "🏠" },
    { id: 9, n: "Garden", i: "🌳" },
    { id: 10, n: "Kids Play Area", i: "🎢" },
    { id: 11, n: "Maintenance Staff", i: "🧹" },
    { id: 12, n: "CCTV Security", i: "📹" },
  ],
};

const STATES = [
  { id: 1, name: "Maharashtra" },
  { id: 2, name: "Delhi" },
  { id: 3, name: "Karnataka" },
  { id: 4, name: "Tamil Nadu" },
  { id: 5, name: "Gujarat" },
  { id: 6, name: "Rajasthan" },
  { id: 7, name: "Uttar Pradesh" },
  { id: 8, name: "West Bengal" },
  { id: 9, name: "Telangana" },
  { id: 10, name: "Bihar" },
];
const CITIES = {
  1: [
    { id: 1, name: "Mumbai" },
    { id: 2, name: "Pune" },
    { id: 3, name: "Nagpur" },
  ],
  2: [
    { id: 4, name: "New Delhi" },
    { id: 5, name: "Noida" },
    { id: 6, name: "Gurugram" },
  ],
  3: [
    { id: 7, name: "Bengaluru" },
    { id: 8, name: "Mysuru" },
    { id: 9, name: "Hubli" },
  ],
  4: [
    { id: 10, name: "Chennai" },
    { id: 11, name: "Coimbatore" },
    { id: 12, name: "Madurai" },
  ],
  5: [
    { id: 13, name: "Ahmedabad" },
    { id: 14, name: "Surat" },
    { id: 15, name: "Vadodara" },
  ],
  6: [
    { id: 16, name: "Jaipur" },
    { id: 17, name: "Jodhpur" },
    { id: 18, name: "Udaipur" },
  ],
  7: [
    { id: 19, name: "Lucknow" },
    { id: 20, name: "Agra" },
    { id: 21, name: "Kanpur" },
  ],
  8: [
    { id: 22, name: "Kolkata" },
    { id: 23, name: "Howrah" },
    { id: 24, name: "Siliguri" },
  ],
  9: [
    { id: 25, name: "Hyderabad" },
    { id: 26, name: "Warangal" },
    { id: 27, name: "Karimnagar" },
  ],
  10: [
    { id: 28, name: "Patna" },
    { id: 29, name: "Gaya" },
    { id: 30, name: "Muzaffarpur" },
  ],
};

/* ─────────────────────────────────────────────────────────────
   VALIDATORS
───────────────────────────────────────────────────────────── */
const V = {
  title: (v) =>
    !v?.trim()
      ? "Title is required"
      : v.trim().length < 10
        ? "Min 10 characters"
        : v.trim().length > 120
          ? "Max 120 characters"
          : null,
  description: (v) =>
    !v?.trim()
      ? "Description is required"
      : v.trim().length < 20
        ? "Min 20 characters"
        : null,
  category: (v) => (!v ? "Please select a category" : null),
  state: (v) => (!v ? "Please select a state" : null),
  city: (v) => (!v ? "Please select a city" : null),
  area: (v) => (!v?.trim() ? "Area / locality is required" : null),
  pinCode: (v) =>
    v && !/^\d{6}$/.test(v.trim()) ? "Must be exactly 6 digits" : null,
  price: (v) =>
    !v
      ? "Price is required"
      : isNaN(+v) || +v <= 0
        ? "Enter a valid price"
        : null,
  name: (v) => (!v?.trim() ? "Full name is required" : null),
  phone: (v) =>
    !v?.trim()
      ? "Phone is required"
      : !/^\d{10}$/.test(v.replace(/\D/g, ""))
        ? "Enter valid 10-digit number"
        : null,
  email: (v) =>
    !v?.trim()
      ? "Email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
        ? "Enter a valid email"
        : null,
  _num: (v, lbl) =>
    !v
      ? `${lbl} is required`
      : isNaN(+v) || +v < 0
        ? "Enter a valid number"
        : null,
  _sel: (v, lbl) => (!v ? `Please select ${lbl.toLowerCase()}` : null),
};

/* ─────────────────────────────────────────────────────────────
   SHARED DESIGN TOKENS
───────────────────────────────────────────────────────────── */
const FF = "'DM Sans', sans-serif";
const PRIMARY = "#00c89e";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function normalizeDetailValue(value) {
  if (value && typeof value === "object") {
    return value.name || value.label || value.value || "";
  }

  return value ?? "";
}

function buildPropertyPayload(form, detFields) {
  const details = detFields.reduce((accumulator, field) => {
    const value = normalizeDetailValue(form[field.key]);
    if (value !== "") {
      accumulator[field.key] = value;
    }
    return accumulator;
  }, {});

  const dynamicData = {
    property_type: form.listingType,
    description: form.description.trim(),
    location: {
      area: form.area.trim(),
      city: form.city?.name || "",
      state: form.state?.name || "",
      pinCode: form.pinCode.trim(),
    },
    details,
    amenities: form.amenities,
    contact: {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
    },
  };

  const payload = new FormData();
  const cleanDescription = form.description.trim();
  const categoryName = form.category?.name || "";
  const cityName = form.city?.name || form.city?.city || "";
  const stateName = form.state?.name || form.state?.state || "";

  payload.append("title", form.title.trim());
  payload.append("propertyType", form.listingType);
  payload.append("property_type", form.listingType);
  payload.append("listing_type", form.listingType);
  payload.append("property_type_id", form.listingType === "rent" ? "1" : "2");
  payload.append("description", cleanDescription);
  payload.append("dynamic_data[description]", cleanDescription);
  payload.append("category", categoryName);
  payload.append("category_id", String(form.category?.id || ""));
  payload.append("price", String(form.price).trim());
  payload.append("state", stateName);
  payload.append("city", cityName);
  payload.append("area", form.area.trim());
  payload.append("pin_code", form.pinCode.trim());
  payload.append("contact_name", form.name.trim());
  payload.append("contact_phone", form.phone.trim());
  payload.append("contact_email", form.email.trim());

  payload.append("details[price]", String(form.price).trim());
  payload.append("details[areaSqft]", String(details.areaSqft || form.areaSqft || ""));
  payload.append("details[bhk]", String(details.bhk || form.bhk || ""));
  payload.append(
    "details[bathrooms]",
    String(details.bathrooms || details.washrooms || form.bathrooms || ""),
  );
  payload.append("details[floor]", String(details.floor || form.floor || ""));
  payload.append(
    "details[totalFloors]",
    String(details.totalFloors || form.totalFloors || ""),
  );
  payload.append(
    "details[furnishing]",
    String(details.furnishing || form.furnishing || ""),
  );

  payload.append("location[state]", stateName);
  payload.append("location[city]", cityName);
  payload.append("location[area]", form.area.trim());
  payload.append("location[pinCode]", form.pinCode.trim());

  payload.append("contact[name]", form.name.trim());
  payload.append("contact[phone]", form.phone.trim());
  payload.append("contact[email]", form.email.trim());

  payload.append("amenities", JSON.stringify(form.amenities));
  payload.append("dynamic_data", JSON.stringify(dynamicData));

  form.images.forEach((image) => {
    payload.append("images[]", image.file);
  });

  if (form.video?.file) {
    payload.append("media[video]", form.video.file);
  }

  return payload;
}

function FieldErr({ msg }) {
  if (!msg) return null;
  return <p className="field-error">{msg}</p>;
}

function Label({ children, optional }) {
  return (
    <label className="form-label">
      {children}
      {optional && <span className="label-optional">(Optional)</span>}
    </label>
  );
}

function iStyle(hasErr, extra = "") {
  return cx("text-input", hasErr && "input-error", extra);
}

/* ─────────────────────────────────────────────────────────────
   SEARCH DROPDOWN
   Defined OUTSIDE main component so it's never re-created.
───────────────────────────────────────────────────────────── */
function SelectDrop({ value, onChange, opts, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = opts.filter((o) =>
    o.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div ref={ref} className="search-dropdown">
      <div
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cx("dropdown-trigger", open && "open", disabled && "disabled")}
      >
        <span className={value ? "dropdown-value" : "dropdown-placeholder"}>
          {value?.name || placeholder}
        </span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {open && (
        <div className="dropdown-panel">
          <div className="dropdown-search-wrap">
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="dropdown-search"
            />
          </div>
          <div className="dropdown-options">
            {filtered.length === 0 ? (
              <div className="dropdown-empty">No results</div>
            ) : (
              filtered.map((o) => (
                <div
                  key={o.id}
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                    setQ("");
                  }}
                  className={cx(
                    "dropdown-option",
                    value?.id === o.id && "selected",
                  )}
                >
                  {o.name}
                  {value?.id === o.id && <span className="dropdown-check">✓</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   STEP COMPONENTS — all at module level (never re-created)
   Props-only: no closure over parent state → React keeps DOM
   nodes alive while user types, preserving focus.
───────────────────────────────────────────────────────────── */

function Step1({ form, upd, touch1, err }) {
  return (
    <div>
      {/* Sell / Rent */}
      <div style={{ marginBottom: 28 }}>
        <Label>I want to</Label>
        <div
          style={{
            display: "inline-flex",
            background: "#f3f4f6",
            border: "1.5px solid #e5e7eb",
            borderRadius: 10,
            padding: 4,
            gap: 4,
          }}
        >
          {["sell", "rent"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => upd("listingType", t)}
              style={{
                padding: "10px 32px",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontFamily: FF,
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                background: form.listingType === t ? PRIMARY : "transparent",
                color: form.listingType === t ? "#fff" : "#6b7280",
                boxShadow:
                  form.listingType === t
                    ? "0 2px 8px rgba(0,200,158,.35)"
                    : "none",
                transition: "all .2s",
              }}
            >
              {t === "sell" ? "🏷️ Sell" : "🔑 Rent"}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div style={{ marginBottom: 28 }}>
        <Label>Property Category</Label>
        <p
          style={{
            fontSize: 12,
            color: "#6b7280",
            marginBottom: 12,
            fontFamily: FF,
          }}
        >
          Select the type of property you want to list
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
          }}
        >
          {CATEGORIES.map((c) => {
            const active = form.category?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => upd("category", c)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "18px 12px",
                  borderRadius: 12,
                  cursor: "pointer",
                  border: `1.5px solid ${active ? PRIMARY : "#e5e7eb"}`,
                  background: active ? PRIMARY : "#fff",
                  boxShadow: active
                    ? "0 4px 16px rgba(0,200,158,.3)"
                    : "0 1px 3px rgba(0,0,0,.05)",
                  transform: active ? "translateY(-2px)" : "none",
                  transition: "all .15s",
                }}
              >
                <span style={{ fontSize: 28 }}>{c.icon}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    color: active ? "#fff" : "#374151",
                    fontFamily: FF,
                  }}
                >
                  {c.name}
                </span>
              </div>
            );
          })}
        </div>
        <FieldErr msg={err("category")} />
      </div>

      {/* Title */}
      <div style={{ marginBottom: 28 }}>
        <Label>Property Title</Label>
        <input
          className={iStyle(!!err("title"))}
          placeholder="e.g., Beautiful 3BHK Apartment with Garden View"
          value={form.title}
          maxLength={120}
          onChange={(e) => upd("title", e.target.value)}
          onBlur={(e) => touch1("title", e.target.value)}
        />
        <div className="input-meta">
          <FieldErr msg={err("title")} />
          <span className="char-count">{form.title.length}/120</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <textarea
          className={iStyle(!!err("description"), "textarea")}
          placeholder="Describe the property in detail — condition, features, nearby facilities..."
          value={form.description}
          maxLength={1000}
          onChange={(e) => upd("description", e.target.value)}
          onBlur={(e) => touch1("description", e.target.value)}
        />
        <div className="input-meta">
          <FieldErr msg={err("description")} />
          <span className="char-count">{form.description.length}/1000</span>
        </div>
      </div>
    </div>
  );
}

function Step2({ form, upd, touch1, err, cities }) {
  return (
    <div>
      <div className="form-grid-2" style={{ marginBottom: 24 }}>
        <div>
          <Label>State</Label>
          <SelectDrop
            value={form.state}
            opts={STATES}
            placeholder="Select State"
            onChange={(v) => upd("state", v)}
          />
          <FieldErr msg={err("state")} />
        </div>
        <div>
          <Label>City</Label>
          <SelectDrop
            value={form.city}
            opts={cities}
            placeholder={form.state ? "Select City" : "Select state first"}
            disabled={!form.state}
            onChange={(v) => upd("city", v)}
          />
          <FieldErr msg={err("city")} />
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <Label>Area / Locality</Label>
        <input
          className={iStyle(!!err("area"))}
          placeholder="e.g., Koramangala, Banjara Hills, Andheri West"
          value={form.area}
          onChange={(e) => upd("area", e.target.value)}
          onBlur={(e) => touch1("area", e.target.value)}
        />
        <FieldErr msg={err("area")} />
      </div>
      <div style={{ maxWidth: 220 }}>
        <Label optional>Pin Code</Label>
        <input
          className={iStyle(!!err("pinCode"))}
          placeholder="e.g., 400001"
          maxLength={6}
          inputMode="numeric"
          value={form.pinCode}
          onChange={(e) =>
            upd("pinCode", e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          onBlur={(e) => touch1("pinCode", e.target.value)}
        />
        <FieldErr msg={err("pinCode")} />
      </div>
    </div>
  );
}

function Step3({ form, upd, touch1, err, detFields }) {
  return (
    <div>
      <div style={{ marginBottom: 24, maxWidth: 300 }}>
        <Label>{`Price (${form.listingType === "rent" ? "Monthly Rent" : "Selling Price"})`}</Label>
        <div className="price-wrap">
          <span className="price-symbol">₹</span>
          <input
            className={iStyle(!!err("price"), "price-input")}
            placeholder="Enter amount"
            inputMode="numeric"
            value={form.price}
            onChange={(e) => upd("price", e.target.value.replace(/\D/g, ""))}
            onBlur={(e) => touch1("price", e.target.value)}
          />
        </div>
        {form.price && !err("price") && (
          <p className="input-hint">₹{(+form.price).toLocaleString("en-IN")}</p>
        )}
        <FieldErr msg={err("price")} />
      </div>

      <div className="form-grid-2" style={{ gap: 20 }}>
        {detFields.map((f) =>
          f.type === "num" ? (
            <div key={f.key}>
              <Label>{f.label}</Label>
              <input
                className={iStyle(!!err(f.key))}
                placeholder={f.ph}
                type="number"
                min="0"
                value={form[f.key] || ""}
                onChange={(e) => upd(f.key, e.target.value)}
                onBlur={(e) => touch1(f.key, e.target.value)}
              />
              <FieldErr msg={err(f.key)} />
            </div>
          ) : (
            <div key={f.key} style={{ gridColumn: "1/-1" }}>
              <Label>{f.label}</Label>
              <div className={cx("options-group", err(f.key) && "options-error")}>
                {f.opts.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => upd(f.key, o)}
                    className={cx("option-btn", form[f.key] === o && "active")}
                  >
                    {o}
                  </button>
                ))}
              </div>
              <FieldErr msg={err(f.key)} />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function Step4({ form, toggleAmenity, amenList }) {
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {amenList.map((a) => {
          const on = form.amenities.includes(a.n);
          return (
            <div
              key={a.id}
              onClick={() => toggleAmenity(a.n)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 14,
                border: `1.5px solid ${on ? PRIMARY : "#e5e7eb"}`,
                borderRadius: 10,
                cursor: "pointer",
                background: on ? "rgba(0,200,158,.06)" : "#fff",
                position: "relative",
                boxShadow: on
                  ? "0 2px 8px rgba(0,200,158,.15)"
                  : "0 1px 3px rgba(0,0,0,.04)",
                transform: on ? "translateY(-1px)" : "none",
                transition: "all .15s",
              }}
            >
              <span style={{ fontSize: 20 }}>{a.i}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                  color: "#374151",
                  fontFamily: FF,
                }}
              >
                {a.n}
              </span>
              {on && (
                <span
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 7,
                    width: 16,
                    height: 16,
                    background: PRIMARY,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 8,
                    color: "#fff",
                    fontWeight: 800,
                  }}
                >
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "10px 20px",
          background: "rgba(0,200,158,.08)",
          border: `1.5px solid ${PRIMARY}`,
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 700,
          color: "#00a07f",
          fontFamily: FF,
          letterSpacing: "0.4px",
        }}
      >
        {form.amenities.length === 0
          ? "No amenities selected"
          : `${form.amenities.length} Amenit${form.amenities.length === 1 ? "y" : "ies"} Selected`}
      </div>
    </div>
  );
}

function Step5({
  form,
  upd,
  imgRef,
  vidRef,
  handleImages,
  removeImg,
  handleVideo,
}) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Label>{`Property Images${form.images.length > 0 ? ` (${form.images.length}/10)` : ""}`}</Label>
        <p className="form-helper">Minimum 3 required · First image is the cover photo</p>
        <div className="image-grid">
          {form.images.map((img, i) => (
            <div key={i} className="image-wrap">
              <img src={img.url} alt="" />
              <div onClick={() => removeImg(i)} className="img-remove">
                ✕
              </div>
            </div>
          ))}
          {form.images.length < 10 && (
            <div onClick={() => imgRef.current?.click()} className="add-image-btn">
              <span className="add-image-plus">+</span>
              <span className="add-image-text">Add Photo</span>
            </div>
          )}
        </div>
        <input
          ref={imgRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden-input"
          onChange={handleImages}
        />
        {form.images.length < 3 && (
          <div className="warning-box">
            ⚠️ Add {3 - form.images.length} more image
            {3 - form.images.length > 1 ? "s" : ""} to continue
          </div>
        )}
      </div>
      <div>
        <Label optional>Property Video</Label>
        <p className="form-helper">Short walkthrough video — up to 100MB</p>
        {form.video ? (
          <div className="video-preview">
            <video src={form.video.url} controls />
            <div className="video-actions">
              <button
                type="button"
                onClick={() => vidRef.current?.click()}
                className="video-action-btn change"
              >
                🔄 Change
              </button>
              <button
                type="button"
                onClick={() => upd("video", null)}
                className="video-action-btn remove"
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => vidRef.current?.click()}
            className="video-upload-btn"
          >
            🎥 Upload Video Tour
          </button>
        )}
        <input
          ref={vidRef}
          type="file"
          accept="video/*"
          className="hidden-input"
          onChange={handleVideo}
        />
      </div>
    </div>
  );
}

function Step6({ form, upd, touch1, err }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Label>Full Name</Label>
        <input
          className={iStyle(!!err("name"))}
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => upd("name", e.target.value)}
          onBlur={(e) => touch1("name", e.target.value)}
        />
        <FieldErr msg={err("name")} />
      </div>
      <div className="form-grid-2" style={{ marginBottom: 24 }}>
        <div>
          <Label>Phone Number</Label>
          <input
            className={iStyle(!!err("phone"))}
            placeholder="e.g., 98765 43210"
            type="tel"
            maxLength={15}
            value={form.phone}
            onChange={(e) =>
              upd("phone", e.target.value.replace(/[^\d\s+\-()]/g, ""))
            }
            onBlur={(e) => touch1("phone", e.target.value)}
          />
          <FieldErr msg={err("phone")} />
        </div>
        <div>
          <Label>Email Address</Label>
          <input
            className={iStyle(!!err("email"))}
            placeholder="you@example.com"
            type="email"
            value={form.email}
            onChange={(e) => upd("email", e.target.value.trim())}
            onBlur={(e) => touch1("email", e.target.value)}
          />
          <FieldErr msg={err("email")} />
        </div>
      </div>
      <div className="info-card">
        <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
        <span>
          Your contact details are shared only with verified buyers or renters
          who express interest in your property.
        </span>
      </div>
    </div>
  );
}

function Step7({
  form,
  detFields,
  setStep,
  submit,
  submitting,
  success,
  submitError,
}) {
  const parts = [];
  detFields.forEach((f) => {
    const v = form[f.key];
    if (!v) return;
    if (f.key === "areaSqft") parts.push(`${v} sq ft`);
    else if (f.key === "floor" && form.totalFloors)
      parts.push(`Floor ${v}/${form.totalFloors}`);
    else if (f.key === "totalFloors") {
    } else if (f.key === "bhk") parts.push(v);
    else if (f.key === "bathrooms") parts.push(`${v} Bath`);
    else if (f.key === "furnishing") parts.push(v);
    else parts.push(`${f.label}: ${v}`);
  });

  const rows = [
    {
      lbl: "📍 Location",
      val:
        [form.area, form.city?.name, form.state?.name]
          .filter(Boolean)
          .join(", ") + (form.pinCode ? ` — ${form.pinCode}` : ""),
    },
    parts.length > 0 && { lbl: "🏠 Details", val: parts.join(" · ") },
    form.amenities.length > 0 && {
      lbl: "✨ Amenities",
      val: form.amenities.join(", "),
    },
    {
      lbl: "📷 Photos",
      val: `${form.images.length} image${form.images.length !== 1 ? "s" : ""}${form.video ? " + 1 video" : ""}`,
    },
    { lbl: "👤 Contact", val: form.name || "—" },
    { lbl: "📞 Phone", val: form.phone || "—" },
    { lbl: "📧 Email", val: form.email || "—" },
  ].filter(Boolean);

  return (
    <div>
      {success && (
        <div className="success-banner">
          🎉 Property posted successfully!
        </div>
      )}
      {submitError && (
        <div
          style={{
            background: "#fef2f2",
            border: "1.5px solid #fecaca",
            padding: "12px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
            color: "#b91c1c",
            fontFamily: FF,
            marginBottom: 14,
          }}
        >
          {submitError}
        </div>
      )}
      <div className="summary-card">
        <div className="summary-header">
          <span className="summary-badge">
            {form.listingType === "sell" ? "🏷️ For Sale" : "🔑 For Rent"}
          </span>
          <span className="summary-price">
            {form.price
              ? `₹${(+form.price).toLocaleString("en-IN")}`
              : "Price on Request"}
          </span>
        </div>
        <div className="summary-title">{form.title || "Untitled Property"}</div>
        <div className="summary-category">
          <span>{form.category?.icon || "🏠"}</span>
          <span>{form.category?.name || "Property"}</span>
        </div>
        <hr className="divider" />
        {rows.map((row, i) => (
          <div key={i} className="summary-row">
            <span className="summary-row-label">{row.lbl}</span>
            <span className="summary-row-val">{row.val}</span>
          </div>
        ))}
        {form.images.length > 0 && (
          <div className="summary-images">
            {form.images.slice(0, 6).map((img, i) => (
              <img key={i} src={img.url} alt="" className="summary-thumb" />
            ))}
            {form.images.length > 6 && (
              <div className="summary-more-images">
                +{form.images.length - 6}
              </div>
            )}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={() => setStep(1)}
        className="btn btn-edit"
      >
        ✏️ Edit Details
      </button>
      <button
        type="button"
        onClick={submit}
        disabled={submitting || success}
        className="btn btn-submit"
      >
        {submitting
          ? "Submitting…"
          : success
            ? "✅ Submitted!"
            : "✅ Submit Property"}
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function PostProperty() {
  const [step, setStep] = useState(1);
  const [touched, setTouch] = useState({});
  const [errs, setErrs] = useState({});
  const [cities, setCities] = useState([]);
  const [submitting, setSub] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate();
  const { logout, token } = useAuth();

  const imgRef = useRef(null);
  const vidRef = useRef(null);
  const topRef = useRef(null);

  const [form, setForm] = useState({
    listingType: "sell",
    category: null,
    title: "",
    description: "",
    state: null,
    city: null,
    area: "",
    pinCode: "",
    price: "",
    areaSqft: "",
    bhk: "",
    bathrooms: "",
    floor: "",
    totalFloors: "",
    furnishing: "",
    plotLength: "",
    plotBreadth: "",
    boundaryWall: "",
    facing: "",
    approval: "",
    washrooms: "",
    cabins: "",
    plotArea: "",
    amenities: [],
    images: [],
    video: null,
    name: "",
    phone: "",
    email: "",
  });

  const catName = form.category?.name;
  const detFields = DETAILS_MAP[catName] || DETAILS_MAP.default;
  const amenList = AMENITIES_MAP[catName] || AMENITIES_MAP.default;

  useEffect(() => {
    if (form.state) {
      setCities(CITIES[form.state.id] || []);
      setForm((p) => ({ ...p, city: null }));
    } else {
      setCities([]);
    }
  }, [form.state]);

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const redirectTimer = window.setTimeout(() => {
      navigate("/profile#my-properties", { replace: true });
    }, 2000);

    return () => {
      window.clearTimeout(redirectTimer);
    };
  }, [navigate, success]);

  /* Stable callbacks — won't cause child re-renders */
  const upd = useCallback((k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setTouch((p) => ({ ...p, [k]: true }));
    if (success) setSuccess(false);
    if (submitError) setSubmitError("");
    const fn = V[k];
    if (fn) setErrs((p) => ({ ...p, [k]: fn(v) }));
  }, [submitError, success]);

  const touch1 = useCallback((k, v) => {
    setTouch((p) => ({ ...p, [k]: true }));
    const fn = V[k];
    if (fn) setErrs((p) => ({ ...p, [k]: fn(v) }));
  }, []);

  const err = useCallback(
    (k) => (touched[k] ? errs[k] : null),
    [touched, errs],
  );

  const toggleAmenity = useCallback((n) => {
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(n)
        ? p.amenities.filter((a) => a !== n)
        : [...p.amenities, n],
    }));
    if (success) setSuccess(false);
    if (submitError) setSubmitError("");
  }, [submitError, success]);

  const handleImages = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    const imgs = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setForm((p) => ({ ...p, images: [...p.images, ...imgs].slice(0, 10) }));
    if (success) setSuccess(false);
    if (submitError) setSubmitError("");
    e.target.value = "";
  }, [submitError, success]);

  const removeImg = useCallback((i) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));
    if (success) setSuccess(false);
    if (submitError) setSubmitError("");
  }, [submitError, success]);

  const handleVideo = useCallback((e) => {
    const f = e.target.files?.[0];
    if (f)
      setForm((p) => ({
        ...p,
        video: { file: f, url: URL.createObjectURL(f) },
      }));
    if (success) setSuccess(false);
    if (submitError) setSubmitError("");
    e.target.value = "";
  }, [submitError, success]);

  function validateStep(s) {
    const e = {};
    if (s === 1) {
      e.category = V.category(form.category);
      e.title = V.title(form.title);
      e.description = V.description(form.description);
    }
    if (s === 2) {
      e.state = V.state(form.state);
      e.city = V.city(form.city);
      e.area = V.area(form.area);
      e.pinCode = V.pinCode(form.pinCode);
    }
    if (s === 3) {
      e.price = V.price(form.price);
      detFields.forEach((f) => {
        e[f.key] =
          f.type === "sel"
            ? V._sel(form[f.key], f.label)
            : V._num(form[f.key], f.label);
      });
    }
    if (s === 6) {
      e.name = V.name(form.name);
      e.phone = V.phone(form.phone);
      e.email = V.email(form.email);
    }
    Object.keys(e).forEach((k) => {
      if (!e[k]) delete e[k];
    });
    return e;
  }

  function canGo() {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) return false;
    if (step === 5 && form.images.length < 3) return false;
    return true;
  }

  function next() {
    const e = validateStep(step);
    const t = {};
    Object.keys(e).forEach((k) => (t[k] = true));
    setTouch((p) => ({ ...p, ...t }));
    setErrs((p) => ({ ...p, ...e }));
    if (Object.keys(e).length > 0) return;
    if (step === 5 && form.images.length < 3) return;
    setStep((s) => s + 1);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function prev() {
    setStep((s) => s - 1);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function submit() {
    if (!token) {
      navigate("/login", {
        replace: true,
        state: { from: { pathname: "/submit-property" } },
      });
      return;
    }

    const validationErrors = [1, 2, 3, 6].reduce((accumulator, currentStep) => {
      return { ...accumulator, ...validateStep(currentStep) };
    }, {});

    if (form.images.length < 3) {
      validationErrors.images = "Please upload at least 3 images";
    }

    if (Object.keys(validationErrors).length > 0) {
      const touchedFields = {};
      Object.keys(validationErrors).forEach((key) => {
        touchedFields[key] = true;
      });
      setTouch((previous) => ({ ...previous, ...touchedFields }));
      setErrs((previous) => ({ ...previous, ...validationErrors }));
      setSubmitError("Please complete the required fields before submitting.");
      return;
    }

    setSubmitError("");
    setSub(true);

    try {
      const payload = buildPropertyPayload(form, detFields);
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      let responseData = null;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        const apiMessage =
          responseData?.message ||
          responseData?.error ||
          (typeof responseData === "string" ? responseData : "");
        throw new Error(apiMessage || `Failed to post property (${response.status})`);
      }

      setSuccess(true);
    } catch (error) {
      setSuccess(false);
      setSubmitError(error.message || "Unable to submit property right now.");
    } finally {
      setSub(false);
    }
  }

  const stepTitles = [
    "Basic Information",
    "Location",
    "Property Details",
    "Amenities",
    "Media Upload",
    "Contact Details",
    "Preview & Submit",
  ];
  const stepSubs = [
    "Tell us what kind of property you want to post",
    "Where is your property located?",
    "Specific details, size and specifications",
    "Select available amenities and facilities",
    "Upload photos and a video walkthrough",
    "Your contact info for interested parties",
    "Review everything before posting",
  ];

  const shared = { form, upd, touch1, err };

  return (
      <div className="app-wrapper">
        {/* HEADER */}
        <header ref={topRef} className="header">
          <div className="header-brand">
            <div className="header-logo">🏠</div>
            <div>
              <div className="header-title">Post Property</div>
              <div className="header-subtitle">List your property in minutes</div>
            </div>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="header-action-btn header-profile-btn"
              onClick={() => navigate("/profile")}
            >
              My Profile
            </button>
            <button
              type="button"
              className="header-action-btn header-logout-btn"
              onClick={() => {
                logout();
                navigate("/signin");
              }}
            >
              Logout
            </button>
            <button type="button" className="header-back-btn" onClick={() => navigate("/properties")}> 
              ← Back to Listings
            </button>
          </div>
        </header>

        {/* STEP BAR */}
        <div className="step-bar">
          <div className="step-bar-inner">
            {STEPS.map((s, i) => {
              const done = step > s.id,
                active = step === s.id;
              return (
                <div key={s.id} className="step-bar-item-wrap">
                  <div
                    onClick={() => done && setStep(s.id)}
                    className={cx(
                      "step-bar-item",
                      done && "completed",
                      active && "active",
                      !active && !done && "inactive",
                    )}
                  >
                    <div className="step-bar-circle">
                      {done ? "✓" : s.icon}
                    </div>
                    <span className="step-bar-label">{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={cx("step-bar-line", done && "done")} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="step-progress-track">
            <div
              className="step-progress-fill"
              style={{ width: `${((step - 1) / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* PAGE BODY */}
        <div className="page-body post-property-layout">
          {/* Left */}
          <div className="main">
            <div className="step-header">
              <span className="step-eyebrow">Step {step} of 7</span>
              <h1 className="step-title">{stepTitles[step - 1]}</h1>
              <p className="step-subtitle">{stepSubs[step - 1]}</p>
            </div>

            <div className="form-card">
              {/* className animates on step change; key does NOT go on the step component */}
              <div className="step-anim" key={step}>
                {step === 1 && <Step1 {...shared} />}
                {step === 2 && <Step2 {...shared} cities={cities} />}
                {step === 3 && <Step3 {...shared} detFields={detFields} />}
                {step === 4 && (
                  <Step4
                    form={form}
                    toggleAmenity={toggleAmenity}
                    amenList={amenList}
                  />
                )}
                {step === 5 && (
                  <Step5
                    form={form}
                    upd={upd}
                    imgRef={imgRef}
                    vidRef={vidRef}
                    handleImages={handleImages}
                    removeImg={removeImg}
                    handleVideo={handleVideo}
                  />
                )}
                {step === 6 && <Step6 {...shared} />}
                {step === 7 && (
                  <Step7
                    form={form}
                    detFields={detFields}
                    setStep={setStep}
                    submit={submit}
                    submitting={submitting}
                    success={success}
                    submitError={submitError}
                  />
                )}
              </div>
            </div>

            {step < 7 && (
              <div className="nav-actions">
                {step > 1 && (
                  <button type="button" onClick={prev} className="btn btn-ghost">
                    ← Previous
                  </button>
                )}
                <button
                  type="button"
                  onClick={next}
                  disabled={!canGo()}
                  className="btn btn-primary"
                >
                  Continue →
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="post-property-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-card-title">Your Progress</div>
              {STEPS.map((s) => {
                const done = step > s.id,
                  active = step === s.id;
                return (
                  <div key={s.id} className={cx("sidebar-progress-row", !done && !active && "muted")}>
                    <div className={cx("sidebar-progress-dot", done && "done", active && "active")}>
                      {done ? "✓" : s.id}
                    </div>
                    <span className={cx("sidebar-progress-label", active && "active", done && "done")}>
                      {s.label}
                    </span>
                    {active && <span className="sidebar-progress-current">Current</span>}
                  </div>
                );
              })}
            </div>
            <div className="tips-card">
              <div className="tips-card-title">💡 Quick Tips</div>
              {[
                "Add 5+ high-quality photos for 3× more leads",
                "Include nearby landmarks in your description",
                "Accurate pricing gets 2× faster responses",
                "Video tours increase inquiries by 40%",
              ].map((tip, i) => (
                <div key={i} className="tips-item">
                  <span className="tips-item-arrow">→</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
