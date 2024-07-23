import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPost, getComments, addComment, getUserData, deleteComment } from "../services/api";
import "./PostDetail.css";

export default function PostDetail() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(id);
        setPost(postData);
      } catch (error) {
        console.error("Errore nel caricamento del post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsData = await getComments(id);
        console.log("Commenti caricati:", commentsData);
        setComments(commentsData);
      } catch (error) {
        console.error("Errore nel caricamento dei commenti:", error);
      }
    };

    const checkAuthAndFetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        try {
          const data = await getUserData();
          setUserData(data);
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    fetchPost();
    fetchComments();
    checkAuthAndFetchUserData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      console.error("Devi effettuare il login per commentare.");
      return;
    }
    try {
      const commentData = {
        content: newComment.content,
        name: `${userData.nome} ${userData.cognome}`,
        email: userData.email,
      };
      console.log("Dati del commento da inviare:", commentData);
      const newCommentData = await addComment(id, commentData);

      console.log("Risposta dal server dopo l'aggiunta del commento:", newCommentData);

      setComments((prevComments) => [...prevComments, newCommentData]);
      setNewComment({ content: "" });
    } catch (error) {
      console.error("Errore nell'invio del commento:", error);
      console.error("Dettagli dell'errore:", error.response?.data);
      alert(
        `Errore nell'invio del commento: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isLoggedIn) {
      console.error("Devi effettuare il login per eliminare un commento.");
      return;
    }
    try {
      console.log("Tentativo di eliminazione del commento:", commentId);
      await deleteComment(id, commentId);
      setComments((prevComments) => prevComments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error("Errore nell'eliminazione del commento:", error);
      console.error("Dettagli dell'errore:", error.response?.data);
      alert(`Errore nell'eliminazione del commento: ${error.response?.data?.message || error.message}`);
    }
  };

  if (!post) return <div>Caricamento...</div>;

  return (
    <div className="container">
      <article className="post-detail">
        <img src={post.cover} alt={post.title} className="post-cover" />
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>Categoria: {post.category}</span>
          <span>Autore: {post.author}</span>
          <span>
            Tempo di lettura: {post.readTime.value} {post.readTime.unit}
          </span>
        </div>
        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <h3 className="comment-section-title">Commenti</h3>
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <strong className="text-white">{comment.name}</strong>
            <p className="text-white">{comment.content}</p>
            {isLoggedIn && userData && comment.email === userData.email && (
              <button onClick={() => handleDeleteComment(comment._id)} className="delete-comment-btn">
                Elimina
              </button>
            )}
          </div>
        ))}

        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment.content}
              onChange={(e) =>
                setNewComment({ ...newComment, content: e.target.value })
              }
              placeholder="Scrivi un commento..."
            />
            <button type="submit">Invia commento</button>
          </form>
        ) : (
          <p className="login-prompt">
            <Link to="/login">Accedi</Link> per visualizzare o lasciare
            commenti.
          </p>
        )}
      </article>
    </div>
  );
}