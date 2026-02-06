import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../api/axios";

export default function ManageHomepageContent() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("ARTICLE"); // ARTICLE | LOGO
  const [file, setFile] = useState(null);

  const fetchContent = async () => {
    const res = await axiosInstance.get("/homepage-content");
    setItems(res.data);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("type", type);
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("image", file);

    await axiosInstance.post("/homepage-content", formData);
    fetchContent();
    setTitle("");
    setDescription("");
    setFile(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Homepage Content</h1>

      {/* ADD FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="ARTICLE">Article</option>
          <option value="LOGO">School Logo</option>
        </select>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Content
        </button>
      </form>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border p-3 rounded">
            {item.image && (
              <img src={item.image} className="h-32 w-full object-cover mb-2" />
            )}
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-sm">{item.description}</p>
            <p className="text-xs mt-1 text-gray-500">{item.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
