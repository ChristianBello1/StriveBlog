import express from "express";
import BlogPost from "../models/BlogPost.js";
import cloudinaryUploader from "../config/claudinaryConfig.js";
import { sendEmail } from "../services/emailService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET tutti i post
router.get("/", async (req, res) => {
  try {
    let query = req.query.title ? { title: { $regex: req.query.title, $options: "i" } } : {};
    const blogPosts = await BlogPost.find(query);
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET un singolo post
router.get("/:id", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) return res.status(404).json({ message: "Blog post non trovato" });
    res.json(blogPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware di autenticazione per le route seguenti
router.use(authMiddleware);

// POST crea un nuovo post
router.post("/", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    const postData = req.body;
    if (req.file) postData.cover = req.file.path;
    const newPost = new BlogPost(postData);
    await newPost.save();
    // Invia email di conferma
    const htmlContent = `<h1>Il tuo post è stato pubblicato!</h1>...`;
    await sendEmail(newPost.author, "Post pubblicato", htmlContent);
    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// PUT modifica un post esistente
router.put("/:id", cloudinaryUploader.single("cover"), async (req, res) => {
  console.log("Richiesta di aggiornamento ricevuta per il post ID:", req.params.id);
  console.log("Dati ricevuti:", req.body);
  console.log("File ricevuto:", req.file);
  try {
    const postData = req.body;
    if (req.file) postData.cover = req.file.path;
    const updatedBlogPost = await BlogPost.findByIdAndUpdate(req.params.id, postData, { new: true });
    if (!updatedBlogPost) return res.status(404).json({ message: "Blog post non trovato" });
    console.log("Post aggiornato:", updatedBlogPost);
    res.json(updatedBlogPost);
  } catch (err) {
    console.error("Errore nell'aggiornamento del post:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE elimina un post
router.delete("/:id", async (req, res) => {
  try {
    const deletedBlogPost = await BlogPost.findByIdAndDelete(req.params.id);
    if (!deletedBlogPost) return res.status(404).json({ message: "Blog post non trovato" });
    res.json({ message: "Blog post eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH aggiorna solo la copertina di un post
router.patch("/:blogPostId/cover", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Nessun file caricato" });
    const blogPost = await BlogPost.findById(req.params.blogPostId);
    if (!blogPost) return res.status(404).json({ message: "Blog post non trovato" });
    blogPost.cover = req.file.path;
    await blogPost.save();
    res.json(blogPost);
  } catch (error) {
    console.error("Errore durante l'aggiornamento della copertina:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

// Route per la gestione dei commenti

// GET tutti i commenti di un post
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post non trovato" });
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET un singolo commento di un post
router.get("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post non trovato" });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Commento non trovato" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST aggiungi un nuovo commento a un post
router.post("/:id/comments", authMiddleware, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post non trovato" });
    const newComment = {
      name: req.body.name,
      email: req.body.email,
      content: req.body.content
    };
    post.comments.push(newComment);
    await post.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT modifica un commento esistente
router.put("/:id/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post non trovato" });
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Commento non trovato" });
    
    // Verifica che l'utente che fa la richiesta sia l'autore del commento
    if (comment.email !== req.user.email) {
      return res.status(403).json({ message: "Non autorizzato a modificare questo commento" });
    }
    
    comment.content = req.body.content;
    await post.save();
    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE elimina un commento
router.delete("/:id/comments/:commentId", authMiddleware, async (req, res) => {
  console.log("Richiesta di eliminazione commento ricevuta:", req.params);
  console.log("Utente autenticato:", req.author);
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Blog post non trovato" });
    
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Commento non trovato" });
    
    // Verifica che l'utente che fa la richiesta sia l'autore del commento
    if (comment.email !== req.author.email) {
      return res.status(403).json({ message: "Non autorizzato a eliminare questo commento" });
    }
    
    // Rimuovi il commento usando il metodo pull di Mongoose
    post.comments.pull({ _id: req.params.commentId });
    
    await post.save();
    res.json({ message: "Commento eliminato" });
  } catch (err) {
    console.error("Errore dettagliato durante l'eliminazione del commento:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;