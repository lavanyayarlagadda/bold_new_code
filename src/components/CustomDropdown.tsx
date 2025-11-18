import React from "react";
import { Search, ChevronDown, Sparkles } from "lucide-react";

interface CustomDropdownProps {
  label: string;
  placeholder: string;
  items: any[];
  selectedItem?: any;
  showDropdown: boolean;
  setShowDropdown: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSelect: (item: any) => void;
  onCustomClick?: () => void; // ✅ only keep this one
  renderItem: (item: any) => React.ReactNode;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  placeholder,
  items,
  selectedItem,
  showDropdown,
  setShowDropdown,
  searchQuery,
  setSearchQuery,
  onSelect,
  onCustomClick,
  renderItem,
}) => {
  return (
    <div className="mb-6">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>

      {/* Selected box */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`w-full px-4 py-3 text-left border-2 rounded-lg transition-all ${
            selectedItem
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">
              {selectedItem ? selectedItem.name : placeholder}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* Search + Custom button */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {onCustomClick && (
                <button
                  onClick={onCustomClick}
                  className="w-full flex items-center px-3 py-2 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-purple-600 mr-3" />
                  <span className="font-medium text-purple-900">
                    Create Custom {label}
                  </span>
                </button>
              )}
            </div>

            {/* List Items */}
            <div className="max-h-60 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-gray-500 text-sm px-4 py-3">No results found</p>
              ) : (
                items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelect(item);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left hover:bg-gray-50 transition-colors px-4 py-3"
                  >
                    {renderItem(item)}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDropdown;
