import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export default function Register() {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataDiNascita: "",
  });
  
  const [avatar, setAvatar] = useState(null); // Nuovo stato per l'immagine dell'avatar

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]); // Memorizza il file dell'avatar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData(); // Usa FormData per gestire il file

    // Aggiungi i campi del form
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    // Aggiungi l'immagine dell'avatar se presente
    if (avatar) {
      formDataToSend.append("avatar", avatar);
    }

    try {
      await registerUser(formDataToSend); // Invia il formData al server
      alert("Registrazione avvenuta con successo!");
      navigate("/login");
    } catch (error) {
      console.error("Errore durante la registrazione:", error);
      alert("Errore durante la registrazione. Riprova.");
    }
  };

  return (
    <div className="container">
      <h2>Registrazione</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cognome"
          placeholder="Cognome"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dataDiNascita"
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="avatar"
          onChange={handleFileChange} // Gestisci il file dell'avatar
        />
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
}
