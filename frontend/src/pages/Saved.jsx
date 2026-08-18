import PostCard from "../components/PostCard";

function Saved({
  posts,
  userId,
  savedPosts,
  onPostUpdated,
  onPostDeleted,
  onSaveToggle,
}) {

  const savedPostObjects =
    posts.filter((post) =>
      savedPosts.some(
        (id) =>
          String(id) ===
          String(post.id)
      )
    );

  return (
    <main className="page-container">

      <div className="page-heading">

        <div>

          <h1>
            Saved Posts
          </h1>

          <p className="page-subtitle">
            Posts you've saved
            for later.
          </p>

        </div>

        <span className="saved-count">
          {savedPostObjects.length}
        </span>

      </div>

      {savedPostObjects.length === 0 ? (

        <div className="empty">

          <h2>
            No saved posts
          </h2>

          <p>
            Save posts from your
            feed to find them here.
          </p>

        </div>

      ) : (

        <div className="posts-list">

          {savedPostObjects.map(
            (post) => (

              <PostCard
                key={post.id}
                post={post}
                userId={userId}
                savedPosts={savedPosts}
                onPostUpdated={onPostUpdated}
                onPostDeleted={onPostDeleted}
                onSaveToggle={onSaveToggle}
              />

            )
          )}

        </div>

      )}

    </main>
  );
}

export default Saved;