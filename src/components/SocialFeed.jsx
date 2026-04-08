import { useState, useEffect } from 'react'
import './SocialFeed.css'

const SocialFeed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch posts, users, and comments all at the same time
        const [postsRes, usersRes, commentsRes] = await Promise.all([
          fetch('https://jsonplaceholder.typicode.com/posts'),
          fetch('https://jsonplaceholder.typicode.com/users'),
          fetch('https://jsonplaceholder.typicode.com/comments'),
        ])

        if (!postsRes.ok || !usersRes.ok || !commentsRes.ok) {
          throw new Error('Something went wrong. Could not fetch data.')
        }

        const postsData = await postsRes.json()
        const usersData = await usersRes.json()
        const commentsData = await commentsRes.json()

        // Link each post to its author and up to 2 comments
        const combined = postsData.slice(0, 10).map((post) => {
          const author = usersData.find((u) => u.id === post.userId) || {
            name: 'Unknown',
            username: 'unknown',
          }
          const comments = commentsData
            .filter((c) => c.postId === post.id)
            .slice(0, 2)

          return { ...post, author, comments }
        })

        setPosts(combined)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="feed-message">
        <div className="spinner" />
        <p>Loading posts…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="feed-message">
        <p className="error-text">Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try again</button>
      </div>
    )
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <article key={post.id} className="card">

          {/* Author */}
          <div className="card-author">
            <div className="avatar">{post.author.name.charAt(0)}</div>
            <div>
              <p className="author-name">{post.author.name}</p>
              <p className="author-handle">@{post.author.username.toLowerCase()}</p>
            </div>
          </div>

          {/* Post content */}
          <div className="card-body">
            <h2 className="post-title">{post.title}</h2>
            <p className="post-body">{post.body}</p>
          </div>

          {/* Comments */}
          <div className="card-comments">
            <p className="comments-label">Comments ({post.comments.length})</p>
            {post.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <span className="comment-author">
                  {comment.email.split('@')[0]}
                </span>
                <p className="comment-text">{comment.body}</p>
              </div>
            ))}
          </div>

        </article>
      ))}
    </div>
  )
}

export default SocialFeed
