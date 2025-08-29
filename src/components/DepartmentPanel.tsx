import React, { useState } from "react";
import { Department } from "../types";

interface Props {
  departments: Department[];
  updateDepartment: (id: number, updated: Partial<Department>) => void;
  deleteDepartment: (id: number) => void;
}

const DepartmentPanel: React.FC<Props> = ({
  departments,
  updateDepartment,
  deleteDepartment,
}) => {
  const toggleConnection = (deptId: number, connectionId: number) => {
    const dept = departments.find((d) => d.id === deptId);
    if (!dept) return;
    const isConnected = dept.connections.includes(connectionId);
    const newConnections = isConnected
      ? dept.connections.filter((id) => id !== connectionId)
      : [...dept.connections, connectionId];
    updateDepartment(deptId, { connections: newConnections });
  };

  return (
    <div className="max-h-[500px] overflow-y-auto space-y-4">
      {departments.map((dept) => (
        <div
          key={dept.id}
          className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{dept.name}</h3>
            <button
              onClick={() => deleteDepartment(dept.id)}
              className="text-red-500 hover:text-red-700 font-bold px-2 py-1 border rounded-lg"
            >
              Delete
            </button>
          </div>

          {/* Connections */}
          <div>
            <span className="text-sm font-medium opacity-70">Connections:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {departments
                .filter((d) => d.id !== dept.id)
                .map((d) => {
                  const connected = dept.connections.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggleConnection(dept.id, d.id)}
                      className={`px-3 py-1 rounded-full border text-sm transition ${connected
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
                        }`}
                    >
                      {d.name}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      ))}

      {departments.length === 0 && (
        <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-xl">
          No departments yet
        </div>
      )}
    </div>
  );
};

export default DepartmentPanel;
