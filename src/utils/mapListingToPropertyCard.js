import defaultAgentImage from "../assets/img/property/posted-by/pb-1.jpg";
import { makeAbsoluteUrl } from "./propertyData";

const FALLBACK_PROPERTY_IMAGE = "/assets/img/property/property-1.jpg";

function getAgentImage(contact) {
  const possibleImage =
    contact?.profile_image ||
    contact?.profileImage ||
    contact?.image ||
    contact?.photo ||
    contact?.avatar ||
    "";

  return makeAbsoluteUrl(possibleImage) || defaultAgentImage;
}

export default function mapListingToPropertyCard(item, index) {
  const dynamicData = item?.dynamic_data || {};
  const details = dynamicData.details || {};
  const location = dynamicData.location || {};
  const contact = dynamicData.contact || {};
  const media = dynamicData.media || {};

  const primaryImage =
    Array.isArray(media.images) && media.images.length > 0
      ? makeAbsoluteUrl(media.images[0])
      : FALLBACK_PROPERTY_IMAGE;

  const badge =
    dynamicData.property_type === "rent" || item?.property_type_id === 1
      ? "FOR RENT"
      : "FOR SALE";

  return {
    id: item?.id || index + 1,
    slug: item?.slug || String(item?.id || index + 1),
    image: primaryImage,
    title: item?.title || "Property",
    location:
      [location.area, location.city, location.state]
        .filter(Boolean)
        .join(", ") || "Location not specified",
    sqft: String(details.areaSqft || details.plotArea || "0"),
    beds: String(details.bhk || "0"),
    baths: String(details.bathrooms || details.washrooms || "0"),
    parking: String(item?.parking || details.parking || "0"),
    agentImg: getAgentImage(contact),
    agentName: contact.name || "Agent",
    agentPhone: contact.phone || "Contact us",
    badge,
    listing: item,
  };
}
