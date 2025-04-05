import Slider from "@mui/material/Slider";
import { X } from "lucide-react";

type FilterSectionProps = {
  visible: boolean;
  onClose: () => void;
  priceRange: number[];
  onPriceChange: (value: number[]) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  showAvailableOnly: boolean;
  onAvailabilityChange: (value: boolean) => void;
};
const categoriess: string[] = [
  "Sport",
  "Electronics",
  "Fashion",
  "Food",
  "Beauty",
];
export default function FilterSection({
  visible,
  onClose,
  priceRange,
  onPriceChange,
 
  selectedCategories,
  onCategoryToggle,
  showAvailableOnly,
  onAvailabilityChange,
}: FilterSectionProps) {
  return (
    <div
      className={`${
        visible ? "block" : "hidden"
      } md:block w-full md:w-[30%] bg-white p-6 rounded-lg shadow-sm sm:min-h-full`}
    >
      <div className="flex justify-between items-center md:hidden mb-4">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <h2 className="text-lg font-medium text-gray-900 mb-4 hidden md:block">
        Filters
      </h2>

      {/* Price range filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
        <div className="px-2">
          <Slider
            getAriaLabel={() => "Price range"}
            value={priceRange}
            onChange={(_e, newValue) => onPriceChange(newValue as number[])}
            valueLabelDisplay="auto"
            max={6000}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
        <div className="space-y-2">
          {categoriess.map((category) => (
            <div key={category} className="flex items-center">
              <input
                id={`category-${category}`}
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={selectedCategories.includes(category)}
                onChange={() => onCategoryToggle(category)}
              />
              <label
                htmlFor={`category-${category}`}
                className="ml-2 text-sm text-gray-700"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability filter */}
      <div>
        <div className="flex items-center">
          <input
            id="available-only"
            type="checkbox"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            checked={showAvailableOnly}
            onChange={() => onAvailabilityChange(!showAvailableOnly)}
          />
          <label
            htmlFor="available-only"
            className="ml-2 text-sm text-gray-700"
          >
            In stock only
          </label>
        </div>
      </div>
    </div>
  );
}
