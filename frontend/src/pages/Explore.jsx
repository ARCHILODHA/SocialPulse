import { useMemo, useState } from "react";
import PostCard from "../components/PostCard";
import UserCard from "../components/UserCard";

function Explore({
  posts,
  userId,
  savedPosts,
  onPostUpdated,
  onPostDeleted,
  onSaveToggle,
}) {

  const [search, setSearch] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("posts");

  const filteredPosts =
    useMemo(() => {

      const value =
        search
          .trim()
          .toLowerCase();

      if (!value) {
        return posts;
      }

      return posts.filter((post) => {

        const caption =
          post.caption
            ?.toLowerCase() || "";

        const username =
          post.username
            ?.toLowerCase() || "";

        return (
          caption.includes(value) ||
          username.includes(value)
        );
      });

    }, [posts, search]);

  const matchingUsers =
    useMemo(() => {

      const map =
        new Map();

      posts.forEach((post) => {

        if (!post.username) {
          return;
        }

        const username =
          post.username.toLowerCase();

        if (
          !search.trim() ||
          username.includes(
            search.toLowerCase()
          )
        ) {

          if (!map.has(username)) {

            map.set(
              username,
              {
                id: post.userId,
                username:
                  post.username,
              }
            );

          }
        }

      });

      return Array.from(
        map.values()
      );

    }, [posts, search]);

  return (
    <main className="page-container">

      <h1>
        Explore
      </h1>

      <p className="page-subtitle">
        Discover posts and people
        on SocialPulse.
      </p>

      <input
        className="search-input"
        placeholder="Search posts or usernames..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="explore-tabs">

        <button
          className={
            activeTab === "posts"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("posts")
          }
        >
          Posts
        </button>

        <button
          className={
            activeTab === "people"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("people")
          }
        >
          People
        </button>

      </div>

      {activeTab === "posts" ? (

        <div className="explore-results">

          {filteredPosts.length === 0 ? (

            <div className="empty">
              <h2>
                No results found
              </h2>

              <p>
                Try another search.
              </p>
            </div>

          ) : (

            filteredPosts.map((post) => (

              <PostCard
                key={post.id}
                post={post}
                userId={userId}
                savedPosts={savedPosts}
                onPostUpdated={onPostUpdated}
                onPostDeleted={onPostDeleted}
                onSaveToggle={onSaveToggle}
              />

            ))

          )}

        </div>

      ) : (

        <div className="user-results">

          {matchingUsers.length === 0 ? (

            <div className="empty">
              <h2>
                No people found
              </h2>

              <p>
                Try another username.
              </p>
            </div>

          ) : (

            matchingUsers.map((user) => (

              <UserCard
                key={user.username}
                user={user}
                onOpenProfile={() => {}}
              />

            ))

          )}

        </div>

      )}

    </main>
  );
}

export default Explore;