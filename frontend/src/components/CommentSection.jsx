import { useEffect, useState } from "react";
import api from "../api";

function CommentSection({ postId, onCommentAdded }) {

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/posts/${postId}/comments`
      );

      setComments(response.data || []);

    } catch (error) {
      console.error(
        "Failed to load comments:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {

    const value = text.trim();

    if (!value) return;

    try {

      setSending(true);

      await api.post(
        `/posts/${postId}/comments`,
        {
          content: value,
        }
      );

      setText("");

      await loadComments();

      if (onCommentAdded) {
        onCommentAdded();
      }

    } catch (error) {

      console.error(
        "Failed to add comment:",
        error
      );

      alert(
        error.response?.data ||
        "Failed to add comment"
      );

    } finally {
      setSending(false);
    }
  };

  return (
    <div className="comments-section">

      <div className="comment-input">

        <input
          type="text"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addComment();
            }
          }}
        />

        <button
          onClick={addComment}
          disabled={sending}
        >
          {sending ? "..." : "Send"}
        </button>

      </div>

      {loading ? (

        <p className="comments-loading">
          Loading comments...
        </p>

      ) : comments.length === 0 ? (

        <p className="no-comments">
          No comments yet. Be the first!
        </p>

      ) : (

        <div className="comments-list">

          {comments.map((comment) => (

            <div
              className="comment"
              key={comment.id}
            >

              <div className="comment-avatar">
                {comment.username
                  ? comment.username
                      .charAt(0)
                      .toUpperCase()
                  : "U"}
              </div>

              <div className="comment-body">

                <strong>
                  {comment.username || "User"}
                </strong>

                <p>
                  {comment.content}
                </p>

                {comment.createdAt && (
                  <small>
                    {new Date(
                      comment.createdAt
                    ).toLocaleString()}
                  </small>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default CommentSection;