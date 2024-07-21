import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, updatePost, getMe } from "../services/api";
import "./CreatePost.css";

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
    } else {
      setPost({ ...post, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
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
    }
  };

  return (
    <div className="container">
      <h1>Modifica Post</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Titolo:
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Categoria:
          <input
            type="text"
            name="category"
            value={post.category}
            onChange={handleChange}
          />
        </label>
        <label>
          Contenuto:
          <textarea
            name="content"
            value={post.content}
            onChange={handleChange}
          ></textarea>
        </label>
        <label>
          Tempo di lettura:
          <input
            type="number"
            name="readTimeValue"
            value={post.readTime.value}
            onChange={handleChange}
          />
          <select
            name="readTimeUnit"
            value={post.readTime.unit}
            onChange={handleChange}
          >
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
          </select>
        </label>
        <label>
          Copertina:
          <input type="file" name="cover" onChange={handleFileChange} />
        </label>
        <button type="submit">Salva modifiche</button>
      </form>
    </div>
  );
}
