import NotificationItem from "../components/NotificationItem";

function Notifications({
  notifications,
  onClear,
}) {

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length;

  return (
    <main className="page-container">

      <div className="page-heading">

        <div>

          <h1>
            Notifications
          </h1>

          <p className="page-subtitle">
            Your recent SocialPulse
            activity.
          </p>

        </div>

        {notifications.length > 0 && (

          <button
            onClick={onClear}
            className="secondary-button"
          >
            Clear All
          </button>

        )}

      </div>

      {unreadCount > 0 && (

        <div className="notification-summary">
          {unreadCount} unread
          notification
          {unreadCount !== 1
            ? "s"
            : ""}
        </div>

      )}

      {notifications.length === 0 ? (

        <div className="empty">

          <h2>
            No notifications
          </h2>

          <p>
            Your activity will
            appear here.
          </p>

        </div>

      ) : (

        <div className="notification-list">

          {notifications.map(
            (notification) => (

              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => {}}
              />

            )
          )}

        </div>

      )}

    </main>
  );
}

export default Notifications;