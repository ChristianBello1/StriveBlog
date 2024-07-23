import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EditPost from "./pages/EditPost"; // Import EditPost
import BackgroundVideo from "./components/BackgroundVideo"; // Import BackgroundVideo
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <BackgroundVideo />
        <Navbar />
        <main>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit/:id" element={<EditPost />} /> {/* Add EditPost route */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
