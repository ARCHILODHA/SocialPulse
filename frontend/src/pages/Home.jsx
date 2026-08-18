import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";

function Home({
  posts,
  loading,
  user,
  userId,
  savedPosts,
  onPostCreated,
  onPostUpdated,
  onPostDeleted,
  onSaveToggle,
}) {
  return (
    <main className="feed-container">

      <CreatePost
        user={user}
        onPostCreated={onPostCreated}
      />

      {loading ? (

        <div className="loading">
          Loading posts...
        </div>

      ) : posts.length === 0 ? (

        <div className="empty">

          <h2>
            No posts yet
          </h2>

          <p>
            Be the first person to
            share something!
          </p>

        </div>

      ) : (

        <div className="posts-list">

          {posts.map((post) => (

            <PostCard
              key={post.id}
              post={post}
              userId={userId}
              savedPosts={savedPosts}
              onPostUpdated={onPostUpdated}
              onPostDeleted={onPostDeleted}
              onSaveToggle={onSaveToggle}
            />

          ))}

        </div>

      )}

    </main>
  );
}

export default Home;