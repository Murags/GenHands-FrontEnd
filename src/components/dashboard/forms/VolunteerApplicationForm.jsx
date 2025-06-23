import React, { useState, useEffect } from "react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { verifyUser } from "../../../services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const statusOptions = [
  //   'Pending Review',
  //   'Needs More Info',
  "Approved",
  "Rejected",
];

const getStatusButtonStyles = (status, currentStatus) => {
  let base =
    "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 w-full text-center";
  let active = "ring-2 ring-offset-1";
  let specific = "";

  switch (status) {
    case "Approved":
      specific =
        currentStatus === status
          ? `bg-ghibli-green text-ghibli-cream ${active} ring-ghibli-green-dark`
          : "bg-ghibli-green-lightest text-ghibli-green-dark hover:bg-ghibli-green-light";
      break;
    case "Rejected":
      specific =
        currentStatus === status
          ? `bg-ghibli-red text-ghibli-cream ${active} ring-ghibli-red-dark`
          : "bg-ghibli-red-lightest text-ghibli-red-dark hover:bg-ghibli-red-light";
      break;
    default:
      specific = "bg-gray-200 text-gray-700 hover:bg-gray-300";
  }
  return `${base} ${specific}`;
};

const VolunteerApplicationForm = ({ volunteer, onCloseDrawer }) => {
  const queryClient = useQueryClient();

  const [currentStatus, setCurrentStatus] = useState(volunteer?.status || "");
  const [adminNotes, setAdminNotes] = useState(volunteer?.notes || "");

  const verifyUserMutation = useMutation({
    mutationFn: ({ userId, approve }) => verifyUser({ userId, approve }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
      const statusText = currentStatus === "Approved" ? "approved" : "rejected";
      toast.success(`Volunteer application ${statusText} successfully and email notification sent!`);
      onCloseDrawer();
    },
    onError: (err) => {
      console.error("Error verifying volunteer:", err);
      toast.error("Failed to update volunteer status. Please try again.");
    },
  });

  useEffect(() => {
    if (volunteer) {
      const status = volunteer.verificationStatus || volunteer.status;
      setCurrentStatus(
        status === "verified"
          ? "Approved"
          : status === "rejected"
          ? "Rejected"
          : status
      );
      setAdminNotes(volunteer.notes || "");
    }
  }, [volunteer]);

  if (!volunteer) {
    return (
      <div className="p-6 text-center text-ghibli-brown">
        <p>No volunteer selected or data is unavailable.</p>
        <p>Please close this panel and try again.</p>
      </div>
    );
  }

  const handleUpdate = () => {
    const approve = currentStatus === "Approved";
    const userId = volunteer._id;

    verifyUserMutation.mutate({ userId, approve });
  };

  const avatarUrl = `https://picsum.photos/seed/${
    volunteer._id || volunteer.id
  }/100/100`;

  return (
    <div className="flex flex-col h-full bg-ghibli-cream text-ghibli-brown">
      <div className="p-6 space-y-6 overflow-y-auto flex-grow">
        <section>
          <h3 className="text-xl font-semibold text-ghibli-dark-blue mb-4 handwritten">
            Volunteer Information
          </h3>
          <div className="flex items-start space-x-4">
            <img
              src={avatarUrl}
              alt={`${volunteer.name}'s avatar`}
              className="h-24 w-24 rounded-full object-cover border-2 border-ghibli-brown-light shadow-md"
            />
            <div className="space-y-1 text-sm flex-grow">
              <p>
                <strong className="font-medium text-ghibli-brown-dark">
                  Name:
                </strong>{" "}
                {volunteer.name}
              </p>
              <p>
                <strong className="font-medium text-ghibli-brown-dark">
                  Email:
                </strong>{" "}
                <a
                  href={`mailto:${volunteer.email}`}
                  className="text-ghibli-blue hover:underline"
                >
                  {volunteer.email}
                </a>
              </p>
              <p>
                <strong className="font-medium text-ghibli-brown-dark">
                  Volunteer ID:
                </strong>{" "}
                {volunteer._id}
              </p>
              {volunteer.createdAt && (
                <p>
                  <strong className="font-medium text-ghibli-brown-dark">
                    Applied On:
                  </strong>{" "}
                  {new Date(volunteer.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-ghibli-dark-blue mb-3 handwritten">
            Supporting Documents
          </h3>
          {volunteer.verificationDocuments &&
          volunteer.verificationDocuments.length > 0 ? (
            <ul className="space-y-2">
              {volunteer.verificationDocuments.map((doc, index) => {
                // If doc is a string, treat it as a file path
                const isString = typeof doc === "string";
                const url = isString
                  ? `http://localhost:3000/${doc.replace(/^\/+/, "")}`
                  : doc.url;
                const name = isString
                  ? doc.split("/").pop()
                  : doc.name || "Document";

                return (
                  <li
                    key={index}
                    className="flex items-center text-sm p-2 bg-ghibli-cream-lightest rounded-md hover:bg-ghibli-cream-light transition-colors"
                  >
                    <PaperClipIcon className="h-5 w-5 text-ghibli-teal mr-2.5 flex-shrink-0" />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ghibli-blue hover:text-ghibli-blue-dark hover:underline truncate flex-grow"
                      title={name}
                    >
                      {name}
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-ghibli-brown-light italic p-2 bg-ghibli-cream-lightest rounded-md">
              No documents submitted.
            </p>
          )}
        </section>

        <section>
          <h3 className="text-xl font-semibold text-ghibli-dark-blue mb-3 handwritten">
            Application Status
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                className={getStatusButtonStyles(status, currentStatus)}
                onClick={() => setCurrentStatus(status)}
                disabled={verifyUserMutation.isPending}
              >
                {status}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-ghibli-dark-blue mb-2 handwritten">
            Admin Notes
          </h3>
          <textarea
            rows="4"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Add internal notes about this application (e.g., reasons for status change, follow-up actions)..."
            className="w-full p-3 border border-ghibli-brown-light rounded-lg focus:ring-2 focus:ring-ghibli-teal focus:border-ghibli-teal-dark text-sm text-ghibli-dark-blue placeholder-ghibli-brown-light bg-ghibli-cream-lightest resize-y"
            disabled={verifyUserMutation.isPending}
          />
        </section>
      </div>

      <div className="p-4 border-t border-ghibli-brown-light bg-ghibli-cream-light sticky bottom-0">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCloseDrawer}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-ghibli-brown hover:bg-ghibli-red-lightest transition-colors duration-150 border border-ghibli-brown-light focus:outline-none focus:ring-2 focus:ring-ghibli-red-light focus:ring-offset-1"
            disabled={verifyUserMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={verifyUserMutation.isPending}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium text-ghibli-cream transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              verifyUserMutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-ghibli-green hover:bg-ghibli-green-dark focus:ring-ghibli-green-dark"
            }`}
          >
            {verifyUserMutation.isPending ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerApplicationForm;
