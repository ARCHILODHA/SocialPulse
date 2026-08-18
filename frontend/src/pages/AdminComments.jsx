import { useEffect, useState } from "react";
import api from "../api";

function AdminComments({ onBack }) {

  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // =========================================
  // LOAD ALL COMMENTS
  // =========================================

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        "/admin/comments"
      );

      setComments(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load comments:",
        error
      );

      alert(
        error.response?.data ||
        "Failed to load comments"
      );

    } finally {

      setLoading(false);

    }
  };


  // =========================================
  // DELETE COMMENT
  // =========================================

  const deleteComment = async (comment) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setDeleting(comment.id);

      await api.delete(
        `/admin/comments/${comment.id}`
      );

      setComments((currentComments) =>
        currentComments.filter(
          (item) =>
            item.id !== comment.id
        )
      );

    } catch (error) {

      console.error(
        "Failed to delete comment:",
        error
      );

      alert(
        error.response?.data ||
        "Failed to delete comment"
      );

    } finally {

      setDeleting(null);

    }
  };


  // =========================================
  // SEARCH
  // =========================================

  const filteredComments =
    comments.filter((comment) => {

      const searchValue =
        search.toLowerCase().trim();

      if (!searchValue) {
        return true;
      }

      return (
        comment.text
          ?.toLowerCase()
          .includes(searchValue) ||

        comment.username
          ?.toLowerCase()
          .includes(searchValue) ||

        comment.postId
          ?.toLowerCase()
          .includes(searchValue)
      );

    });


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <div className="admin-section-page">

        <div className="admin-section-header">

          <div>
            <span className="admin-section-label">
              CONTENT MODERATION
            </span>

            <h1>
              Comments
            </h1>

            <p>
              Review and moderate SocialPulse comments.
            </p>
          </div>

          <button
            className="admin-back-button"
            onClick={onBack}
          >
            ← Dashboard
          </button>

        </div>

        <div className="admin-empty">
          Loading comments...
        </div>

      </div>
    );
  }


  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="admin-section-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="admin-section-header">

        <div>

          <span className="admin-section-label">
            CONTENT MODERATION
          </span>

          <h1>
            Comments
          </h1>

          <p>
            Review and moderate SocialPulse comments.
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
          TOOLBAR
      ===================================== */}

      <div className="admin-users-toolbar">

        <div className="admin-search">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search comments, users or post ID..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="admin-user-count">

          <strong>
            {filteredComments.length}
          </strong>

          <span>
            comments
          </span>

        </div>

      </div>


      {/* =====================================
          COMMENTS CARD
      ===================================== */}

      <div className="admin-comments-card">

        {filteredComments.length === 0 ? (

          <div className="admin-empty">

            <div
              style={{
                fontSize: "42px",
                marginBottom: "10px"
              }}
            >
              💬
            </div>

            <h3>
              No comments found
            </h3>

            <p>
              There are no comments matching your search.
            </p>

          </div>

        ) : (

          <div className="admin-comments-list">

            {filteredComments.map(
              (comment) => (

                <div
                  className="admin-comment-item"
                  key={comment.id}
                >

                  {/* AVATAR */}

                  <div className="admin-user-avatar">

                    {comment.username
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}

                  </div>


                  {/* COMMENT CONTENT */}

                  <div className="admin-comment-main">

                    <div className="admin-comment-top">

                      <strong>
                        @{comment.username || "user"}
                      </strong>

                      <span>

                        {comment.createdAt
                          ? new Date(
                              comment.createdAt
                            ).toLocaleString()
                          : "Unknown date"}

                      </span>

                    </div>


                    <p>
                      {comment.text || "No comment text"}
                    </p>


                    <small>
                      Post ID:{" "}
                      {comment.postId || "Unknown"}
                    </small>

                  </div>


                  {/* DELETE */}

                  <button
                    className="admin-delete-user"
                    disabled={
                      deleting === comment.id
                    }
                    onClick={() =>
                      deleteComment(comment)
                    }
                  >

                    {deleting === comment.id
                      ? "Deleting..."
                      : "🗑 Delete"}

                  </button>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminComments;
