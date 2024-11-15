import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass, faTrash } from "@fortawesome/free-solid-svg-icons";
export default function SearchBar() {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    date: "",
  });

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    console.log("With filters:", filters);
  };

  const clearAll = () => {
    setSearchQuery("");
    setFilters({ category: "", date: "" });
  };

  return (
    <div className="w-[50rem] mx-auto p-4">
      {/* Search Bar */}
      <div className="flex items-center border rounded-full px-4 py-2 shadow-md bg-white gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow px-4 py-2 focus:outline-none rounded-full "
        />
        {/* Filter Button */}
        <button
          onClick={toggleFilters}
          className="px-4 py-2 tzext-sm bg-gray-200 rounded-full hover:bg-gray-300"
        >
<FontAwesomeIcon icon={faBars} />
        </button>
        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-4 py-2 tzext-sm bg-gray-200 rounded-full hover:bg-gray-300"
        >
<FontAwesomeIcon icon={faMagnifyingGlass} />        </button>
        {/* Clear All Button */}
        <button
          onClick={clearAll}
          className="px-4 py-2 tzext-sm bg-gray-200 rounded-full hover:bg-red-600 hover:text-white"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      {/* Filters Menu */}
      {filtersVisible && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Category</label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              placeholder="Enter category"
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
