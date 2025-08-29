import React from "react";
import { Department } from "../types";

interface Props {
  departments: Department[];
}

export default function GraphView({ departments }: Props) {
  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <h2 className="font-bold text-lg mb-2">Department Connections</h2>
      <ul className="space-y-2">
        {departments.map((dept) => (
          <li key={dept.id} className="text-sm">
            <span className="font-semibold">{dept.name}</span> ↔{" "}
            {dept.connections.map((id) => {
              const target = departments.find((d) => d.id === id);
              return (
                <span key={id} className="text-gray-600 mr-2">
                  {target ? target.name : "Unknown"}
                </span>
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}
