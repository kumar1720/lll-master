import defaultAgentImage from "../assets/img/property/posted-by/pb-1.jpg";
import { makeAbsoluteUrl } from "./propertyData";

const FALLBACK_PROPERTY_IMAGE = "/assets/img/property/property-1.jpg";

function normalizeImages(property) {
  const mediaImages = property?.dynamic_data?.media?.images;
  const rawImages =
    Array.isArray(property?.images) && property.images.length > 0
      ? property.images
      : Array.isArray(mediaImages) && mediaImages.length > 0
        ? mediaImages
        : [FALLBACK_PROPERTY_IMAGE];

  return rawImages
    .map((image) => makeAbsoluteUrl(image) || FALLBACK_PROPERTY_IMAGE)
    .filter(Boolean);
}

function normalizeAmenities(property) {
  const amenityIcons = [
    "faCar",
    "faBolt",
    "faBuilding",
    "faShieldAlt",
    "faTint",
  ];
  let amenities = property?.amenities || property?.dynamic_data?.amenities || [];

  if (typeof amenities === "string") {
    try {
      amenities = JSON.parse(amenities);
    } catch {
      amenities = amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  if (!Array.isArray(amenities) || amenities.length === 0) {
    return [];
  }

  if (typeof amenities[0] === "string") {
    return amenities.map((name, index) => ({
      id: index + 1,
      name,
      icon: amenityIcons[index] || "faCheck",
      available: true,
    }));
  }

  return amenities.map((amenity, index) => ({
    id: amenity.id || index + 1,
    name: amenity.name || `Amenity ${index + 1}`,
    icon: amenity.icon || amenityIcons[index] || "faCheck",
    available: amenity.available !== false,
  }));
}

function getAgentImage(property) {
  const contact = property?.contact || property?.dynamic_data?.contact || {};

  return (
    makeAbsoluteUrl(
      contact.profile_image ||
        contact.profileImage ||
        contact.image ||
        contact.photo ||
        contact.avatar,
    ) || defaultAgentImage
  );
}

export default function mapListingToPropertyDetail(property) {
  const dynamicData = property?.dynamic_data || {};
  const details = dynamicData.details || {};
  const location = property?.location || dynamicData.location || {};
  const contact = property?.contact || dynamicData.contact || {};
  const images = normalizeImages(property);

  const badge =
    dynamicData.property_type === "rent" || property?.property_type_id === 1
      ? "For Rent"
      : "For Sale";

  const locationParts = [
    location.area,
    location.city,
    location.state,
    location.pinCode,
  ].filter(Boolean);

  const description =
    property?.description ||
    dynamicData.description ||
    "A thoughtfully curated property with strong location value, practical amenities, and a refined presentation.";

  return {
    id: property?.id,
    title: property?.title || "Property",
    badge,
    price: String(property?.price || details.price || "Price on request").startsWith("₹")
      ? String(property?.price || details.price || "Price on request")
      : `₹${property?.price || details.price || "Price on request"}`,
    location: locationParts.join(", ") || "Location not specified",
    images,
    description:
      typeof description === "string" &&
      description.trim().toLowerCase() === "null"
        ? ""
        : description,
    area: property?.area || details.areaSqft || details.plotArea || "N/A",
    bhk: property?.bhk || details.bhk || "N/A",
    bathrooms:
      property?.bathrooms || details.bathrooms || details.washrooms || "N/A",
    floor: property?.floor || details.floor || "N/A",
    totalFloors: details.totalFloors || "",
    facing: property?.facing || details.facing || "N/A",
    furnishing: details.furnishing || "",
    amenities: normalizeAmenities(property),
    ownerName: contact.name || property?.ownerName || "Property Consultant",
    ownerPhone: contact.phone || property?.ownerPhone || "",
    ownerWhatsapp: contact.whatsappPhone || contact.phone || property?.ownerPhone || "",
    ownerImage: getAgentImage(property),
  };
}
