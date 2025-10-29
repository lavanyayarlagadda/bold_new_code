import React, { useState, useMemo, ReactNode, useEffect } from "react";

interface Column {
  label: string;
  width?: string;
}

interface TableWithPaginationProps<T> {
  columns: Column[];
  data: T[];
  rowsPerPage?: number;
  renderRow: (row: T, index: number) => ReactNode;
}

function TableWithPagination<T>({
  columns,
  data,
  renderRow,
  rowsPerPage = 5,
}: TableWithPaginationProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));

  // ✅ Memoized data slice
  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  }, [data, page, rowsPerPage]);

  // ✅ Reset page if data changes (but only if new data length is smaller)
  useEffect(() => {
    if ((page - 1) * rowsPerPage >= data.length) {
      setPage(1);
    }
  }, [data, page, rowsPerPage]);
  console.log("datalength", data.length)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`text-left py-3 px-4 font-medium text-gray-700 ${
                    col.width || ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => renderRow(row, i))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-gray-500"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.length > rowsPerPage && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing {(page - 1) * rowsPerPage + 1}–
            {Math.min(page * rowsPerPage, data.length)} of {data.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
              onClick={() => {
                setPage((prev) => Math.max(prev - 1, 1));
                console.log("rowsperpage", rowsPerPage);
              }}
              disabled={page === 1}
            >
              Prev
            </button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <button
              className="px-3 py-1 text-sm border rounded disabled:opacity-50 hover:bg-gray-100"
              onClick={() => {
                setPage((prev) => Math.min(prev + 1, totalPages));
                console.log("rowsperpage", rowsPerPage)
              }}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableWithPagination;
