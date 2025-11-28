import React from "react";

interface Props {
  open: boolean;
  url: string | null;
  onClose: () => void;
}

const getExtension = (url: string) => {
  return url.split("?")[0].split(".").pop()?.toLowerCase() || "";
};

export default function DocumentPreviewModal({ open, url, onClose }: Props) {
  if (!open || !url) return null;

  const ext = getExtension(url);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] h-[85vh] rounded-lg shadow-xl p-4 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="right-3 text-white hover:text-black text-sm float-right rounded-full px-2 py-1 bg-blue-500 hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>

        {/* Viewer */}
        <div className="w-full h-full mt-2">
          {ext === "pdf" && (
            <iframe src={url} className="w-full h-full border-none" />
          )}

          {["jpg", "jpeg", "png", "gif", "webp"].includes(ext) && (
            <img src={url} className="w-full h-full object-contain" />
          )}

          {["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext) && (
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                url
              )}`}
              className="w-full h-full border-none"
            />
          )}

          {ext === "txt" && (
            <iframe src={url} className="w-full h-full border-none" />
          )}

          {!["pdf", "jpg", "jpeg", "png", "gif", "webp", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(
            ext
          ) && (
            <p className="text-center mt-10">No preview available</p>
          )}
        </div>
      </div>
    </div>
  );
}
