import { useState } from "react";
import DocumentUpload from "../components/DocumentUpload";
import DocumentList from "../components/DocumentList";
import { FileText } from "lucide-react";

export default function Documents() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Refresh the document list
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-400" />
          Health Documents
        </h1>
        <p className="text-gray-400">
          Upload and manage your health reports, lab results, and medical documents
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Section */}
        <DocumentUpload onUploadSuccess={handleUploadSuccess} />

        {/* Documents List */}
        <DocumentList key={refreshKey} />
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-700/30 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-3">
          📋 Document Guidelines
        </h3>
        <ul className="text-gray-300 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>
              Upload clear, legible copies of your health documents
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>
              Supported formats: PDF, JPG, PNG, DOC, DOCX (Maximum 5MB per file)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>
              Include lab reports, prescriptions, imaging results, and vaccination records
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>
              All documents are securely stored and encrypted
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>
              AI will analyze these documents when generating your health summary
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
