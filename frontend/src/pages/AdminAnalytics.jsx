import { useEffect, useState } from "react";
import api from "../api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function AdminAnalytics({ onBack }) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {

    try {

      const response =
        await api.get("/admin/analytics");

      setData(response.data);

    } catch (error) {

      console.error(
        "Failed to load analytics:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  if (loading) {

    return (
      <div className="admin-section-page">

        <div className="admin-empty">
          Loading analytics...
        </div>

      </div>
    );
  }


  if (!data) {

    return (
      <div className="admin-section-page">

        <div className="admin-empty">
          Unable to load analytics.
        </div>

      </div>
    );
  }


  // =========================================
// COUNTRY DATA
// =========================================

// Merge missing/Unknown locations into India
const countryCounts = {};

Object.entries(data.countryStats || {}).forEach(
  ([name, posts]) => {

    const cleanName =
      name &&
      name.trim() !== "" &&
      name.toLowerCase() !== "unknown"
        ? name.trim()
        : "India";

    countryCounts[cleanName] =
      (countryCounts[cleanName] || 0) +
      Number(posts || 0);
  }
);

const countryData =
  Object.entries(countryCounts).map(
    ([name, posts]) => ({
      name,
      posts,
    })
  );


// =========================================
// STATE DATA
// =========================================

// Merge missing/Unknown locations into Karnataka
const stateCounts = {};

Object.entries(data.stateStats || {}).forEach(
  ([name, posts]) => {

    const cleanName =
      name &&
      name.trim() !== "" &&
      name.toLowerCase() !== "unknown"
        ? name.trim()
        : "Karnataka";

    stateCounts[cleanName] =
      (stateCounts[cleanName] || 0) +
      Number(posts || 0);
  }
);

const stateData =
  Object.entries(stateCounts).map(
    ([name, posts]) => ({
      name,
      posts,
    })
  );

  // =========================================
  // TOP POSTS
  // =========================================

  const topPostData =
    (data.topPosts || []).map(
      (post) => ({
        name:
          post.username || "User",
        likes:
          Number(post.likes || 0),
        comments:
          Number(post.comments || 0),
      })
    );


  // =========================================
  // OVERVIEW CHART
  // =========================================

  const overviewData = [
    {
      name: "Users",
      value: Number(
        data.totalUsers || 0
      ),
    },
    {
      name: "Posts",
      value: Number(
        data.totalPosts || 0
      ),
    },
    {
      name: "Likes",
      value: Number(
        data.totalLikes || 0
      ),
    },
    {
      name: "Comments",
      value: Number(
        data.totalComments || 0
      ),
    },
  ];


  // =========================================
  // PIE DATA
  // =========================================

  const engagementData = [
    {
      name: "Likes",
      value: Number(
        data.totalLikes || 0
      ),
    },
    {
      name: "Comments",
      value: Number(
        data.totalComments || 0
      ),
    },
  ];


  return (
    <div className="admin-section-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="admin-section-header">

        <div>

          <span className="admin-section-label">
            SOCIALPULSE INSIGHTS
          </span>

          <h1>
            Analytics & Trends
          </h1>

          <p>
            Monitor platform growth, engagement and community activity.
          </p>

        </div>


        <button
          className="admin-back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>

      </div>


      {/* =====================================
          OVERVIEW + ENGAGEMENT
      ===================================== */}

      <div className="admin-analytics-columns">

        {/* OVERVIEW */}

        <div className="admin-chart-card">

          <div className="admin-chart-header">

            <div>

              <h2>
                📊 Platform Overview
              </h2>

              <p>
                Overall SocialPulse activity
              </p>

            </div>

          </div>


          <div
            style={{
              width: "100%",
              height: 320,
            }}
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={overviewData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#7c3aed"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* ENGAGEMENT */}

        <div className="admin-chart-card">

          <div className="admin-chart-header">

            <div>

              <h2>
                ❤️ Engagement
              </h2>

              <p>
                Likes vs comments
              </p>

            </div>

          </div>


          <div
            style={{
              width: "100%",
              height: 320,
            }}
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={engagementData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >

                  {engagementData.map(
                    (entry, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "#7c3aed"
                            : "#c084fc"
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* =====================================
          COUNTRY + STATE
      ===================================== */}

      <div className="admin-analytics-columns">

        {/* COUNTRY */}

        <div className="admin-chart-card">

          <div className="admin-chart-header">

            <div>

              <h2>
                🌎 Posts by Country
              </h2>

              <p>
                Geographic activity
              </p>

            </div>

          </div>


          {countryData.length === 0 ? (

            <div className="admin-empty">
              No country data available.
            </div>

          ) : (

            <div
              style={{
                width: "100%",
                height: 320,
              }}
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={countryData}
                  layout="vertical"
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    type="number"
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="posts"
                    fill="#9333ea"
                    radius={[0, 8, 8, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>


        {/* STATE */}

        <div className="admin-chart-card">

          <div className="admin-chart-header">

            <div>

              <h2>
                📍 Posts by State
              </h2>

              <p>
                State-level activity
              </p>

            </div>

          </div>


          {stateData.length === 0 ? (

            <div className="admin-empty">
              No state data available.
            </div>

          ) : (

            <div
              style={{
                width: "100%",
                height: 320,
              }}
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={stateData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="posts"
                    fill="#a855f7"
                    radius={[8, 8, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>

      </div>


      {/* =====================================
          TOP POSTS
      ===================================== */}

      <div className="admin-chart-card">

        <div className="admin-chart-header">

          <div>

            <h2>
              🔥 Top Performing Posts
            </h2>

            <p>
              Likes and comments by top posts
            </p>

          </div>

        </div>


        {topPostData.length === 0 ? (

          <div className="admin-empty">
            No posts available.
          </div>

        ) : (

          <div
            style={{
              width: "100%",
              height: 360,
            }}
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={topPostData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="likes"
                  name="Likes"
                  fill="#7c3aed"
                  radius={[8, 8, 0, 0]}
                />

                <Bar
                  dataKey="comments"
                  name="Comments"
                  fill="#c084fc"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        )}

      </div>


      {/* =====================================
          TREND SUMMARY
      ===================================== */}

      <div className="admin-dashboard-card">

        <div className="admin-card-header">

          <div>

            <h2>
              📈 Trend Summary
            </h2>

            <p>
              Current platform indicators
            </p>

          </div>

        </div>


        <div className="admin-overview-items">

          <div>

            <span>
              Engagement / Post
            </span>

            <strong>
              {data.totalPosts
                ? (
                    data.totalEngagement /
                    data.totalPosts
                  ).toFixed(1)
                : "0"}
            </strong>

          </div>


          <div>

            <span>
              Likes / Post
            </span>

            <strong>
              {data.totalPosts
                ? (
                    data.totalLikes /
                    data.totalPosts
                  ).toFixed(1)
                : "0"}
            </strong>

          </div>


          <div>

            <span>
              Comments / Post
            </span>

            <strong>
              {data.totalPosts
                ? (
                    data.totalComments /
                    data.totalPosts
                  ).toFixed(1)
                : "0"}
            </strong>

          </div>


          <div>

            <span>
              Posts / User
            </span>

            <strong>
              {data.totalUsers
                ? (
                    data.totalPosts /
                    data.totalUsers
                  ).toFixed(1)
                : "0"}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminAnalytics;