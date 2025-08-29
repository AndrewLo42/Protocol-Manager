import React, { useState } from "react";
import { Protocol, Department } from "../types";

interface Props {
  protocols: Protocol[];
  departments: Department[];
  editProtocol: (id: number, updated: Partial<Protocol>) => void;
  deleteProtocol: (id: number) => void;
  searchTerm: string;
}

const ProtocolRepository: React.FC<Props> = ({
  protocols,
  departments,
  editProtocol,
  deleteProtocol,
  searchTerm,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Protocol>>({});

  const startEdit = (protocol: Protocol) => {
    setEditingId(protocol.id);
    setEditData({
      title: protocol.title,
      summary: protocol.summary,
      steps: protocol.steps.join(", "),
      tags: protocol.tags.join(", "),
    });
  };

  const saveEdit = (id: number) => {
    editProtocol(id, {
      ...editData,
      steps: editData.steps?.split(",").map((s) => s.trim()) || [],
      tags: editData.tags?.split(",").map((t) => t.trim()) || [],
    });
    setEditingId(null);
  };

  const getDeptName = (deptId: number) =>
    departments.find((d) => d.id === deptId)?.name || "Unknown";

  const filtered = protocols.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 p-4 rounded-2xl shadow-md max-h-[600px] overflow-y-auto">
      <h2 className="font-bold text-xl mb-4">Protocols</h2>
      <div className="space-y-4">
        {filtered.map((protocol) => (
          <div
            key={protocol.id}
            className="bg-white p-4 rounded-lg shadow flex flex-col space-y-2"
          >
            {editingId === protocol.id ? (
              <>
                <input
                  className="border p-2 rounded w-full"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
                <input
                  className="border p-2 rounded w-full"
                  value={editData.summary}
                  onChange={(e) =>
                    setEditData({ ...editData, summary: e.target.value })
                  }
                />
                <input
                  className="border p-2 rounded w-full"
                  value={editData.steps}
                  onChange={(e) =>
                    setEditData({ ...editData, steps: e.target.value })
                  }
                  placeholder="Steps (comma-separated)"
                />
                <input
                  className="border p-2 rounded w-full"
                  value={editData.tags}
                  onChange={(e) =>
                    setEditData({ ...editData, tags: e.target.value })
                  }
                  placeholder="Tags (comma-separated)"
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    className="bg-yellow-400 py-1 px-3 rounded"
                    onClick={() => saveEdit(protocol.id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-300 py-1 px-3 rounded"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold">{protocol.title}</h3>
                <p className="text-gray-700">{protocol.summary}</p>
                <p className="text-sm font-medium text-gray-500">
                  Department: {getDeptName(protocol.departmentId)}
                </p>
                <ul className="list-disc ml-5">
                  {protocol.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
                {protocol.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {protocol.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex space-x-2 mt-2">
                  <button
                    className="bg-yellow-400 py-1 px-3 rounded"
                    onClick={() => startEdit(protocol)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded"
                    onClick={() => deleteProtocol(protocol.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProtocolRepository;
