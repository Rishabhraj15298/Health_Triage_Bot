import { useState, useEffect } from "react";
import { File, Download, Trash2, Eye, Calendar } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

export default function DocumentList() {
  const { getToken } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    try {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/documents/${documentId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc._id !== documentId));
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <File className="w-5 h-5 text-blue-400" />
        Your Documents ({documents.length})
      </h3>

      {documents.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <File className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-400">No documents uploaded yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Upload your first health document to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-[#0A0A0F] border border-gray-700 rounded-lg p-4 hover:border-blue-500/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center">
                    <File className="w-6 h-6 text-blue-400" />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-white font-medium">{doc.title}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(doc.createdAt)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {formatFileSize(doc.fileSize)}
                      </span>
                      {doc.documentType && (
                        <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded text-xs">
                          {doc.documentType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(doc.fileUrl, "_blank")}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = doc.fileUrl;
                      link.download = doc.fileName;
                      link.click();
                    }}
                    className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
