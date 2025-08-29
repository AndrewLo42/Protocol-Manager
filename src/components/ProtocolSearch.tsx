import React from "react";
import { Department, Protocol } from "../types";

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  protocols: Protocol[];
  departments: Department[];
  setFilteredProtocols: (protocols: Protocol[]) => void;
  setActiveDeptFilter: (deptId: number | null) => void;
  activeDeptFilter: number | null;
}

export default function ProtocolSearch({
  searchTerm,
  setSearchTerm,
  protocols,
  departments,
  setFilteredProtocols,
  setActiveDeptFilter,
  activeDeptFilter,
}: Props) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilter(term, activeDeptFilter);
  };

  const applyFilter = (term: string, deptId: number | null) => {
    let filtered = [...protocols];

    if (term.trim()) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term.toLowerCase()) ||
          p.summary.toLowerCase().includes(term.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(term.toLowerCase()))
      );
    }

    if (deptId !== null) {
      filtered = filtered.filter((p) => p.departmentId === deptId);
    }

    setFilteredProtocols(filtered);
  };

  const handleDeptFilter = (deptId: number | null) => {
    setActiveDeptFilter(deptId);
    applyFilter(searchTerm, deptId);
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow space-y-4">
      <h2 className="font-bold text-lg">Search Protocols</h2>

      {/* Search box */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search protocols..."
        className="w-full border p-2 rounded"
      />

      {/* Department filter buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleDeptFilter(null)}
          className={`px-3 py-1 rounded-lg ${activeDeptFilter === null
              ? "bg-blue-600 text-white"
              : "bg-gray-300 hover:bg-gray-400"
            }`}
        >
          All
        </button>
        {departments.map((d) => (
          <button
            key={d.id}
            onClick={() => handleDeptFilter(d.id)}
            className={`px-3 py-1 rounded-lg ${activeDeptFilter === d.id
                ? "bg-blue-600 text-white"
                : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            {d.name}
          </button>
        ))}
      </div>
    </div>
  );
}
