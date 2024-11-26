import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMagnifyingGlass,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function SearchBar() {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    categories: [] as string[], // Cambiado para aceptar múltiples categorías
    date: "",
    containsWords: "",
    modifiedDate: "",
    modificationRange: { start: "", end: "" },
  });

  const defaultCategories = [
    { knownName: "Audio File", googleName: "application/vnd.google-apps.audio" },
    { knownName: "Google Docs", googleName: "application/vnd.google-apps.document" },
    { knownName: "Third-party Shortcut", googleName: "application/vnd.google-apps.drive-sdk" },
    { knownName: "Google Drawings", googleName: "application/vnd.google-apps.drawing" },
    { knownName: "Google Drive File", googleName: "application/vnd.google-apps.file" },
    { knownName: "Google Drive Folder", googleName: "application/vnd.google-apps.folder" },
    { knownName: "Google Forms", googleName: "application/vnd.google-apps.form" },
    { knownName: "Google Fusion Tables", googleName: "application/vnd.google-apps.fusiontable" },
    { knownName: "Google Jamboard", googleName: "application/vnd.google-apps.jam" },
    { knownName: "Email Layout", googleName: "application/vnd.google-apps.mail-layout" },
    { knownName: "Google My Maps", googleName: "application/vnd.google-apps.map" },
    { knownName: "Google Photos", googleName: "application/vnd.google-apps.photo" },
    { knownName: "Google Slides", googleName: "application/vnd.google-apps.presentation" },
    { knownName: "Google Apps Script", googleName: "application/vnd.google-apps.script" },
    { knownName: "Shortcut", googleName: "application/vnd.google-apps.shortcut" },
    { knownName: "Google Sites", googleName: "application/vnd.google-apps.site" },
    { knownName: "Google Sheets", googleName: "application/vnd.google-apps.spreadsheet" },
    { knownName: "Unknown File Type", googleName: "application/vnd.google-apps.unknown" },
    { knownName: "Google Vids", googleName: "application/vnd.google-apps.vid" },
    { knownName: "Google Video", googleName: "application/vnd.google-apps.video" },
  ];

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // Inicializa los valores del estado desde los parámetros de la URL
    setSearchQuery(searchParams.get("q") || "");
    setFilters({
      ...filters,
      categories: searchParams.get("categories")?.split(",") || [],
      date: searchParams.get("date") || "",
    });
  }, [searchParams]);

  const toggleFilters = () => setFiltersVisible(!filtersVisible);

  const handleSearch = () => {
    setFiltersVisible(false);
    const params: any = { q: searchQuery };
    if (filters.categories.length > 0)
      params.categories = filters.categories.join(",");
    if (filters.date) params.date = filters.date;
    if (advancedOptions) {
      if (filters.containsWords) params.containsWords = filters.containsWords;
      if (filters.modifiedDate) params.modifiedDate = filters.modifiedDate;
      if (filters.modificationRange.start)
        params.startModificationDate = filters.modificationRange.start;
      if (filters.modificationRange.end)
        params.endModificationDate = filters.modificationRange.end;
    }
    setSearchParams(params);

    // Log de los datos de búsqueda
    console.log("Search Query:", searchQuery);
    console.log("Filters:", filters);
    console.log("Advanced Options Enabled:", advancedOptions);
  };

  const clearAll = () => {
    setSearchQuery("");
    setFilters({
      categories: [],
      date: "",
      containsWords: "",
      modifiedDate: "",
      modificationRange: { start: "", end: "" },
    });
    setAdvancedOptions(false);
    setSearchParams({}); // Limpia los parámetros de la URL
  };

  const toggleCategory = (category: string) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories };
    });
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
          className="flex-grow px-4 py-2 focus:outline-none rounded-full"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        {/* Filter Button */}
        <button
          onClick={toggleFilters}
          className="px-4 py-2 text-sm bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-sm bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        {/* Clear All Button */}
        <button
          onClick={clearAll}
          className="px-4 py-2 text-sm bg-gray-200 rounded-full hover:bg-red-600 hover:text-white"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      {/* Filters Menu */}
      {filtersVisible && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Categories</label>
            <div className="grid grid-cols-2 gap-2">
              {defaultCategories.map((category, index) => (
                <label key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.googleName)}
                    onChange={() => toggleCategory(category.googleName)}
                  />
                  {category.knownName}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
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
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="advancedOptions"
              checked={advancedOptions}
              onChange={(e) => setAdvancedOptions(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="advancedOptions" className="text-sm font-medium">
              Enable Advanced Options
            </label>
          </div>
          {advancedOptions && (
            <>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium">
                  Contains Words
                </label>
                <input
                  type="text"
                  value={filters.containsWords}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      containsWords: e.target.value,
                    }))
                  }
                  placeholder="Enter words"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                />
              </div>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium">
                  Modified Date
                </label>
                <input
                  type="date"
                  value={filters.modifiedDate}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      modifiedDate: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border rounded-md focus:outline-none"
                />
              </div>
              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium">
                  Modification Range
                </label>
                <div className="flex gap-4">
                  <input
                    type="date"
                    value={filters.modificationRange.start}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        modificationRange: {
                          ...prev.modificationRange,
                          start: e.target.value,
                        },
                      }))
                    }
                    className="w-1/2 px-4 py-2 border rounded-md focus:outline-none"
                  />
                  <input
                    type="date"
                    value={filters.modificationRange.end}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        modificationRange: {
                          ...prev.modificationRange,
                          end: e.target.value,
                        },
                      }))
                    }
                    className="w-1/2 px-4 py-2 border rounded-md focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
