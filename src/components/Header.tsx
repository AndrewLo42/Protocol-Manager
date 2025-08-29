// src/components/Header.tsx
import React from "react";

interface HeaderProps {
  companyName: string;
}

const Header: React.FC<HeaderProps> = ({ companyName }) => {
  return (
    <header className="w-full bg-blue-600 text-white p-6 rounded-b-2xl shadow mb-6">
      <h1 className="text-2xl font-bold">{companyName}</h1>
    </header>
  );
};

export default Header;
