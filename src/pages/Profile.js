import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");

  /* =========================
     SAVE PROFILE (FIXED)
  ========================= */
  const handleSave = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${BACKEND_URL}/api/auth/profile`,
        {
          name,
          email,
          phone,
          address,
          profilePic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = res.data.user;

      // update Redux + localStorage
      dispatch({
        type: "UPDATE_PROFILE",
        payload: updatedUser,
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);

    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     PROFILE PIC
  ========================= */
  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfilePic(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-page">
      <h1>Your Profile 💖</h1>

      {user ? (
        <div className="profile-card">

          {/* IMAGE */}
          <div className="profile-pic-container">
            <img
              src={profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="profile-pic"
            />

            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handlePicChange}
                className="pic-upload"
              />
            )}
          </div>

          {/* FIELDS */}
          {isEditing ? (
            <div className="profile-fields">

              <label>Name:
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>

              <label>Email:
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>

              <label>Phone:
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>

              <label>Address:
                <input value={address} onChange={(e) => setAddress(e.target.value)} />
              </label>

              <div className="profile-buttons">

                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>

              </div>
            </div>
          ) : (
            <div className="profile-fields">

              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Address:</strong> {user.address || "-"}</p>

              <button
                className="edit-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>

            </div>
          )}

        </div>
      ) : (
        <p>Please log in to see your profile.</p>
      )}
    </div>
  );
};

export default Profile;
