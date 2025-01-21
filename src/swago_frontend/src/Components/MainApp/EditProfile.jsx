import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainNavbar } from "./MainNavbar";
import { useConnect } from "@connect2ic/react";
import { useAuth } from "../../use-auth-client";
import { swago_backend } from "../../../../declarations/swago_backend";
import { Principal } from "@dfinity/principal";

export const EditProfile = () => {
  const navigate = useNavigate();
  const { principal: whoami } = useAuth();
  const { principal: connectPrincipal } = useConnect();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    display_picture: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (whoami) {
          console.log("Fetching profile for whoami:", whoami.toString());
          const result = await swago_backend.get_profile_details(whoami);
          if (result) {
            setFormData((prev) => ({
              ...prev,
              name: result.name || "",
              bio: result.bio || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [whoami]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!whoami) {
        throw new Error("No Internet Identity available");
      }

      // Convert image to blob
      const imageBlob = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(formData.display_picture);
      });

      const profileData = {
        principal: whoami,
        name: formData.name,
        display_ppicture: imageBlob,
        bio: formData.bio,
      };

      console.log("Submitting profile with principal", profileData.principal);

      const result = await swago_backend.set_profile(profileData);
      console.log("Profile update result:", result);
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!whoami) {
    return (
      <div className="min-h-screen bg-[#101a23] text-white">
        <MainNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">
            Please connect with Internet Identity to edit profile
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101a23] text-white">
      <MainNavbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div>
            <label className="block mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent border-2 border-white rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full bg-transparent border-2 border-white rounded-md p-2 min-h-[100px]"
              required
            />
          </div>

          <div>
            <label className="block mb-2">
              Profile Picture
              <p className="text-sm text-gray-400">
                *Image should be less than 2MB
              </p>
            </label>
            <input
              type="file"
              name="display_picture"
              onChange={handleChange}
              className="w-full bg-[#3e5f7c] p-2 rounded-md"
              accept="image/*"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#245bdf] hover:bg-blue-600 py-3 rounded-md transition-colors font-semibold"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};
