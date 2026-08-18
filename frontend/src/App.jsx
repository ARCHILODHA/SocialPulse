import { useEffect, useState } from "react";

import api from "./api";
import "./App.css";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import Saved from "./pages/Saved";

import Profile from "./Profile";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminPosts from "./pages/AdminPosts";
import AdminComments from "./pages/AdminComments";
import AdminAnalytics from "./pages/AdminAnalytics";

// =====================================================
// READ ROLE FROM JWT
// =====================================================
// The backend remains the real security check.
// This helper is only used to decide whether to show
// the Admin Dashboard button in the UI.
const getUserFromToken = (jwtToken) => {

  if (!jwtToken) {
    return null;
  }

  try {

    const payload = JSON.parse(
      atob(
        jwtToken
          .split(".")[1]
          .replace(/-/g, "+")
          .replace(/_/g, "/")
      )
    );

    let role =
      payload.role ||
      payload.roles ||
      payload.authorities ||
      null;

    if (Array.isArray(role)) {
      role = role[0];
    }

    if (typeof role === "string") {
      role = role.replace(/^ROLE_/, "").toUpperCase();
    }

    return {
      email: payload.sub || payload.email || "",
      role: role || "USER",
    };

  } catch (error) {

    console.error(
      "Failed to read JWT:",
      error
    );

    return null;
  }
};


