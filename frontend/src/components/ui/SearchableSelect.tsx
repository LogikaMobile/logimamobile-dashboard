"use client";

import { useState, useRef, useEffect } from "react";

export type Option = {
  value: string;
  label: string;
};

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SearchableSelect({ options, value, onChange, placeholder = "Select...", disabled = false }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative font-mono" ref={dropdownRef}>
      <div
        className={`w-full bg-[#111111] border border-white/20 p-2 text-white flex justify-between items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-white truncate" : "text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="text-gray-500 text-xs">▼</span>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-[#1A1A1A] border border-white/20 shadow-xl max-h-60 flex flex-col">
          <div className="p-2 border-b border-white/10 sticky top-0 bg-[#1A1A1A]">
            <input
              type="text"
              className="w-full bg-black border border-white/20 p-1 text-white text-sm focus:outline-none focus:border-white"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-gray-500 text-xs text-center">No results found</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-2 text-sm cursor-pointer hover:bg-white hover:text-black transition-colors ${
                    option.value === value ? "bg-white/10" : ""
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
