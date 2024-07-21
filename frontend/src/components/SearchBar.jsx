// SearchBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

export default function SearchBar({ searchTerm, setSearchTerm, handleSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Cerca post..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch} className="search-button">Cerca</button>
    </div>
  );
}
