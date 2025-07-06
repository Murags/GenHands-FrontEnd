import React from "react";
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  MapPinIcon,
  GlobeAltIcon,
  PhoneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useCategories } from "../../../hooks/useCategories";

const OrganisationProfile = () => {
  const { user: charity } = useCurrentUser();
  const { categories, isLoading: categoriesLoading } = useCategories();

  // Fallback data if charity is not loaded yet
  const fallback = {
    charityName: "Charity Name",
    description: "No description provided.",
    profilePictureUrl: "https://ui-avatars.com/api/?name=Charity&background=0D8ABC&color=fff&size=128",
    address: "No address provided.",
    email: "No email provided.",
    phone: "No phone provided.",
    website: "",
    established: "",
    categories: [],
    staffCount: "",
    isVerified: false,
    verificationStatus: "pending",
    neededCategories: [],
    priorityItems: [],
    contactFirstName: "",
    contactLastName: "",
    contactEmail: "",
    contactPhone: "",
    category: "",
    location: { address: "" },
  };

  const data = charity || fallback;
  const isVerified = data.isVerified || data.verificationStatus === "verified";
  const statusText = isVerified ? "Verified" : (data.verificationStatus || "Pending");

  return (
    <div className="flex justify-center items-center min-h-screen bg-ghibli-cream-lightest">
      <div className="cursor-pointer mb-15 w-full max-w-4xl bg-white rounded-2xl shadow-ghibli border border-ghibli-brown-light p-0 overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-shadow duration-300">
        {/* Left: Profile Picture & Status */}
        <div className="bg-ghibli-teal bg-opacity-10 md:w-1/3 flex flex-col items-center justify-center p-8">
          <img
            src={data.profilePictureUrl || fallback.profilePictureUrl}
            alt={data.charityName}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover mb-4"
          />
          <h1 className="text-2xl font-bold text-white font-sans mb-3 text-center">
            {data.charityName}
          </h1>
          <span
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
              isVerified
                ? "bg-white text-black"
                : "bg-ghibli-yellow text-ghibli-dark-blue"
            } transition-colors mb-2`}
          >
            {isVerified ? (
              <CheckCircleIcon className="h-4 w-4" />
            ) : (
              <ExclamationCircleIcon className="h-4 w-4" />
            )}
            {statusText}
          </span>
          {data.category && (
            <span className="mt-3 inline-block bg-ghibli-blue text-white text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wide shadow-sm mb-2">
              {data.category}
            </span>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col gap-4 p-8">
          <p className="text-ghibli-dark-blue text-base mb-2">{data.description}</p>
          {(data.contactFirstName || data.contactLastName) && (
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-ghibli-brown" />
              <span className="text-ghibli-dark-blue">
                {data.contactFirstName} {data.contactLastName}
              </span>
            </div>
          )}
          {data.contactEmail && (
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5 text-ghibli-brown" />
              <span className="text-ghibli-dark-blue">{data.contactEmail}</span>
            </div>
          )}
          {data.contactPhone && (
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-ghibli-brown" />
              <span className="text-ghibli-dark-blue">{data.contactPhone}</span>
            </div>
          )}
          {data.address && (
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-ghibli-brown" />
              <span className="text-ghibli-dark-blue">{data.location?.address || data.address}</span>
            </div>
          )}
          {data.email && (
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5 text-ghibli-brown" />
              <span className="text-ghibli-dark-blue">{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-ghibli-brown" />
              <span className="text-ghibli-dark-blue">{data.phone}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5 text-ghibli-brown" />
              <a
                href={data.website}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-ghibli-teal text-ghibli-dark-blue"
              >
                {data.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          {data.established && (
            <div className="flex items-center gap-2">
              <BuildingOfficeIcon className="h-5 w-5 text-ghibli-brown" />
              <span className="text-ghibli-dark-blue">Established: {data.established}</span>
            </div>
          )}
          {data.staffCount && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ghibli-dark-blue">Staff:</span>
              <span className="text-ghibli-dark-blue">{data.staffCount}</span>
            </div>
          )}
          {data.categories && data.categories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-ghibli-dark-blue">Categories:</span>
              {data.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="bg-ghibli-teal bg-opacity-10 text-ghibli-teal rounded-full text-xs font-semibold px-2 py-1 mr-1"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganisationProfile;