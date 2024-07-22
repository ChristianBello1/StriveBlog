import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, updatePost, getMe } from "../services/api";
import "./CreatePost.css";
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditPost() {
  const { id } = useParams();
  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
    readTime: { value: 0, unit: "minutes" },
    author: "",
  });
  const [coverFile, setCoverFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postData = await getPost(id);
        setPost(postData);
      } catch (error) {
        console.error("Errore nel recupero dei dati del post:", error);
        navigate("/");
      }
    };
    fetchPostData();
  }, [id, navigate]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await getMe();
        setPost((prevPost) => ({ ...prevPost, author: userData.email }));
      } catch (error) {
        console.error("Errore nel recupero dei dati utente:", error);
        navigate("/login");
      }
    };
    fetchUserEmail();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "readTimeValue") {
      setPost({
        ...post,
        readTime: { ...post.readTime, value: parseInt(value) },
      });
    } else if (name === "readTimeUnit") {
      setPost({
        ...post,
        readTime: { ...post.readTime, unit: value },
      });
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const formData = new FormData();
    Object.keys(post).forEach((key) => {
      if (key === "readTime") {
        formData.append("readTime[value]", post.readTime.value);
        formData.append("readTime[unit]", post.readTime.unit);
      } else {
        formData.append(key, post[key]);
      }
    });
  
    if (coverFile) {
      formData.append("cover", coverFile);
    }
  
    try {
      const response = await updatePost(id, formData);
      console.log("Post aggiornato con successo", response);
      navigate("/profile");
    } catch (error) {
      console.error("Errore nella modifica del post:", error);
      alert("Si è verificato un errore durante l'aggiornamento del post. Riprova.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      {isLoading && <LoadingSpinner />}
      <h1>Modifica Post</h1>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label>Titolo</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Categoria</label>
          <input
            type="text"
            id="category"
            name="category"
            value={post.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Contenuto</label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Tempo di lettura</label>
          <input
            type="number"
            id="readTimeValue"
            name="readTimeValue"
            value={post.readTime.value}
            onChange={handleChange}
            required
          />
          <select
            id="readTimeUnit"
            name="readTimeUnit"
            value={post.readTime.unit}
            onChange={handleChange}
            required
          >
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
          </select>
        </div>
        <div className="form-group">
          <label>Immagine di copertina</label>
          <input
            type="file"
            id="cover"
            name="cover"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <label>Email autore</label>
          <input
            type="email"
            id="author"
            name="author"
            value={post.author}
            readOnly
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Caricamento..." : "Salva modifiche"}
        </button>
      </form>
    </div>
  );
}