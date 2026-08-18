import { useEffect, useState } from "react";
import api from "../api";

function UserCard({
  user,
  onOpenProfile,
}) {

  const [following, setFollowing] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadFollowStatus();
  }, [user?.id]);

  const loadFollowStatus = async () => {

    if (!user?.id) return;

    try {

      const response =
        await api.get(
          `/follows/${user.id}/status`
        );

      setFollowing(
        Boolean(response.data)
      );

    } catch (error) {

      console.error(
        "Failed to load follow status:",
        error
      );

    }
  };

  const toggleFollow = async (e) => {

    e.stopPropagation();

    if (!user?.id || loading) return;

    try {

      setLoading(true);

      const response =
        await api.post(
          `/follows/${user.id}`
        );

      setFollowing(
        Boolean(response.data)
      );

    } catch (error) {

      console.error(
        "Failed to follow user:",
        error
      );

      alert(
        error.response?.data ||
        "Failed to update follow"
      );

    } finally {
      setLoading(false);
    }
  };

  const avatar =
    user?.name?.charAt(0)?.toUpperCase() ||
    user?.username?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div
      className="user-card"
      onClick={() =>
        onOpenProfile?.(user.id)
      }
    >

      <div className="user-card-avatar">
        {user?.profileImage ? (
          <img
            src={
              user.profileImage.startsWith("http")
                ? user.profileImage
                : `http://localhost:8080${user.profileImage}`
            }
            alt=""
          />
        ) : (
          avatar
        )}
      </div>

      <div className="user-card-info">

        <strong>
          {user?.name || "User"}
        </strong>

        <span>
          @{user?.username || "username"}
        </span>

        {user?.bio && (
          <p>
            {user.bio}
          </p>
        )}

      </div>

      <button
        className={
          following
            ? "following-button"
            : "follow-button"
        }
        onClick={toggleFollow}
        disabled={loading}
      >
        {loading
          ? "..."
          : following
            ? "Following"
            : "Follow"}
      </button>

    </div>
  );
}

export default UserCard;