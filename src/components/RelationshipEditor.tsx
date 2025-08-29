import React from "react";
import { Department } from "../types";

interface Props {
  department: Department;
  allDepartments: Department[];
  updateDept: (id: string, related: string[]) => void;
}

export default function RelationshipEditor({
  department,
  allDepartments,
  updateDept,
}: Props) {
  const currentRelated = department.related || [];

  const toggleRelationship = (otherId: string) => {
    const newRelated = currentRelated.includes(otherId)
      ? currentRelated.filter((id) => id !== otherId)
      : [...currentRelated, otherId];
    updateDept(department.id, newRelated);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {allDepartments
        .filter((d) => d.id !== department.id)
        .map((d) => {
          const active = currentRelated.includes(d.id);
          return (
            <button
              key={d.id}
              onClick={() => toggleRelationship(d.id)}
              className={`px-3 py-1 rounded ${active
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
                } hover:opacity-80 transition`}
            >
              {d.name}
            </button>
          );
        })}
      {currentRelated.length === 0 && (
        <span className="text-gray-500 text-sm">No relationships yet</span>
      )}
    </div>
  );
}
