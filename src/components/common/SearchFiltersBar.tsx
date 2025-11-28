import { Search, Filter, ChevronDown } from "lucide-react";

interface SearchFiltersBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  showFilters?: boolean;
  setShowFilters?: (value: boolean) => void;
  children?: React.ReactNode;
  rightArea?: React.ReactNode;
  showRightArea?: boolean; // NEW
  showFilterButton?: boolean; // NEW
}

export default function SearchFiltersBar({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  children,
  rightArea,
  showRightArea = true,
  showFilterButton = true,
}: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Right area (filters, view toggles, etc.) */}
        {showRightArea && rightArea}

        {/* Filters Button */}
        {showFilterButton && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown
              className={`h-4 w-4 ml-1 transform transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Extra Filter Controls */}
      {showFilterButton && showFilters && (
        <div className="mt-4 pt-4 border-t">{children}</div>
      )}
    </div>
  );
}
