import React from "react";
import { FileText } from "lucide-react";

export default function AttachmentsTab({ attachments = [] }) {
  return (
    <div className="bg-white rounded-xl p-6">
      {/* ✅ Heading with Poppins Medium */}
      <h2
        className="text-lg text-gray-800 mb-4"
        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
      >
        All Attachments
      </h2>

      {attachments.length === 0 ? (
        <p className="text-gray-500 text-sm">No attachments available.</p>
      ) : (
        <div className="space-y-4">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              {/* ✅ File Info Section */}
              <div className="flex items-stretch gap-4">
                {/* Icon Background — same height as text */}
                <div className="flex items-center justify-center bg-gray-100 px-3 rounded-md">
                  <FileText size={24} className="text-gray-500" />
                </div>

                {/* Text Section */}
                <div className="flex flex-col justify-between py-1">
                  <p
                    className="text-sm text-gray-800"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {file.name || "Untitled Document"}
                  </p>
                  <p
                    className="text-xs text-gray-500"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Category: {file.category || "Uncategorized"}
                  </p>
                  <p
                    className="text-xs text-gray-400"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    Added:{" "}
                    {file.addedOn
                      ? new Date(file.addedOn).toLocaleDateString()
                      : "Unknown"}
                  </p>
                </div>
              </div>

              {/* ✅ View PDF Button */}
              <a
                href={file.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-black text-white text-xs rounded-md hover:bg-gray-800"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
              >
                View PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
