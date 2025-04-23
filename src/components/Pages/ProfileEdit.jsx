import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [image, setImage] = useState(null); // For uploaded file
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(""); // For previewing current profile picture

  useEffect(() => {
    console.log("User ID:", userId);
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFormData({ name: data.name, email: data.email });
        setPreview(data.image); // Preview existing profile picture
      } catch (err) {
        setError("Failed to load user data.");
      }
    };
    fetchUserData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0])); // Preview uploaded image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    if (image instanceof File) data.append("image", image);

    try {
      await axios.put(`http://localhost:5000/users/${userId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/profile/${userId}`);
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </label>
        <label>
          Profile Picture:
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              style={{ width: "100px", height: "100px", marginTop: "10px" }}
            />
          )}
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
