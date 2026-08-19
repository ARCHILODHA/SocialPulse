import React from "react";
import "./LandingPage.css";

function LandingPage({ onRegister, onLogin }) {
  return (
    <div className="landing-page">

      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="landing-logo">
          Social<span>Pulse</span>
        </div>

        <div className="landing-nav-actions">
          <button className="nav-login" onClick={onLogin}>
            Sign In
          </button>

          <button className="nav-register" onClick={onRegister}>
            Get Started
          </button>
        </div>
      </nav>


      {/* HERO */}
      <main className="landing-hero">

        <div className="hero-content">

          <div className="hero-badge">
            ✦ The social platform built for connection
          </div>

          <h1>
            Connect.
            <br />
            <span>Share.</span>
            <br />
            Engage.
          </h1>

          <p>
            Welcome to SocialPulse — a modern social platform where
            you can share your moments, discover new content,
            connect with people and be part of a growing community.
          </p>

          <div className="hero-buttons">

            <button
              className="hero-primary"
              onClick={onRegister}
            >
              Get Started
              <span>→</span>
            </button>

            <button
              className="hero-secondary"
              onClick={onLogin}
            >
              I already have an account
            </button>

          </div>

          <div className="hero-trust">
            <span>✓</span> Simple
            <span>✓</span> Secure
            <span>✓</span> Connected
          </div>

        </div>


        {/* VISUAL */}
        <div className="hero-visual">

          <div className="floating-card card-one">
            <span>❤️</span>
            <div>
              <strong>Engagement</strong>
              <small>Growing community</small>
            </div>
          </div>

          <div className="phone-card">

            <div className="phone-header">
              <div className="mini-logo">
                Social<span>Pulse</span>
              </div>
              <span>•••</span>
            </div>

            <div className="profile-row">
              <div className="profile-avatar">A</div>

              <div>
                <strong>Welcome to SocialPulse</strong>
                <small>Share your moment</small>
              </div>
            </div>

            <div className="post-preview">
              <div className="post-gradient"></div>

              <h3>
                Your story starts here ✨
              </h3>

              <p>
                Connect with people and share what matters.
              </p>

              <div className="post-actions">
                <span>❤️ 128</span>
                <span>💬 24</span>
                <span>↗ Share</span>
              </div>
            </div>

          </div>

          <div className="floating-card card-two">
            <span>💬</span>
            <div>
              <strong>Connect</strong>
              <small>Meet your community</small>
            </div>
          </div>

        </div>

      </main>


      {/* FEATURES */}
      <section className="landing-features">

        <div className="feature">

          <div className="feature-icon">✦</div>

          <div>
            <h3>Share Your World</h3>

            <p>
              Create posts and share your thoughts,
              moments and experiences.
            </p>
          </div>

        </div>


        <div className="feature">

          <div className="feature-icon">♡</div>

          <div>
            <h3>Build Connections</h3>

            <p>
              Follow people, discover communities
              and stay connected.
            </p>
          </div>

        </div>


        <div className="feature">

          <div className="feature-icon">⚡</div>

          <div>
            <h3>Stay Engaged</h3>

            <p>
              Like, comment, save and interact
              with content you love.
            </p>
          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="landing-footer">
        <div>
          © {new Date().getFullYear()} SocialPulse
        </div>

        <div>
          Connect. Share. Engage.
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;