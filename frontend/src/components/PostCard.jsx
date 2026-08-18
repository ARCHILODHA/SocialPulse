import { useState } from "react";
import api from "../api";
import CommentSection from "./CommentSection";

function PostCard({
  post,
  userId,
  savedPosts = [],
  onPostUpdated,
  onPostDeleted,
  onSaveToggle,
}) {
  const [showComments, setShowComments] =
    useState(false);

  const [liking, setLiking] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const isLiked =
    post.likedBy?.some(
      (id) => String(id) === String(userId)
    );

  const isSaved =
    savedPosts.some(
      (id) => String(id) === String(post.id)
    );

  const handleLike = async () => {

    if (liking) return;

    try {

      setLiking(true);

      const response =
        await api.post(
          `/posts/${post.id}/like`
        );

      if (onPostUpdated) {
        onPostUpdated(response.data);
      }

    } catch (error) {

      console.error(
        "Failed to like/unlike post:",
        error
      );

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        alert("Please login again.");
      }

    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmed || deleting) {
      return;
    }

    try {

      setDeleting(true);

      await api.delete(
        `/posts/${post.id}`
      );

      if (onPostDeleted) {
        onPostDeleted(post.id);
      }

    } catch (error) {

      console.error(
        "Failed to delete post:",
        error
      );

      alert(
        error.response?.data ||
        "Failed to delete post"
      );

    } finally {
      setDeleting(false);
    }
  };

  const handleShare = async () => {

    const url =
      `${window.location.origin}/posts/${post.id}`;

    try {

      await navigator.clipboard.writeText(url);

      alert("Post link copied!");

    } catch (error) {

      console.error(
        "Failed to copy link:",
        error
      );

      alert(url);
    }
  };

  const avatar =
    post.username
      ?.charAt(0)
      ?.toUpperCase() || "U";

  const mediaUrl =
    post.mediaUrl ||
    post.fileUrl ||
    post.media;

  const mediaType =
    post.mediaType ||
    post.type ||
    "";

  const isVideo =
    mediaType === "VIDEO" ||
    mediaType === "video" ||
    mediaUrl?.match(
      /\.(mp4|webm|ogg|mov)$/i
    );

  return (
    <article className="post-card">

      {/* HEADER */}

      <div className="post-header">

        <div className="avatar">
          {avatar}
        </div>

        <div className="post-author">

          <h3>
            {post.username || "User"}
          </h3>

          <span>
            {post.createdAt
              ? new Date(
                  post.createdAt
                ).toLocaleString()
              : "Just now"}
          </span>

        </div>

      </div>

      {/* CAPTION */}

      {post.caption && (
        <div className="post-content">
          {post.caption}
        </div>
      )}

      {/* MEDIA */}

      {mediaUrl && (
        <div className="post-media">

          {isVideo ? (

            <video
              className="post-video"
              src={mediaUrl}
              controls
              preload="metadata"
            />

          ) : (

            <img
              className="post-image"
              src={mediaUrl}
              alt="Post media"
            />

          )}

        </div>
      )}

      {/* ACTIONS */}

      <div className="post-footer">

        <button
          onClick={handleLike}
          disabled={liking}
          className={
            isLiked
              ? "post-action liked"
              : "post-action"
          }
        >
          ❤️{" "}
          {isLiked
            ? "Unlike"
            : "Like"}{" "}
          {post.likesCount || 0}
        </button>

        <button
          onClick={() =>
            setShowComments(
              (current) => !current
            )
          }
          className="post-action"
        >
          💬 Comment{" "}
          {post.commentsCount || 0}
        </button>

        <button
          onClick={handleShare}
          className="post-action"
        >
          ↗ Share
        </button>

        <button
          onClick={() =>
            onSaveToggle?.(post.id)
          }
          className={
            isSaved
              ? "post-action saved"
              : "post-action"
          }
        >
          🔖{" "}
          {isSaved
            ? "Saved"
            : "Save"}
        </button>

        {String(post.userId) ===
          String(userId) && (

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="post-action delete-btn"
          >
            🗑️{" "}
            {deleting
              ? "Deleting..."
              : "Delete"}
          </button>

        )}

      </div>

      {/* COMMENTS */}

      {showComments && (
        <CommentSection
          postId={post.id}
          onCommentAdded={() =>
            onPostUpdated?.({
              ...post,
              commentsCount:
                (post.commentsCount || 0) + 1,
            })
          }
        />
      )}

    </article>
  );
}

export default PostCard;