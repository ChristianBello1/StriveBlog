import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getPosts } from "../services/api";
import "./Home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts(title ? { title } : {});
        setPosts(response.data);
      } catch (error) {
        console.error("Errore nella fetch dei post:", error);
      }
    };
    fetchPosts();
  }, [title]);

  return (
    <div className="container">
      <h1 className="text-white">Lista dei Post</h1>
      <div className="post-grid">
        {posts.map((post) => (
          <Link to={`/post/${post._id}`} key={post._id} className="post-card" id="post">
            <img src={post.cover} alt={post.title} className="post-image" />
            <div className="post-content">
              <h2>{post.title}</h2>
              <p>Autore: {post.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
