// Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUserData } from "../services/api"; // Adjust the path as necessary
import "./Navbar.css";
import strivelogo from '../assets/strivelogo.png';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (token) {
        try {
          const userData = await getUserData();
          setAvatarUrl(userData.avatar);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?title=${searchTerm}`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div id="navbar" className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img className="logo" src={strivelogo} alt="Strive Logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isLoggedIn && (
              <li className="nav-item">
                <Link to="/create" className="nav-link">Nuovo Post</Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Registrati</Link>
                </li>
              </>
            )}
          </ul>
          <div id="search" className="d-flex me-2">
            <input
              type="text"
              className="search-input"
              placeholder="Cerca post..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch} className="search-button">Cerca</button>
          </div>
          {isLoggedIn && (
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  <img id="profile" src={avatarUrl} alt="Profile Avatar" className="rounded-circle" style={{ width: '50px', height: '50px' }} />
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn btn-link">Logout</button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
