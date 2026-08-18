import { useEffect, useState } from "react";
import api from "../api";

function AdminPosts({ onBack }) {

  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/admin/posts");

      setPosts(response.data);

    } catch (error) {

      console.error(
        "Failed to load admin posts:",
        error
      );

      alert(
        error.response?.data ||
        "Failed to load posts"
      );

    } finally {

      setLoading(false);

    }
  };


  const deletePost = async (post) => {

    const confirmed =
      window.confirm(
        "Delete this post permanently?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeleting(post.id);

      await api.delete(
        `/admin/posts/${post.id}`
      );

      setPosts(current =>
        current.filter(
          item =>
            item.id !== post.id
        )
      );

    } catch (error) {

      alert(
        error.response?.data ||
        "Failed to delete post"
      );

    } finally {

      setDeleting(null);

    }
  };


  const filteredPosts =
    posts.filter(post => {

      const value =
        search.toLowerCase();

      return (
        post.username
          ?.toLowerCase()
          .includes(value) ||

        post.caption
          ?.toLowerCase()
          .includes(value)
      );

    });


  if (loading) {

    return (
      <div className="admin-section-page">

        <div className="admin-section-loading">
          Loading posts...
        </div>

      </div>
    );
  }


  return (
    <div className="admin-section-page">

      {/* HEADER */}

      <div className="admin-section-header">

        <div>

          <span className="admin-section-label">
            CONTENT MANAGEMENT
          </span>

          <h1>
            Posts
          </h1>

          <p>
            Review and manage all SocialPulse posts.
          </p>

        </div>

        <button
          className="admin-back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>

      </div>


      {/* TOOLBAR */}

      <div className="admin-users-toolbar">

        <div className="admin-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search by username or caption..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="admin-user-count">

          <strong>
            {filteredPosts.length}
          </strong>

          <span>
            posts
          </span>

        </div>

      </div>


      {/* POSTS */}

      <div className="admin-posts-grid">

        {filteredPosts.length === 0 ? (

          <div className="admin-empty">
            No posts found.
          </div>

        ) : (

          filteredPosts.map(post => (

            <article
              className="admin-post-card"
              key={post.id}
            >

              {/* MEDIA */}

              {post.imageUrl && (

                <div className="admin-post-media">

                  {post.mediaType === "VIDEO" ? (

                    <video
                      src={`http://localhost:8080${post.imageUrl}`}
                      controls
                    />

                  ) : (

                    <img
                      src={`http://localhost:8080${post.imageUrl}`}
                      alt="Post"
                    />

                  )}

                </div>

              )}


              {/* CONTENT */}

              <div className="admin-post-content">

                <div className="admin-post-author">

                  <div className="admin-user-avatar">
                    {post.username
                      ?.charAt(0)
                      ?.toUpperCase() ||
                      "U"}
                  </div>

                  <strong>
                    @{post.username}
                  </strong>

                </div>


                <p className="admin-post-caption">
                  {post.caption ||
                    "No caption"}
                </p>


                <div className="admin-post-meta">

                  <span>
                    ❤️ {post.likesCount || 0}
                  </span>

                  <span>
                    💬 {post.commentsCount || 0}
                  </span>

                  <span>
                    {post.mediaType || "TEXT"}
                  </span>

                </div>


                <div className="admin-post-footer">

                  <span>
                    {post.createdAt
                      ? new Date(
                          post.createdAt
                        ).toLocaleDateString()
                      : ""}
                  </span>

                  <button
                    className="admin-delete-user"
                    disabled={
                      deleting === post.id
                    }
                    onClick={() =>
                      deletePost(post)
                    }
                  >
                    {deleting === post.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            </article>

          ))

        )}

      </div>

    </div>
  );
}

export default AdminPosts;