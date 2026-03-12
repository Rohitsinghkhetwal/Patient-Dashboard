
"use client"
import React, { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ListFilter,
  ChevronsUpDown,
  FileText,
  Download,
  X,
} from "lucide-react";

export type ViewMode = "table" | "card";

export interface FilterChip {
  id: string;
  label: string;
}

export interface SortOption {
  label: string;
  value: string;
}

export interface PatientSearchBarProps {
  onViewChange?: (v: ViewMode) => void;
  activeFilterCount?: number;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  onFilterIconClick?: () => void;
  filterChips?: FilterChip[];
  onRemoveChip?: (id: string) => void;
  sortOptions?: SortOption[];
  sortValue1?: string;
  sortValue2?: string;
  onSort1Change?: (v: string) => void;
  onSort2Change?: (v: string) => void;
  onExportPDF?: () => void;
  onDownload?: () => void;
}

const DEFAULT_CHIPS: FilterChip[] = [
  { id: "1", label: "Option 1" },
  { id: "2", label: "Option 2" },
  { id: "3", label: "Option 3" },
  { id: "4", label: "Option 4" },
];

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { label: "option 1", value: "opt1" },
  { label: "option 2", value: "opt2" },
  { label: "option 3", value: "opt3" },
];

const SortSelect: React.FC<{
  value: string;
  options: SortOption[];
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

// ── Main component ────────────────────────────────────────────
const PatientSearchBar: React.FC<PatientSearchBarProps> = ({
  onViewChange,
  activeFilterCount = 4,
  searchValue       = "",
  onSearchChange,
  onFilterIconClick,
  filterChips       = DEFAULT_CHIPS,
  onRemoveChip,
  sortOptions       = DEFAULT_SORT_OPTIONS,
  sortValue1        = "opt1",
  sortValue2        = "opt1",
  onSort1Change,
  onSort2Change,
  onExportPDF,
  onDownload,
}) => {
  const [localSearch, setLocalSearch] = useState<string>(searchValue);
  const [localSort1,  setLocalSort1]  = useState<string>(sortValue1);
  const [localSort2,  setLocalSort2]  = useState<string>(sortValue2);
  
  const [localChips,  setLocalChips]  = useState<FilterChip[]>(filterChips);

  const handleSearchChange = (v: string) => { setLocalSearch(v); onSearchChange?.(v); };

  const handleRemoveChip   = (id: string) => {
    setLocalChips((prev) => prev.filter((c) => c.id !== id));
    onRemoveChip?.(id);
  };

  return (
    <div className="w-full bg-white">
      

        {/* Active Filters badge */}
        <div className="flex items-center justify-end gap-1.5 text-[13px] text-gray-500 flex-shrink-0 mx-5 mt-2">
          <ListFilter size={14} strokeWidth={2} />
          <span>Active Filters:</span>
          <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-blue-600 text-white text-[11px] font-bold leading-none">
            {activeFilterCount}
          </span>
        </div>
      
      <div className=" mx-5 mt-3 px-3.5 pt-2.5 pb-3">

        {/* Search + Sort row */}
        <div className="flex items-center gap-2.5">

          {/* Search input */}
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
              onClick={onFilterIconClick}
              title="Advanced filters"
              className="flex-shrink-0 flex p-[3px] rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-150 border-0 bg-transparent cursor-pointer"
            >
              <SlidersHorizontal size={14} strokeWidth={2} />
            </button>
          </div>

          {/* Sort controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[13px] font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
            <SortSelect
              value={localSort1}
              options={sortOptions}
              onChange={(v) => { setLocalSort1(v); onSort1Change?.(v); }}
            />
            <SortSelect
              value={localSort2}
              options={sortOptions}
              onChange={(v) => { setLocalSort2(v); onSort2Change?.(v); }}
            />
          </div>
        </div>

        {/* Filter chips */}
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

      {/* ══ ROW 3: Export buttons ══ */}
      <div className="flex justify-end items-center gap-2 px-5 pt-2.5 pb-1">
        <button
          onClick={onExportPDF}
          className="flex items-center gap-1.5 px-3 py-[5px] border border-gray-300 rounded-md bg-white text-[12.5px] font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
        >
          <FileText size={13} strokeWidth={2} className="text-red-500" />
          PDF
        </button>

        <button
          onClick={onDownload}
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