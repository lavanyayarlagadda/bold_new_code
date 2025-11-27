import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function PageHeader({
  title,
  subtitle,
  buttonText,
  onButtonClick,
}: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">{subtitle}</p>
      </div>

      {buttonText && (
        <button
          onClick={onButtonClick}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          {buttonText}
        </button>
      )}
    </div>
  );
}
