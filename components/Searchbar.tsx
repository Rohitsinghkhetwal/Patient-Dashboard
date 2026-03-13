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
} from "lucide-react";

const SORT_BY_OPTIONS = [
  { label: "Name", value: "patient_name" },
  { label: "Age",  value: "age" },
  { label: "ID",   value: "patient_id" },
];

const SORT_DIR_OPTIONS = [
  { label: "Ascending",  value: "asc" },
  { label: "Descending", value: "desc" },
];

const SortSelect: React.FC<{
  value: string;
  options: typeof SORT_DIR_OPTIONS;
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
  const [localSort1,  setLocalSort1]  = useState(searchParams.get("sort_by")  ?? "patient_name");
  const [localSort2,  setLocalSort2]  = useState(searchParams.get("sort_dir") ?? "asc");
  const [localChips]                  = useState(SORT_BY_OPTIONS);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearchChange = (v: string) => {
    setLocalSearch(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (v) { params.set("search", v); } else { params.delete("search"); }
      params.set("page", "1");
      router.replace(`/?${params.toString()}`);
    }, 500);
  };

  const handleSortChange = (sortBy: string, sortDir: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort_by",  sortBy);
    params.set("sort_dir", sortDir);
    params.set("page", "1");
    router.replace(`/?${params.toString()}`);
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

        
        <div className="flex flex-col gap-2.5 md:flex-row md:items-center">

          
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

          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-medium text-gray-700 whitespace-nowrap">Sort by:</span>
            <SortSelect
              value={localSort1}
              options={SORT_BY_OPTIONS}
              onChange={(v) => { setLocalSort1(v); handleSortChange(v, localSort2); }}
            />
            <SortSelect
              value={localSort2}
              options={SORT_DIR_OPTIONS}
              onChange={(v) => { setLocalSort2(v); handleSortChange(localSort1, v); }}
            />
          </div>
        </div>
      </div>

      
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