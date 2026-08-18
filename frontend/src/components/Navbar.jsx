function Navbar({
  currentPage,
  setCurrentPage,
  unreadCount = 0,
  onLogout,
}) {
  return (
    <nav className="navbar">
      <button
        className="logo logo-button"
        onClick={() => setCurrentPage("home")}
      >
        Social<span>Pulse</span>
      </button>

      <div className="nav-links">

        <button
          className={currentPage === "home" ? "active" : ""}
          onClick={() => setCurrentPage("home")}
        >
          🏠 <span>Home</span>
        </button>

        <button
          className={currentPage === "explore" ? "active" : ""}
          onClick={() => setCurrentPage("explore")}
        >
          🔍 <span>Explore</span>
        </button>

        <button
          className={
            currentPage === "notifications"
              ? "active notification-nav"
              : "notification-nav"
          }
          onClick={() => setCurrentPage("notifications")}
        >
          🔔 <span>Notifications</span>

          {unreadCount > 0 && (
            <span className="notification-badge">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        <button
          className={currentPage === "saved" ? "active" : ""}
          onClick={() => setCurrentPage("saved")}
        >
          🔖 <span>Saved</span>
        </button>

        <button
          className={currentPage === "profile" ? "active" : ""}
          onClick={() => setCurrentPage("profile")}
        >
          👤 <span>Profile</span>
        </button>

        <button
          className={currentPage === "settings" ? "active" : ""}
          onClick={() => setCurrentPage("settings")}
        >
          ⚙️ <span>Settings</span>
        </button>

      </div>

      <button
        className="logout-btn"
        onClick={onLogout}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;