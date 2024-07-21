// SearchBar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?title=${searchTerm}`);
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Cerca post..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="search-button">Cerca</button>
    </form>
  );
}
