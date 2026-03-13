

"use client";
import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ListFilter,
  ChevronsUpDown,
  FileText,
  Download,
  X,
} from "lucide-react";

const DEFAULT_CHIPS = [
  { id: "1", label: "Option 1" },
  { id: "2", label: "Option 2" },
  { id: "3", label: "Option 3" },
  { id: "4", label: "Option 4" },
];

const DEFAULT_SORT_OPTIONS = [
  { label: "option 1", value: "opt1" },
  { label: "option 2", value: "opt2" },
  { label: "option 3", value: "opt3" },
];

const SortSelect: React.FC<{
  value: string;
  options: typeof DEFAULT_SORT_OPTIONS;
  onChange: (v: string) => void;
}> = ({ value, options, onChange }) => (
  <div className="relative inline-flex items-center">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none cursor-pointer outline-none border border-gray-300 rounded-md pl-2.5 pr-7 py-1.5 text-[13px] text-gray-700 bg-white focus:border-blue-500 transition-colors duration-150"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    <ChevronsUpDown
      size={13}
      strokeWidth={2}
      className="absolute right-1.5 pointer-events-none text-gray-500"
    />
  </div>
);

const PatientSearchBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localSearch, setLocalSearch] = useState<string>(searchParams.get("search") ?? "");
  const [localSort1, setLocalSort1] = useState<string>("opt1");
  const [localSort2, setLocalSort2] = useState<string>("opt1");
  const [localChips, setLocalChips] = useState(DEFAULT_CHIPS);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearchChange = (v: string) => {
    setLocalSearch(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (v) {
        params.set("search", v);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.replace(`/?${params.toString()}`);

    }, 500)

  };

  const handleRemoveChip = (id: string) => {
    setLocalChips((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="w-full bg-white">


      <div className="flex items-center justify-end gap-1.5 text-[13px] text-gray-500 flex-shrink-0 mx-5 mt-2">
        <ListFilter size={14} strokeWidth={2} />
        <span>Active Filters:</span>
        <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-blue-600 text-white text-[11px] font-bold leading-none">
          {localChips.length}
        </span>
      </div>

      <div className="mx-5 mt-3 px-3.5 pt-2.5 pb-3">


        <div className="flex items-center gap-2.5">


          <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-md px-3 py-[7px] bg-white focus-within:border-blue-500 focus-within:ring-[3px] focus-within:ring-blue-500/10 transition-all duration-150">
            <Search size={14} strokeWidth={2.5} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="flex-1 border-0 outline-none bg-transparent text-[13.5px] text-gray-700 placeholder:text-gray-400"
            />
            <button
              title="Advanced filters"
              className="flex-shrink-0 flex p-[3px] rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-150 border-0 bg-transparent cursor-pointer"
            >
              <SlidersHorizontal size={14} strokeWidth={2} />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[13px] font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
            <SortSelect value={localSort1} options={DEFAULT_SORT_OPTIONS} onChange={setLocalSort1} />
            <SortSelect value={localSort2} options={DEFAULT_SORT_OPTIONS} onChange={setLocalSort2} />
          </div>
        </div>

        {localChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {localChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 border border-gray-300 rounded-full text-[13px] text-gray-700 bg-gray-50 leading-snug"
              >
                {chip.label}
                <button
                  onClick={() => handleRemoveChip(chip.id)}
                  aria-label={`Remove ${chip.label}`}
                  className="flex items-center justify-center w-[15px] h-[15px] rounded-full text-gray-400 bg-transparent border-0 cursor-pointer hover:text-red-500 transition-colors duration-150"
                >
                  <X size={11} strokeWidth={2.5} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Export buttons */}
      <div className="flex justify-end items-center gap-2 px-5 pt-2.5 pb-1">
        <button className="flex items-center gap-1.5 px-3 py-[5px] border border-gray-300 rounded-md bg-white text-[12.5px] font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors duration-150">
          <FileText size={13} strokeWidth={2} className="text-red-500" />
          PDF
        </button>
        <button
          aria-label="Download"
          className="flex items-center justify-center w-[30px] h-[30px] border border-gray-300 rounded-md bg-white text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
        >
          <Download size={14} strokeWidth={2} />
        </button>
      </div>

    </div>
  );
};

export default PatientSearchBar;