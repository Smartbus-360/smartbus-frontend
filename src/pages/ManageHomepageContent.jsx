import { useState } from "react";
import axios from "../../utils/axios"; // your axios instance

export default function ManageHomepageContent() {
  const [type, setType] = useState("logo");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    if (!file) return alert("Image required");

    const formData = new FormData();
    formData.append("type", type);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", file);

    await axios.post("/homepage-content", formData);
    alert("Content added");
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">
        Manage Homepage Content
      </h1>

      {/* TYPE SELECT */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border p-2 mb-4 w-full"
      >
        <option value="logo">School Logo</option>
        <option value="article">Article</option>
      </select>

      {/* TITLE */}
      {type === "article" && (
        <input
          placeholder="Article Title"
          className="border p-2 mb-3 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      )}

      {/* DESCRIPTION */}
      {type === "article" && (
        <textarea
          placeholder="Article Description"
          className="border p-2 mb-3 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      )}

      {/* IMAGE */}
      <input
        type="file"
        className="mb-4"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Upload
      </button>
    </div>
  );
}
