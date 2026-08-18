import { useEffect, useState } from "react";
import api from "./api";

function Profile({ onBack }) {

  const [user, setUser] = useState(null);
  const [myPosts, setMyPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  // ============================
  // LOAD PROFILE + POSTS
  // ============================

  const loadProfile = async () => {
    try {

      const response = await api.get("/users/me");

      setUser(response.data);

      const postsResponse = await api.get(
        `/posts/user/${response.data.id}`
      );

      setMyPosts(postsResponse.data);

    } catch (error) {

      console.error(
        "Failed to load profile:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  // ============================
  // START EDITING
  // ============================

  const startEditing = () => {

    setFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
    });

    setEditing(true);
  };

  // ============================
  // UPDATE PROFILE
  // ============================

  const updateProfile = async () => {

    try {

      const response = await api.put(
        "/users/me",
        formData
      );

      setUser(response.data);

      localStorage.setItem(
        "userId",
        response.data.id
      );

      setEditing(false);

    } catch (error) {

      console.error(
        "Failed to update profile:",
        error
      );

      alert(
        error.response?.data ||
        "Failed to update profile"
      );
    }
  };

  // ============================
  // LOADING
  // ============================

  if (loading) {

    return (
      <div className="profile-page">

        <div className="profile-card">

          <p>Loading profile...</p>

        </div>

      </div>
    );
  }

  // ============================
  // ERROR
  // ============================

  if (!user) {

    return (
      <div className="profile-page">

        <div className="profile-card">

          <h2>Unable to load profile</h2>

          <button
            className="back-button"
            onClick={onBack}
          >
            ← Back to Home
          </button>

        </div>

      </div>
    );
  }

  // ============================
  // PROFILE PAGE
  // ============================

  return (
    <div className="profile-page">

      {/* =========================
          PROFILE CARD
      ========================= */}

      <div className="profile-card">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back
        </button>


        {/* AVATAR */}

        <div className="profile-avatar">

          {user.name
            ? user.name.charAt(0).toUpperCase()
            : "U"}

        </div>


        {/* NAME */}

        <h1>
          {user.name || "User"}
        </h1>


        {/* USERNAME */}

        <p className="profile-username">
          @{user.username || "username"}
        </p>


        {/* PROFILE INFORMATION */}

        <div className="profile-info">

          <div className="profile-info-item">

            <span>Email</span>

            <strong>
              {user.email}
            </strong>

          </div>


          <div className="profile-info-item">

            <span>Username</span>

            <strong>
              @{user.username}
            </strong>

          </div>


          <div className="profile-info-item">

            <span>Role</span>

            <strong>
              {user.role}
            </strong>

          </div>

        </div>


        {/* =========================
            EDIT BUTTON
        ========================= */}

        {!editing && (

          <button
            className="edit-profile-button"
            onClick={startEditing}
          >
            ✏️ Edit Profile
          </button>

        )}


        {/* =========================
            EDIT FORM
        ========================= */}

        {editing && (

          <div className="edit-profile-form">

            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />


            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value,
                })
              }
            />


            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />


            <div className="edit-actions">

              <button
                className="save-profile-button"
                onClick={updateProfile}
              >
                Save Changes
              </button>


              <button
                className="cancel-profile-button"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>

            </div>

          </div>

        )}

      </div>


      {/* =========================
          MY POSTS
      ========================= */}

      <div className="profile-posts">

        <h2>
          My Posts
        </h2>


        {myPosts.length === 0 ? (

          <div className="profile-empty">

            <h3>
              No posts yet
            </h3>

            <p>
              Start sharing something!
            </p>

          </div>

        ) : (

          <div className="profile-posts-list">

            {myPosts.map((post) => (

              <div
                className="profile-post-card"
                key={post.id}
              >

                <p>
                  {post.caption || "No caption"}
                </p>


                <div className="profile-post-stats">

                  <span>
                    ❤️ {post.likesCount || 0}
                  </span>

                  <span>
                    💬 {post.commentsCount || 0}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Profile;