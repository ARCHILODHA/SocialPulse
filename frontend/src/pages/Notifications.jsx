import NotificationItem from "../components/NotificationItem";

function Notifications({
  notifications = [],
  onClear,
  onMarkAllRead,
}) {

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length;


  return (
    <main className="page-container">

      {/* ================================
          HEADER
          ================================= */}

      <div className="page-heading">

        <div>

          <h1>
            Notifications
          </h1>

          <p className="page-subtitle">
            Your recent SocialPulse activity.
          </p>

        </div>


        {/* ACTIONS */}

        {notifications.length > 0 && (

          <div
            style={{
              display: "flex",
              gap: "10px"
            }}
          >

            {unreadCount > 0 && (

              <button
                onClick={onMarkAllRead}
                className="secondary-button"
              >
                Mark all as read
              </button>

            )}

            <button
              onClick={onClear}
              className="secondary-button"
            >
              Clear All
            </button>

          </div>

        )}

      </div>


      {/* ================================
          UNREAD SUMMARY
          ================================= */}

      {unreadCount > 0 && (

        <div className="notification-summary">

          {unreadCount} unread notification
          {unreadCount !== 1 ? "s" : ""}

        </div>

      )}


      {/* ================================
          EMPTY STATE
          ================================= */}

      {notifications.length === 0 ? (

        <div className="empty">

          <h2>
            No notifications
          </h2>

          <p>
            Your activity will appear here.
          </p>

        </div>

      ) : (

        /* ================================
           NOTIFICATION LIST
           ================================= */

        <div className="notification-list">

          {notifications.map(
            (notification) => (

              <NotificationItem
                key={
                  notification.id ||
                  notification._id
                }
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