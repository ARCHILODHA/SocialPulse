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


  // =========================================
  // LIKE STATUS
  // =========================================

  const isLiked =
    post.likedBy?.some(
      (id) =>
        String(id) === String(userId)
    );


  // =========================================
  // SAVE STATUS
  // =========================================

  const isSaved =
    savedPosts.some(
      (id) =>
        String(id) === String(post.id)
    );


  // =========================================
  // MEDIA URL
  // =========================================

  /*
   * Backend Post.java uses:
   *
   * imageUrl
   * mediaType
   *
   * Example:
   *
   * /uploads/abc123.jpg
   * /uploads/xyz789.mp4
   */

  const getMediaUrl = () => {

    const url =
      post.imageUrl ||
      post.mediaUrl ||
      post.fileUrl ||
      post.media ||
      null;

    if (!url) {
      return null;
    }

    /*
     * If backend returns:
     *
     * /uploads/file.jpg
     *
     * convert it to:
     *
     * http://localhost:8080/uploads/file.jpg
     */

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    if (url.startsWith("/")) {
      return `http://localhost:8080${url}`;
    }

    return `http://localhost:8080/${url}`;
  };


  const mediaUrl =
    getMediaUrl();


  // =========================================
  // MEDIA TYPE
  // =========================================

  const mediaType =
    String(
      post.mediaType ||
      post.type ||
      ""
    ).toUpperCase();


  // =========================================
  // VIDEO DETECTION
  // =========================================

  const isVideo =
    mediaType === "VIDEO" ||
    mediaUrl?.match(
      /\.(mp4|webm|ogg|mov|m4v)$/i
    );


  // =========================================
  // LIKE
  // =========================================

  const handleLike = async () => {

    if (liking) {
      return;
    }

    try {

      setLiking(true);

      const response =
        await api.post(
          `/posts/${post.id}/like`
        );

      if (onPostUpdated) {

        onPostUpdated(
          response.data
        );

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

        alert(
          "Please login again."
        );

      }

    } finally {

      setLiking(false);

    }
  };


  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (
      !confirmed ||
      deleting
    ) {
      return;
    }

    try {

      setDeleting(true);

      await api.delete(
        `/posts/${post.id}`
      );

      if (onPostDeleted) {

        onPostDeleted(
          post.id
        );

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


  // =========================================
  // SHARE
  // =========================================

  const handleShare = async () => {

    const url =
      `${window.location.origin}/posts/${post.id}`;

    try {

      await navigator.clipboard.writeText(
        url
      );

      alert(
        "Post link copied!"
      );

    } catch (error) {

      console.error(
        "Failed to copy link:",
        error
      );

      alert(url);
    }
  };


  // =========================================
  // AVATAR
  // =========================================

  const avatar =
    post.username
      ?.charAt(0)
      ?.toUpperCase() ||
    "U";


  // =========================================
  // RENDER
  // =========================================

  return (

    <article className="post-card">


      {/* =====================================
          HEADER
          ===================================== */}

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


      {/* =====================================
          CAPTION
          ===================================== */}

      {post.caption && (

        <div className="post-content">
          {post.caption}
        </div>

      )}


      {/* =====================================
          IMAGE / VIDEO
          ===================================== */}

      {mediaUrl && (

        <div className="post-media">


          {/* VIDEO */}

          {isVideo ? (

            <video
              className="post-video"
              src={mediaUrl}
              controls
              playsInline
              preload="metadata"
              onError={(e) => {
                console.error(
                  "Video failed to load:",
                  mediaUrl
                );
              }}
            />

          ) : (

            /* IMAGE */

            <img
              className="post-image"
              src={mediaUrl}
              alt="Post"
              loading="lazy"
              onError={(e) => {
                console.error(
                  "Image failed to load:",
                  mediaUrl
                );
              }}
            />

          )}

        </div>

      )}


      {/* =====================================
          ACTIONS
          ===================================== */}

      <div className="post-footer">


        {/* LIKE */}

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


        {/* COMMENT */}

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


        {/* SHARE */}

        <button
          onClick={handleShare}
          className="post-action"
        >

          ↗ Share

        </button>


        {/* SAVE */}

        <button
          onClick={() =>
            onSaveToggle?.(
              post.id
            )
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


        {/* DELETE */}

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


      {/* =====================================
          COMMENTS
          ===================================== */}

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