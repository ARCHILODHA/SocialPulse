
# 🚀 SocialPulse

### Full-Stack Social Media Platform with Analytics & Admin Intelligence

SocialPulse is a modern full-stack social media platform designed to provide users with an engaging space to connect, share content, interact with posts, and manage their profiles.

The platform also includes a dedicated **Admin Intelligence Dashboard** for monitoring users, posts, comments, engagement, and overall platform activity.

---

## 🌐 Overview

SocialPulse combines a modern React frontend with a Spring Boot backend and MongoDB database to deliver a complete social networking experience.

### 👤 User Side

Users can:

- 🔐 Register and securely log in
- 🏠 View their personalized home feed
- 📝 Create posts
- ❤️ Like posts
- 💬 Comment on posts
- 🔄 Share content
- 🔖 Save posts
- 👥 Follow users
- 🔔 Receive notifications
- 👤 Manage their profile
- ⚙️ Manage application settings
- 🔎 Explore content and users

### 🛡️ Admin Side

Administrators have access to a dedicated dashboard that provides:

- 👥 User management
- 📝 Post management
- 💬 Comment moderation
- 📊 Platform analytics
- ❤️ Engagement statistics
- 🔥 Engagement tracking
- 📈 Platform activity overview
- 🏆 Top-performing posts
- 🌍 Activity insights

---

# ✨ Key Features

## 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using BCrypt
- Role-based access control
- Separate ADMIN and USER roles
- Protected admin routes

---

## 🏠 Social Feed

The home feed allows users to interact with the SocialPulse community.

Users can:

- Create posts
- View posts
- Like posts
- Comment
- Share
- Save posts
- Delete their own posts

---

## 👤 User Profiles

Each user has a profile containing:

- Name
- Username
- Email
- Profile information
- Followers
- Following
- User posts

---

## 👥 Follow System

SocialPulse includes a follow system allowing users to:

- Follow other users
- Unfollow users
- View followers
- View following
- Build their own social network

---

## 🔔 Notifications

Users can receive notifications for relevant platform activities such as:

- Likes
- Comments
- Follows
- Other user interactions

---

# 📊 Admin Intelligence Dashboard

The admin dashboard provides a centralized view of platform activity.

### Dashboard Metrics

The dashboard displays:

| Metric | Description |
|---|---|
| 👥 Users | Total registered users |
| 📝 Posts | Total platform posts |
| ❤️ Likes | Total likes |
| 💬 Comments | Total comments |
| 🔥 Engagement | Overall engagement |
| 📈 Activity | Platform activity trends |

### Admin Modules

- **Users** — Manage registered users
- **Posts** — Moderate platform posts
- **Comments** — Manage comments
- **Analytics** — Analyze platform activity

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      SocialPulse     │
                    │      Frontend        │
                    │      React + Vite    │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │      Spring Boot     │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Authentication      Services       Repositories
          JWT + BCrypt       Business        Data Access
                             Logic
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    │       Database        │
                    └──────────────────────┘
