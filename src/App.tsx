import React, { useEffect, useState } from "react";
import DepartmentPanel from "./components/DepartmentPanel";
import Header from "./components/Header";
import ProtocolSearch from "./components/ProtocolSearch";
import ProtocolRepository from "./components/ProtocolRepository";
import GraphView from "./components/GraphView";
import { Department, Protocol } from "./types";

// --- Seed Data ---
const seedDepartments: Department[] = [
  { id: 1, name: "HR", connections: [2] },
  { id: 2, name: "IT", connections: [1, 3] },
  { id: 3, name: "Operations", connections: [2] },
];

const seedProtocols: Protocol[] = [
  {
    id: 1,
    title: "Onboarding Process",
    summary: "Steps for bringing a new hire into the company",
    steps: ["Collect documents", "Set up IT accounts", "Orientation session"],
    departmentId: 1,
    tags: ["hiring", "new employee"],
  },
  {
    id: 2,
    title: "Password Reset",
    summary: "Procedure for assisting employees with forgotten passwords",
    steps: ["Verify identity", "Reset in admin portal", "Notify employee"],
    departmentId: 2,
    tags: ["IT", "security"],
  },
  {
    id: 3,
    title: "Supply Request",
    summary: "How to request new office supplies",
    steps: ["Fill form", "Manager approval", "Ops fulfillment"],
    departmentId: 3,
    tags: ["operations", "office"],
  },
];

export default function App() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 NEW: keep track of filtered protocols and active filter
  const [filteredProtocols, setFilteredProtocols] = useState<Protocol[]>([]);
  const [activeDeptFilter, setActiveDeptFilter] = useState<number | null>(null);

  // Add-Department form
  const [newDeptName, setNewDeptName] = useState("");

  // Add-Protocol form
  const [newProtocol, setNewProtocol] = useState({
    title: "",
    summary: "",
    steps: "",
    tags: "",
    departmentId: "",
  });

  // Load data from localStorage or seed
  useEffect(() => {
    const saved = localStorage.getItem("dept-protocol-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDepartments(parsed.departments || []);
      setProtocols(parsed.protocols || []);
      setFilteredProtocols(parsed.protocols || []); // keep filtered list
    } else {
      setDepartments(seedDepartments);
      setProtocols(seedProtocols);
      setFilteredProtocols(seedProtocols);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(
      "dept-protocol-data",
      JSON.stringify({ departments, protocols })
    );
  }, [departments, protocols]);

  // Reset to seed data
  const resetToSeedData = () => {
    setDepartments(seedDepartments);
    setProtocols(seedProtocols);
    setFilteredProtocols(seedProtocols);
    localStorage.setItem(
      "dept-protocol-data",
      JSON.stringify({ departments: seedDepartments, protocols: seedProtocols })
    );
  };

  // Add new department
  const addDepartment = () => {
    if (!newDeptName.trim()) return;
    const newDept: Department = {
      id: Date.now(),
      name: newDeptName.trim(),
      connections: [],
    };
    setDepartments((prev) => [...prev, newDept]);
    setNewDeptName("");
  };

  // Update department
  const updateDepartment = (id: number, updated: Partial<Department>) => {
    setDepartments((prev) =>
      prev.map((dept) => (dept.id === id ? { ...dept, ...updated } : dept))
    );
  };

  // Delete department
  const deleteDepartment = (id: number) => {
    setDepartments((prev) => prev.filter((dept) => dept.id !== id));
    // Also remove any protocols associated with this department
    setProtocols((prev) => prev.filter((p) => p.departmentId !== id));
    setFilteredProtocols((prev) => prev.filter((p) => p.departmentId !== id));
  };

  // Add new protocol
  const addProtocol = () => {
    if (!newProtocol.title.trim() || !newProtocol.departmentId) return;

    const p: Protocol = {
      id: Date.now(),
      title: newProtocol.title.trim(),
      summary: newProtocol.summary.trim(),
      steps: newProtocol.steps
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: newProtocol.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      departmentId: Number(newProtocol.departmentId),
    };
    setProtocols((prev) => [...prev, p]);
    setFilteredProtocols((prev) => [...prev, p]); // keep filtered list updated
    setNewProtocol({
      title: "",
      summary: "",
      steps: "",
      tags: "",
      departmentId: "",
    });
  };
  // Edit a protocol
  const editProtocol = (id: number, updated: Partial<Protocol>) => {
    setProtocols((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    setFilteredProtocols((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  // Delete protocol
  const deleteProtocol = (id: number) => {
    setProtocols((prev) => prev.filter((p) => p.id !== id));
    setFilteredProtocols((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <Header companyName="HealthCare Synergy"/>
      <div className="min-h-screen bg-gray-100 p-6 grid grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="col-span-1 space-y-6">
          <DepartmentPanel
            departments={departments}
            // setDepartments={setDepartments}
            updateDepartment={updateDepartment}
            deleteDepartment={deleteDepartment}
          />

          {/* Add Department */}
          <div className="p-4 bg-white rounded-2xl shadow">
            <h2 className="font-bold text-lg mb-2">Add Department</h2>
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="Department name"
              className="w-full border p-2 rounded mb-2"
            />
            <button
              onClick={addDepartment}
              className="w-full bg-blue-500 text-white py-2 rounded-lg shadow hover:bg-blue-600"
            >
              Add Department
            </button>
          </div>

          <ProtocolSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            protocols={protocols}
            departments={departments}
            setFilteredProtocols={setFilteredProtocols}
            activeDeptFilter={activeDeptFilter}
            setActiveDeptFilter={setActiveDeptFilter}
          />

          {/* Reset button */}
          <button
            onClick={resetToSeedData}
            className="w-full bg-red-500 text-white py-2 rounded-lg shadow hover:bg-red-600"
          >
            Reset to Seed Data
          </button>
        </div>

        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <ProtocolRepository
            protocols={filteredProtocols}
            setProtocols={setProtocols}
            editProtocol={editProtocol}
            deleteProtocol={deleteProtocol}
            departments={departments}
            searchTerm={searchTerm}
          />

          {/* Add Protocol */}
          <div className="p-4 bg-white rounded-2xl shadow">
            <h2 className="font-bold text-lg mb-2">Add Protocol</h2>
            <input
              type="text"
              value={newProtocol.title}
              onChange={(e) =>
                setNewProtocol({ ...newProtocol, title: e.target.value })
              }
              placeholder="Title"
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="text"
              value={newProtocol.summary}
              onChange={(e) =>
                setNewProtocol({ ...newProtocol, summary: e.target.value })
              }
              placeholder="Summary"
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="text"
              value={newProtocol.steps}
              onChange={(e) =>
                setNewProtocol({ ...newProtocol, steps: e.target.value })
              }
              placeholder="Steps (comma-separated)"
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="text"
              value={newProtocol.tags}
              onChange={(e) =>
                setNewProtocol({ ...newProtocol, tags: e.target.value })
              }
              placeholder="Tags (comma-separated)"
              className="w-full border p-2 rounded mb-2"
            />
            <select
              value={newProtocol.departmentId}
              onChange={(e) =>
                setNewProtocol({ ...newProtocol, departmentId: e.target.value })
              }
              className="w-full border p-2 rounded mb-2"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <button
              onClick={addProtocol}
              className="w-full bg-green-500 text-white py-2 rounded-lg shadow hover:bg-green-600"
            >
              Add Protocol
            </button>
          </div>

          <GraphView departments={departments} />
        </div>
      </div>
    </div>
  );
}
