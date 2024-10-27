import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";

interface Accommodation {
  id: string | number;
  name: string;
}

interface SearchableAccommodationProps {
  accommodations: Accommodation[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  disabled?: boolean;
}

export default function SearchableAccommodation({
  accommodations,
  value,
  onChange,
  disabled = false,
}: SearchableAccommodationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredAccommodations = accommodations?.filter((accommodation) =>
    accommodation?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
  );

  const handleSelectAccommodation = (accommodationId: string | number) => {
    onChange(accommodationId);
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center justify-between w-full px-4 py-2 text-left bg-white border rounded-md shadow-sm ${
          disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>
          {value
            ? accommodations.find((accommodation) => accommodation.id === value)
                ?.name
            : "Select Accommodation Venue... "}
        </span>
        <ChevronDown
          className="w-5 h-5 ml-2 -mr-1 text-gray-400"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <div className="px-3 py-2 border-b">
            <div className="flex items-center">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="w-full px-2 py-1 ml-2 text-sm focus:outline-none"
                placeholder="Search accommodations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ul
            className="py-1 overflow-auto text-base max-h-60 focus:outline-none sm:text-sm"
            role="listbox"
          >
            {filteredAccommodations.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">
                No accommodations found
              </li>
            ) : (
              filteredAccommodations.map((accommodation) => (
                <li
                  key={accommodation.id}
                  className={`cursor-default select-none relative py-2 pl-3 pr-9 ${
                    value === accommodation.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-900"
                  }`}
                  role="option"
                  aria-selected={value === accommodation.id}
                  onClick={() => handleSelectAccommodation(accommodation.id)}
                >
                  <span className="block truncate">{accommodation.name}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
