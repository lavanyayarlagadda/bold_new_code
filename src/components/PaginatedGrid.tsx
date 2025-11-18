import React, { useState } from "react";

interface PaginatedGridProps<T> {
  data: T[];
  itemsPerPage?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  emptyMessage?: string;
}

export const PaginatedGrid = <T,>({
  data,
  itemsPerPage = 6,
  renderItem,
  emptyMessage = "No records found.",
}: PaginatedGridProps<T>) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (data.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div>
      {/* Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedData.map((item, index) => (
          <div key={index}>{renderItem(item, index)}</div>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            page === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Prev
        </button>

        <span className="text-gray-700 text-sm">
          Page {page} of {totalPages || 1}
        </span>

        <button
          onClick={handleNext}
          disabled={page === totalPages || totalPages === 0}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            page === totalPages || totalPages === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};
