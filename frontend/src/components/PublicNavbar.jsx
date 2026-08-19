import React from "react";

function PublicNavbar({ onLogin, onRegister }) {
  return (
    <nav className="public-navbar">

      {/* LOGO */}
      <div
        className="public-navbar-logo"
        onClick={() => window.location.reload()}
      >
        Social<span>Pulse</span>
      </div>


      {/* RIGHT SIDE */}
      <div className="public-navbar-actions">

        <button
          className="public-nav-login"
          onClick={onLogin}
        >
          Login
        </button>

        <button
          className="public-nav-register"
          onClick={onRegister}
        >
          Create Account
        </button>

      </div>

    </nav>
  );
}

export default PublicNavbar;