function App() {

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  const [currentUser, setCurrentUser] = useState(
    () =>
      getUserFromToken(
        localStorage.getItem("token")
      )
  );

  const [userId, setUserId] = useState(
    localStorage.getItem("userId")
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] =
    useState("");

  const [loggingIn, setLoggingIn] =
    useState(false);


  // =====================================================
  // APPLICATION STATE
  // =====================================================

  const [posts, setPosts] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState("home");

  const [adminSection, setAdminSection] =
    useState("dashboard");


  // =====================================================
  // SAVED POSTS
  // =====================================================

  const [savedPosts, setSavedPosts] =
    useState(() => {

      try {

        return JSON.parse(
          localStorage.getItem(
            "savedPosts"
          ) || "[]"
        );

      } catch {

        return [];

      }

    });


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] =
    useState(() => {

      try {

        return JSON.parse(
          localStorage.getItem(
            "notifications"
          ) || "[]"
        );

      } catch {

        return [];

      }

    });


  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (e) => {

    e.preventDefault();

    setLoginError("");
    setLoggingIn(true);

    try {

      const response =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      const receivedToken =
        response.data.token;

      if (!receivedToken) {

        throw new Error(
          "JWT token was not returned"
        );

      }

      localStorage.setItem(
        "token",
        receivedToken
      );

      localStorage.setItem(
        "userId",
        response.data.id
      );

      setToken(receivedToken);

      setUserId(
        response.data.id
      );

      setCurrentUser(
        getUserFromToken(receivedToken)
      );

      setCurrentPage("home");

    } catch (error) {

      console.error(
        "Login failed:",
        error
      );

      setLoginError(
        error.response?.data?.message ||
        "Invalid email or password"
      );

    } finally {

      setLoggingIn(false);

    }

  };


  // =====================================================
  // LOAD POSTS
  // =====================================================

  useEffect(() => {

    if (token) {

      loadPosts();

    }

  }, [token]);


  // Keep the admin page inaccessible in the UI
  // when the current JWT does not contain ADMIN.
  useEffect(() => {

    if (
      currentPage === "admin" &&
      currentUser?.role !== "ADMIN"
    ) {
      setCurrentPage("home");
    }

  }, [currentPage, currentUser]);


  const loadPosts = async () => {

    setLoading(true);

    try {

      const response =
        await api.get("/posts");

      setPosts(
        response.data
      );

    } catch (error) {

      console.error(
        "Failed to load posts:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        logout();

      }

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // POST CREATED
  // =====================================================
  //
  // CreatePost.jsx already creates the post through
  // the backend and sends the newly created post here.
  //
  // We simply add that post to the beginning of the feed.
  // =====================================================

  const handlePostCreated = (newPost) => {

    if (!newPost?.id) {
      return;
    }

    setPosts((currentPosts) => [
      newPost,
      ...currentPosts,
    ]);

  };


  // =====================================================
  // POST UPDATED
  // =====================================================

  const handlePostUpdated = (
    updatedPost
  ) => {

    if (!updatedPost?.id) {
      return;
    }

    setPosts((current) =>
      current.map((post) =>
        String(post.id) ===
        String(updatedPost.id)
          ? updatedPost
          : post
      )
    );

  };


  // =====================================================
  // LIKE
  // =====================================================

  const toggleLike = async (postId) => {

    try {

      const response =
        await api.post(
          `/posts/${postId}/like`
        );

      handlePostUpdated(
        response.data
      );

      addNotification({
        type: "like",
        message:
          "You interacted with a post",
      });

    } catch (error) {

      console.error(
        "Like failed:",
        error
      );

    }

  };


  // =====================================================
  // DELETE POST
  // =====================================================

  const deletePost = async (
    postId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `/posts/${postId}`
      );

      setPosts((current) =>
        current.filter(
          (post) =>
            String(post.id) !==
            String(postId)
        )
      );

    } catch (error) {

      console.error(
        "Delete failed:",
        error
      );

      alert(
        error.response?.data ||
        "Failed to delete post"
      );

    }

  };


  // =====================================================
  // SAVE / UNSAVE
  // =====================================================

  const toggleSave = (postId) => {

    setSavedPosts((current) => {

      const exists =
        current.some(
          (id) =>
            String(id) ===
            String(postId)
        );

      const updated = exists

        ? current.filter(
            (id) =>
              String(id) !==
              String(postId)
          )

        : [
            ...current,
            postId,
          ];


      localStorage.setItem(
        "savedPosts",
        JSON.stringify(updated)
      );


      return updated;

    });

  };


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const addNotification =
    (notification) => {

      const item = {

        id: Date.now(),

        ...notification,

        createdAt:
          new Date().toLocaleString(),

      };


      setNotifications(
        (current) => {

          const updated = [
            item,
            ...current,
          ].slice(0, 50);


          localStorage.setItem(
            "notifications",
            JSON.stringify(
              updated
            )
          );


          return updated;

        }
      );

    };


  const clearNotifications = () => {

    setNotifications([]);

    localStorage.removeItem(
      "notifications"
    );

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "userId"
    );

    setToken(null);

    setUserId(null);

    setCurrentUser(null);

    setPosts([]);

    setCurrentPage("home");

  };


  // =====================================================
  // LOGIN SCREEN
  // =====================================================

  if (!token) {

    return (

      <div className="socialpulse">

        <div className="login-container">

          <div className="login-card">

            <div className="logo">
              Social<span>Pulse</span>
            </div>


            <p className="tagline">
              Connect. Share. Engage.
            </p>


            <h2>
              Welcome Back
            </h2>


            <form
              onSubmit={login}
            >

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                required
              />


              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                required
              />


              {loginError && (

                <p className="login-error">
                  {loginError}
                </p>

              )}


              <button
                type="submit"
                disabled={loggingIn}
              >

                {loggingIn
                  ? "Logging in..."
                  : "Login"}

              </button>

            </form>

          </div>

        </div>

      </div>

    );

  }


  // =====================================================
  // MAIN APPLICATION
  // =====================================================

  // Admin access is checked again at render time below.
  // The backend endpoint remains the authoritative check.

  return (

    <div className="socialpulse">


      {/* =================================================
          NAVBAR
          ================================================= */}

      <Navbar
        currentPage={currentPage}
        setCurrentPage={
          setCurrentPage
        }
        notificationCount={
          notifications.length
        }
        onLogout={logout}
      />

      {/* =================================================
          ADMIN ACCESS
          ================================================= */}

      {currentUser?.role === "ADMIN" && (
        <button
          type="button"
          className="admin-nav-button"
          onClick={() => {
            setAdminSection("dashboard");
            setCurrentPage("admin");
          }}
        >
          📊 Admin Dashboard
        </button>
      )}


      {/* =================================================
          HOME
          ================================================= */}

      {currentPage === "home" && (

        <Home
          posts={posts}
          loading={loading}
          userId={userId}
          savedPosts={savedPosts}

          onPostCreated={
            handlePostCreated
          }

          onPostUpdated={
            handlePostUpdated
          }

          onPostDeleted={
            deletePost
          }

          onSaveToggle={
            toggleSave
          }

        />

      )}


      {/* =================================================
          EXPLORE
          ================================================= */}

      {currentPage === "explore" && (

        <Explore
          posts={posts}
          userId={userId}
          savedPosts={savedPosts}

          onPostUpdated={
            handlePostUpdated
          }

          onPostDeleted={
            deletePost
          }

          onSaveToggle={
            toggleSave
          }

        />

      )}


      {/* =================================================
          NOTIFICATIONS
          ================================================= */}

      {currentPage ===
        "notifications" && (

        <Notifications
          notifications={
            notifications
          }

          onClear={
            clearNotifications
          }

        />

      )}


      {/* =================================================
          SAVED
          ================================================= */}

      {currentPage === "saved" && (

        <Saved
          posts={posts}
          userId={userId}
          savedPosts={savedPosts}

          onPostUpdated={
            handlePostUpdated
          }

          onPostDeleted={
            deletePost
          }

          onSaveToggle={
            toggleSave
          }

        />

      )}


      {/* =================================================
          PROFILE
          ================================================= */}

      {currentPage === "profile" && (

        <Profile
          onBack={() =>
            setCurrentPage("home")
          }
        />

      )}

{/* =================================================
    ADMIN ANALYTICS
    ================================================= */}

{currentPage === "admin" &&
  currentUser?.role === "ADMIN" &&
  adminSection === "analytics" && (

  <AdminAnalytics
    onBack={() =>
      setAdminSection("dashboard")
    }
  />

)}
      {/* =================================================
          ADMIN DASHBOARD
          ================================================= */}

      {currentPage === "admin" &&
        currentUser?.role === "ADMIN" &&
        adminSection === "dashboard" && (

        <AdminDashboard
          onBack={() => {
            setAdminSection("dashboard");
            setCurrentPage("home");
          }}
          onSectionChange={(section) => {
            setAdminSection(section);
          }}
        />

      )}

      {currentPage === "admin" &&
        currentUser?.role === "ADMIN" &&
        adminSection === "users" && (

        <AdminUsers
          onBack={() =>
            setAdminSection("dashboard")
          }
        />

      )}

      {/* =================================================
          ADMIN POSTS
          ================================================= */}

      {currentPage === "admin" &&
        currentUser?.role === "ADMIN" &&
        adminSection === "posts" && (

        <AdminPosts
          onBack={() =>
            setAdminSection("dashboard")
          }
        />

      )}
      {/* =================================================
    ADMIN COMMENTS
    ================================================= */}

{currentPage === "admin" &&
  currentUser?.role === "ADMIN" &&
  adminSection === "comments" && (

  <AdminComments
    onBack={() =>
      setAdminSection("dashboard")
    }
  />

)}

    </div>

  );

}


export default App;