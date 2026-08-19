import { useEffect, useState } from "react";

import LandingPage from "./pages/LandingPage";
import api from "./api";
import "./App.css";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import Saved from "./pages/Saved";

import Profile from "./Profile";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminPosts from "./pages/AdminPosts";
import AdminComments from "./pages/AdminComments";
import AdminAnalytics from "./pages/AdminAnalytics";


// =====================================================
// READ ROLE FROM JWT
// =====================================================

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
      role = role
        .replace(/^ROLE_/, "")
        .toUpperCase();
    }

    return {
      email:
        payload.sub ||
        payload.email ||
        "",

      role:
        role || "USER",
    };

  } catch (error) {

    console.error(
      "Failed to read JWT:",
      error
    );

    return null;
  }
};


// =====================================================
// APP
// =====================================================

function App() {


  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [currentUser, setCurrentUser] =
    useState(() =>
      getUserFromToken(
        localStorage.getItem("token")
      )
    );

  const [userId, setUserId] = useState(
    localStorage.getItem("userId")
  );

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loginError, setLoginError] =
    useState("");

  const [loggingIn, setLoggingIn] =
    useState(false);


  // =====================================================
  // APPLICATION STATE
  // =====================================================

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(
      token
        ? "home"
        : "landing"
    );

  const [authPage, setAuthPage] =
    useState(
      token
        ? null
        : "landing"
    );

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
    useState([]);

  const [notificationCount, setNotificationCount] =
    useState(0);


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


      // Save authentication
      localStorage.setItem(
        "token",
        receivedToken
      );

      localStorage.setItem(
        "userId",
        response.data.id
      );


      // Update React state
      setToken(receivedToken);

      setUserId(
        response.data.id
      );

      setCurrentUser(
        getUserFromToken(
          receivedToken
        )
      );


      setCurrentPage("home");
      setAuthPage(null);

      // Clear login fields
      setEmail("");
      setPassword("");

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

  const loadPosts = async () => {

    if (!token) {
      return;
    }

    setLoading(true);

    try {

      const response =
        await api.get(
          "/posts"
        );

      setPosts(
        response.data || []
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
  // LOAD NOTIFICATIONS
  // =====================================================

  const loadNotifications = async () => {

    if (!token) {
      return;
    }

    try {

      const response =
        await api.get(
          "/notifications"
        );

      setNotifications(
        response.data || []
      );

    } catch (error) {

      console.error(
        "Failed to load notifications:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        logout();

      }

    }

  };


  // =====================================================
  // LOAD UNREAD NOTIFICATION COUNT
  // =====================================================

  const loadNotificationCount = async () => {

    if (!token) {
      return;
    }

    try {

      const response =
        await api.get(
          "/notifications/unread-count"
        );

      setNotificationCount(
        Number(response.data) || 0
      );

    } catch (error) {

      console.error(
        "Failed to load notification count:",
        error
      );

    }

  };


  // =====================================================
  // LOAD DATA AFTER LOGIN
  // =====================================================

  useEffect(() => {

    if (!token) {
      return;
    }

    loadPosts();

    loadNotifications();

    loadNotificationCount();

  }, [token]);


  // =====================================================
  // REFRESH NOTIFICATIONS
  // =====================================================
  // Refresh notification data periodically so the
  // navbar badge updates when another user likes/comments.

  useEffect(() => {

    if (!token) {
      return;
    }

    const interval =
      setInterval(() => {

        loadNotificationCount();

        if (
          currentPage ===
          "notifications"
        ) {

          loadNotifications();

        }

      }, 10000);

    return () =>
      clearInterval(interval);

  }, [
    token,
    currentPage
  ]);


  // =====================================================
  // ADMIN ACCESS CHECK
  // =====================================================

  useEffect(() => {

    if (
      currentPage === "admin" &&
      currentUser?.role !== "ADMIN"
    ) {

      setCurrentPage("home");

    }

  }, [
    currentPage,
    currentUser
  ]);


  // =====================================================
  // POST CREATED
  // =====================================================

  const handlePostCreated = (
    newPost
  ) => {

    if (!newPost?.id) {
      return;
    }

    setPosts(
      currentPosts => [
        newPost,
        ...currentPosts,
      ]
    );

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

    setPosts(
      current =>
        current.map(
          post =>
            String(post.id) ===
            String(updatedPost.id)

              ? updatedPost

              : post
        )
    );

  };


  // =====================================================
  // LIKE / UNLIKE
  // =====================================================

  const toggleLike = async (
    postId
  ) => {

    try {

      const response =
        await api.post(
          `/posts/${postId}/like`
        );

      handlePostUpdated(
        response.data
      );


      // Refresh real notification data
      await loadNotificationCount();

      if (
        currentPage ===
        "notifications"
      ) {

        await loadNotifications();

      }

    } catch (error) {

      console.error(
        "Like failed:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        alert(
          "Please login again."
        );

      }

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

      setPosts(
        current =>
          current.filter(
            post =>
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

  const toggleSave = (
    postId
  ) => {

    setSavedPosts(
      current => {

        const exists =
          current.some(
            id =>
              String(id) ===
              String(postId)
          );

        const updated =
          exists

            ? current.filter(
                id =>
                  String(id) !==
                  String(postId)
              )

            : [
                ...current,
                postId,
              ];


        localStorage.setItem(
          "savedPosts",
          JSON.stringify(
            updated
          )
        );


        return updated;

      }
    );

  };


  // =====================================================
  // MARK ALL NOTIFICATIONS AS READ
  // =====================================================

  const markAllNotificationsRead =
    async () => {

      try {

        await api.put(
          "/notifications/read-all"
        );

        setNotifications(
          current =>
            current.map(
              notification => ({
                ...notification,
                read: true,
              })
            )
        );

        setNotificationCount(0);

      } catch (error) {

        console.error(
          "Failed to mark notifications as read:",
          error
        );

      }

    };


  // =====================================================
  // CLEAR ALL NOTIFICATIONS
  // =====================================================

  const clearNotifications =
    async () => {

      try {

        await api.delete(
          "/notifications"
        );

        setNotifications([]);

        setNotificationCount(0);

      } catch (error) {

        console.error(
          "Failed to clear notifications:",
          error
        );

      }

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

    setNotifications([]);

    setNotificationCount(0);

    setCurrentPage(
      "landing"
    );

    setAuthPage(
      "landing"
    );

  };


  // =====================================================
  // AUTHENTICATION SCREENS
  // =====================================================

  if (!token) {


    // ===================================================
    // LANDING PAGE
    // ===================================================

    if (
      authPage === "landing"
    ) {

      return (
        <LandingPage

          onLogin={() => {

            setLoginError("");

            setAuthPage(
              "login"
            );

          }}

          onRegister={() => {

            setAuthPage(
              "register"
            );

          }}

        />
      );

    }


    // ===================================================
    // REGISTER PAGE
    // ===================================================

    if (
      authPage === "register"
    ) {

      return (
        <Register

          onLogin={() => {

            setLoginError("");

            setAuthPage(
              "login"
            );

          }}

        />
      );

    }


    // ===================================================
    // LOGIN PAGE
    // ===================================================

    return (

      <div className="socialpulse">

        <div className="login-container">

          <div className="login-card">


            {/* LOGO */}

            <div className="logo">
              Social<span>Pulse</span>
            </div>

            <p className="tagline">
              Connect. Share. Engage.
            </p>


            {/* TITLE */}

            <h2>
              Welcome Back
            </h2>


            {/* LOGIN FORM */}

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


              {/* ERROR */}

              {loginError && (

                <p className="login-error">
                  {loginError}
                </p>

              )}


              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loggingIn}
              >

                {loggingIn
                  ? "Logging in..."
                  : "Login"}

              </button>

            </form>


            {/* REGISTER */}

            <div
              style={{
                marginTop: "22px",
                textAlign: "center",
                color: "#777181",
                fontSize: "14px",
              }}
            >

              Don't have an account?

              <button
                type="button"
                onClick={() => {

                  setLoginError("");

                  setAuthPage(
                    "register"
                  );

                }}
                style={{
                  marginLeft: "6px",
                  padding: 0,
                  border: "none",
                  background:
                    "transparent",
                  color: "#7c3aed",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >

                Create Account

              </button>

            </div>


            {/* BACK TO LANDING */}

            <div
              style={{
                marginTop: "14px",
                textAlign: "center",
              }}
            >

              <button
                type="button"
                onClick={() => {

                  setLoginError("");

                  setAuthPage(
                    "landing"
                  );

                }}
                style={{
                  padding: 0,
                  border: "none",
                  background:
                    "transparent",
                  color: "#8b8798",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >

                ← Back to SocialPulse

              </button>

            </div>


          </div>

        </div>

      </div>

    );

  }


  // =====================================================
  // MAIN APPLICATION
  // =====================================================

  return (

    <div className="socialpulse">


      {/* =================================================
          NAVBAR
          ================================================= */}

      <Navbar

        currentPage={
          currentPage
        }

        setCurrentPage={
          setCurrentPage
        }

        notificationCount={
          notificationCount
        }

        onLogout={
          logout
        }

      />


      {/* =================================================
          ADMIN BUTTON
          ================================================= */}

      {currentUser?.role ===
        "ADMIN" && (

        <button
          type="button"
          className="admin-nav-button"
          onClick={() => {

            setAdminSection(
              "dashboard"
            );

            setCurrentPage(
              "admin"
            );

          }}
        >

          📊 Admin Dashboard

        </button>

      )}


      {/* =================================================
          HOME
          ================================================= */}

      {currentPage ===
        "home" && (

        <Home

          posts={
            posts
          }

          loading={
            loading
          }

          userId={
            userId
          }

          user={
            currentUser
          }

          savedPosts={
            savedPosts
          }

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

      {currentPage ===
        "explore" && (

        <Explore

          posts={
            posts
          }

          userId={
            userId
          }

          savedPosts={
            savedPosts
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

          onMarkAllRead={
            markAllNotificationsRead
          }

        />

      )}


      {/* =================================================
          SAVED
          ================================================= */}

      {currentPage ===
        "saved" && (

        <Saved

          posts={
            posts
          }

          userId={
            userId
          }

          savedPosts={
            savedPosts
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
          PROFILE
          ================================================= */}

      {currentPage ===
        "profile" && (

        <Profile

          onBack={() =>
            setCurrentPage(
              "home"
            )
          }

        />

      )}


      {/* =================================================
          ADMIN ANALYTICS
          ================================================= */}

      {currentPage === "admin" &&
        currentUser?.role ===
          "ADMIN" &&
        adminSection ===
          "analytics" && (

        <AdminAnalytics

          onBack={() =>
            setAdminSection(
              "dashboard"
            )
          }

        />

      )}


      {/* =================================================
          ADMIN DASHBOARD
          ================================================= */}

      {currentPage === "admin" &&
        currentUser?.role ===
          "ADMIN" &&
        adminSection ===
          "dashboard" && (

        <AdminDashboard

          onBack={() => {

            setAdminSection(
              "dashboard"
            );

            setCurrentPage(
              "home"
            );

          }}

          onSectionChange={
            (section) => {

              setAdminSection(
                section
              );

            }
          }

        />

      )}


      {/* =================================================
          ADMIN USERS
          ================================================= */}

      {currentPage === "admin" &&
        currentUser?.role ===
          "ADMIN" &&
        adminSection ===
          "users" && (

        <AdminUsers

          onBack={() =>
            setAdminSection(
              "dashboard"
            )
          }

        />

      )}


      {/* =================================================
          ADMIN POSTS
          ================================================= */}

      {currentPage === "admin" &&
        currentUser?.role ===
          "ADMIN" &&
        adminSection ===
          "posts" && (

        <AdminPosts

          onBack={() =>
            setAdminSection(
              "dashboard"
            )
          }

        />

      )}


      {/* =================================================
          ADMIN COMMENTS
          ================================================= */}

      {currentPage === "admin" &&
        currentUser?.role ===
          "ADMIN" &&
        adminSection ===
          "comments" && (

        <AdminComments

          onBack={() =>
            setAdminSection(
              "dashboard"
            )
          }

        />

      )}


    </div>

  );

}


export default App;