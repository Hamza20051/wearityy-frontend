import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import"./Profile.css";
const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [profilePic, setProfilePic] = useState(user?.profilePic || "");

  const handleSave = () => {
    dispatch({
      type: "UPDATE_PROFILE",
      payload: { name, email, phone, address, profilePic },
    });
    setIsEditing(false);
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-page">
      <h1>Your Profile 💖</h1>
      {user ? (
        <div className="profile-card">
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
                <button className="save-btn" onClick={handleSave}>Save</button>
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="profile-fields">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Address:</strong> {user.address || "-"}</p>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
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
