// Profile.jsx
import { useState, useEffect } from 'react';
import { getUserData, getPostsByUser, deletePost } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const data = await getUserData();
      setUser(data);
      const userPosts = await getPostsByUser(data._id);
      setPosts(userPosts);
    } catch (error) {
      console.error("Errore nel recupero dei dati utente o dei post:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    window.addEventListener('focus', fetchUserData);
    return () => window.removeEventListener('focus', fetchUserData);
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Errore nella cancellazione del post:", error);
    }
  };

  return (
    <div className="container profile">
      {user && (
        <div className="profile-header card mb-4 p-4 text-white">
          <div className="d-flex flex-column align-items-center">
            <img src={user.avatar} alt="Avatar" className="profile-avatar rounded-circle mb-3" />
            <h1 className="mb-1">{user.nome} {user.cognome}</h1>
            <h3 className="mb-3">{user.email}</h3>
          </div>
        </div>
      )}
      <div className="post-grid">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            <img src={post.cover} alt={post.title} className="post-image" />
            <div className="post-content">
              <h2>{post.title}</h2>
              <p>Autore: {post.author}</p>
              <div className="button-group">
                <button onClick={() => handleDeletePost(post._id)} className="btn btn-danger">
                  Elimina Post
                </button>
                <button onClick={() => navigate(`/edit/${post._id}`)} className="btn btn-primary">
                  Modifica Post
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
