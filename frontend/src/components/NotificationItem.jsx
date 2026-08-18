function NotificationItem({
  notification,
  onClick,
}) {

  const icons = {
    LIKE: "❤️",
    COMMENT: "💬",
    FOLLOW: "👤",
    SAVE: "🔖",
    SYSTEM: "✨",
    like: "❤️",
    comment: "💬",
    follow: "👤",
  };

  const icon =
    icons[notification.type] || "🔔";

  return (
    <button
      className={`notification-card ${
        notification.read
          ? "notification-read"
          : "notification-unread"
      }`}
      onClick={() =>
        onClick?.(notification)
      }
    >

      <div className="notification-icon">
        {icon}
      </div>

      <div className="notification-content">

        <strong>
          {notification.message ||
            "You have a new notification"}
        </strong>

        <small>
          {notification.createdAt
            ? new Date(
                notification.createdAt
              ).toLocaleString()
            : "Just now"}
        </small>

      </div>

      {!notification.read && (
        <span className="notification-dot" />
      )}

    </button>
  );
}

export default NotificationItem;