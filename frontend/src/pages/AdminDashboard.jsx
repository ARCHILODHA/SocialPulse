import { useEffect, useState } from "react";
import api from "../api";
import "./AdminDashboard.css";

function AdminDashboard({ onSectionChange }) {

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

    try {

      const response =
        await api.get("/admin/analytics");

      setAnalytics(response.data);

    } catch (error) {

      console.error(
        "Failed to load dashboard:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  if (loading) {

    return (
      <div className="admin-dashboard">

        <div className="admin-loading">
          Loading dashboard...
        </div>

      </div>
    );
  }


  // =========================================
  // COUNTRY DATA
  // Merge Unknown / blank locations into India
  // =========================================

  const countryCounts = {};

  Object.entries(
    analytics?.countryStats || {}
  ).forEach(([name, posts]) => {

    const cleanName =
      name &&
      name.trim() !== "" &&
      name.toLowerCase() !== "unknown"
        ? name.trim()
        : "India";

    countryCounts[cleanName] =
      (countryCounts[cleanName] || 0) +
      Number(posts || 0);

  });


  // =========================================
  // TOP COUNTRY
  // =========================================

  const topCountry =
    Object.entries(countryCounts)
      .sort(
        ([, a], [, b]) =>
          Number(b) - Number(a)
      )[0] || null;


  // =========================================
  // TOP POST
  // =========================================

  const topPost =
    analytics?.topPosts?.length
      ? analytics.topPosts[0]
      : null;


  return (
    <div className="admin-dashboard">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="admin-dashboard-header">

        <div>

          <span className="admin-dashboard-label">
            SOCIALPULSE ADMIN
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Monitor your platform activity and community trends.
          </p>

        </div>


        <div className="admin-dashboard-actions">

          <button
            onClick={() =>
              onSectionChange("analytics")
            }
          >
            📊 View Analytics
          </button>

        </div>

      </div>


      {/* =====================================
          MAIN GRID
      ===================================== */}

      <div className="admin-dashboard-grid">


        {/* =================================
            PLATFORM OVERVIEW
        ================================= */}

        <div className="admin-dashboard-card admin-overview-card">

          <div className="admin-card-header">

            <div>

              <h2>
                📈 Platform Overview
              </h2>

              <p>
                Current SocialPulse activity
              </p>

            </div>

            <button
              onClick={() =>
                onSectionChange("analytics")
              }
            >
              View →
            </button>

          </div>


          <div className="admin-overview-items">

            <div>

              <span>
                Users
              </span>

              <strong>
                {analytics?.totalUsers || 0}
              </strong>

            </div>


            <div>

              <span>
                Posts
              </span>

              <strong>
                {analytics?.totalPosts || 0}
              </strong>

            </div>


            <div>

              <span>
                Likes
              </span>

              <strong>
                {analytics?.totalLikes || 0}
              </strong>

            </div>


            <div>

              <span>
                Comments
              </span>

              <strong>
                {analytics?.totalComments || 0}
              </strong>

            </div>

          </div>


          {/* ACTIVITY BAR */}

          <div className="admin-activity-chart">

            <div className="activity-bar">

              <span
                style={{
                  height: `${Math.min(
                    100,
                    (analytics?.totalUsers || 0) * 10
                  )}%`
                }}
              />

            </div>


            <div className="activity-bar">

              <span
                style={{
                  height: `${Math.min(
                    100,
                    (analytics?.totalPosts || 0) * 10
                  )}%`
                }}
              />

            </div>


            <div className="activity-bar">

              <span
                style={{
                  height: `${Math.min(
                    100,
                    (analytics?.totalLikes || 0) * 10
                  )}%`
                }}
              />

            </div>


            <div className="activity-bar">

              <span
                style={{
                  height: `${Math.min(
                    100,
                    (analytics?.totalComments || 0) * 10
                  )}%`
                }}
              />

            </div>


            <div className="activity-bar">

              <span
                style={{
                  height: `${Math.min(
                    100,
                    (analytics?.totalEngagement || 0) * 10
                  )}%`
                }}
              />

            </div>

          </div>

        </div>


        {/* =================================
            TOP LOCATION
        ================================= */}

        <div className="admin-dashboard-card">

          <div className="admin-card-header">

            <div>

              <h2>
                🌎 Top Location
              </h2>

              <p>
                Most active country
              </p>

            </div>

          </div>


          {topCountry ? (

            <div className="admin-highlight">

              <div className="admin-highlight-icon">
                🌎
              </div>

              <div>

                <strong>
                  {topCountry[0]}
                </strong>

                <span>
                  {topCountry[1]} posts
                </span>

              </div>

            </div>

          ) : (

            <div className="admin-empty-small">
              No location data yet.
            </div>

          )}

        </div>


        {/* =================================
            TOP POST
        ================================= */}

        <div className="admin-dashboard-card">

          <div className="admin-card-header">

            <div>

              <h2>
                🏆 Top Post
              </h2>

              <p>
                Highest engagement
              </p>

            </div>

            <button
              onClick={() =>
                onSectionChange("posts")
              }
            >
              View →
            </button>

          </div>


          {topPost ? (

            <div className="admin-top-dashboard-post">

              <strong>
                @{topPost.username}
              </strong>

              <p>
                {topPost.caption ||
                  "No caption"}
              </p>

              <div>

                <span>
                  ❤️ {topPost.likes}
                </span>

                <span>
                  💬 {topPost.comments}
                </span>

              </div>

            </div>

          ) : (

            <div className="admin-empty-small">
              No posts yet.
            </div>

          )}

        </div>

      </div>


      {/* =====================================
          QUICK MANAGEMENT
      ===================================== */}

      <div className="admin-dashboard-card admin-quick-card">

        <div className="admin-card-header">

          <div>

            <h2>
              ⚡ Quick Management
            </h2>

            <p>
              Manage your SocialPulse platform
            </p>

          </div>

        </div>


        <div className="admin-quick-grid">


          {/* USERS */}

          <button
            onClick={() =>
              onSectionChange("users")
            }
          >

            <span>
              👥
            </span>

            <strong>
              Users
            </strong>

            <small>
              Manage users
            </small>

          </button>


          {/* POSTS */}

          <button
            onClick={() =>
              onSectionChange("posts")
            }
          >

            <span>
              📝
            </span>

            <strong>
              Posts
            </strong>

            <small>
              Moderate posts
            </small>

          </button>


          {/* COMMENTS */}

          <button
            onClick={() =>
              onSectionChange("comments")
            }
          >

            <span>
              💬
            </span>

            <strong>
              Comments
            </strong>

            <small>
              Moderate comments
            </small>

          </button>


          {/* ANALYTICS */}

          <button
            onClick={() =>
              onSectionChange("analytics")
            }
          >

            <span>
              📊
            </span>

            <strong>
              Analytics
            </strong>

            <small>
              View trends
            </small>

          </button>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;