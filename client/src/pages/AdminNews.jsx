import React, { useState } from "react";
import "./admin-news.css";

export default function AdminNews() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setForm({ ...form, image: files[0] });
    else setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    if (form.image) data.append("image", form.image);

    try {
      const res = await fetch("https://dhms-79l7.onrender.com/api/news", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("News added successfully!");
        setForm({ title: "", description: "", image: null });
      } else {
        setMessage("" + result.message);
      }
    } catch (error) {
      setMessage("Failed to add news: " + error.message);
    }
  };

  return (
    <div className="admin-news-container">
      <h2>Add News Update</h2>
      <form onSubmit={handleSubmit} className="admin-news-form">
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label>Image:</label>
        <input type="file" name="image" accept="image/*" onChange={handleChange} required />

        <button type="submit">Submit News</button>
      </form>

      {message && <p className="admin-news-message">{message}</p>}
    </div>
  );
}
