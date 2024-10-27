import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";

interface User {
  id: string | number;
  name: string;
  email: string;
}

interface SearchableSelectProps {
  users: User[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  disabled?: boolean;
}

export default function SearchableSelect({
  users,
  value,
  onChange,
  disabled = false,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredUsers = users?.filter((user) =>{
    if(user?.name){
      return user?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
    } else {
      return user?.email?.toLowerCase()?.includes(searchTerm.toLowerCase())
    }
  }
  );

  const handleSelectUser = (userId: string | number) => {
    onChange(userId);
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
            ? users.find((user) => user.id === value)?.name || users.find((user) => user.id === value)?.email
            : "Select participant..."}
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
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ul
            className="py-1 overflow-auto text-base max-h-60 focus:outline-none sm:text-sm"
            role="listbox"
          >
            {filteredUsers.length === 0 ? (
              <li className="px-3 py-2 text-sm text-gray-500">
                No participants found
              </li>
            ) : (
              filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className={`cursor-default select-none relative py-2 pl-3 pr-9 ${
                    value === user.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-900"
                  }`}
                  role="option"
                  aria-selected={value === user.id}
                  onClick={() => handleSelectUser(user.id)}
                >
                  <span className="block truncate">{user.name || user.email}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
