import axios from "axios";

const API_URL = "https://striveblog-w11m.onrender.com/api";

const api = axios.create({ baseURL: API_URL });

// Aggiunge il token di autenticazione a ogni richiesta
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Funzioni per interagire con l'API del backend
export const getPosts = (params) => api.get("/blogPosts", { params });
export const getPostsByUser = async (userId) => {
  const response = await fetch(`${API_URL}/authors/${userId}/blogPosts`);
  if (!response.ok) throw new Error('Errore nel recupero dei post dell\'autore');
  return response.json();
};
export const getPost = (id) => api.get(`/blogPosts/${id}`).then(response => response.data);
export const createPost = (postData) => api.post("/blogPosts", postData, {
  headers: { "Content-Type": "multipart/form-data" },
});
// Modifica: Aggiunto header per gestire FormData
export const updatePost = (id, postData) => api.put(`/blogPosts/${id}`, postData, {
  headers: { "Content-Type": "multipart/form-data" },
});
export const deletePost = (id) => api.delete(`/blogPosts/${id}`);

// Funzioni per gestire i commenti
export const getComments = (postId) => api.get(`/blogPosts/${postId}/comments`).then(response => response.data);
export const addComment = (postId, commentData) => api.post(`/blogPosts/${postId}/comments`, commentData).then(response => response.data);
export const getComment = (postId, commentId) => api.get(`/blogPosts/${postId}/comments/${commentId}`).then(response => response.data);
export const updateComment = (postId, commentId, commentData) => api.put(`/blogPosts/${postId}/comments/${commentId}`, commentData).then(response => response.data);
export const deleteComment = (postId, commentId) => 
  api.delete(`/blogPosts/${postId}/comments/${commentId}`)
    .then(response => response.data)
    .catch(error => {
      console.error("Errore nella richiesta di eliminazione commento:", error.response?.data);
      throw error;
    });

// Funzioni per l'autenticazione
export const registerUser = async (formData) => {
  try {
    const response = await api.post("/authors", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Errore nella registrazione:", error);
    throw new Error("Errore nella registrazione");
  }
};
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Errore nella chiamata API di login:", error);
    throw error;
  }
};
export const getMe = () => api.get("/auth/me").then(response => response.data);
export const getUserData = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Errore nel recupero dei dati utente:', error);
    throw error;
  }
};

export default api;