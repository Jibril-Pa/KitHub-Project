import React, { useState, useEffect } from 'react';
import { FaCat } from 'react-icons/fa';
import './Home.css';
import Navbar from '/src/layout/Navbar';
import CreatePost from './Createpost';

const Home = ({ setIsLoggedIn, isLoggedIn }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});
    useEffect(() => {
        document.title = "KitHub | Home";
    }, []);
    const handleDeletePost = async (postId) => {
        try {
          const response = await fetch(`http://192.168.7.82:7777/api/posts/${postId}`, {
            method: 'DELETE',
          });
          if (!response.ok) throw new Error('Failed to delete post');
          // Remove the post from the UI after successful deletion
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
          console.error(error);
          alert('Error deleting post.');
        }
      };
    const handleCommentChange = (postId, value) => {
        setCommentInputs((prev) => ({ ...prev, [postId]: value }));
      };

      const handleAddComment = (postId) => {
        const text = commentInputs[postId];
        if (!text || text.trim() === "") return;
      
        const newComment = {
          id: Date.now(), // simple unique ID
          userId: 999,    // mock user ID
          text,
          createdAt: new Date().toISOString(),
        };
      
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? { ...post, comments: [...post.comments, newComment] }
              : post
          )
        );
      
        // Clear input after adding comment
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      };
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://192.168.7.82:7777/api/posts');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                const normalizedPosts = data.map(post => ({
                    ...post,
                    comments: Array.isArray(post.comments) ? post.comments : [],
                }));
    
                setPosts(normalizedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);
    
    const handleCreatePost = async (formData) => {
        setLoading(true);
        try {
            const response = await fetch('http://192.168.7.82:7777/api/posts', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const newPost = await response.json();
            setPosts([newPost, ...posts]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post.');
        } finally {
            setLoading(false);
        }
    };
    const handleLike = (postId) => {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
      };
    return (
        <>
            <Navbar setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>
            <div className="home-container">
                <button className="create-post-button" onClick={() => setIsModalOpen(true)} aria-label="Create Post">
                    <FaCat className="cat-icon" />
                    <span className="cat-label">Create Post</span>
                </button>

                {isModalOpen && (
                    <CreatePost
                        onClose={() => setIsModalOpen(false)}
                        onPublish={handleCreatePost}
                    />
                )}

                <div className="posts-grid">
                    {loading ? (
                        <div className="loading">Loading posts...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="post-card">
                                <div className="post-header">
                                    <div className="user-info">
                                        <span className="user-icon">👤</span>
                                        <div>
                                            <div className="username">User {post.userId}</div>
                                            <div className="timestamp">{new Date(post.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="post-image">
                                    {post.image && (
                                        <img  src={post.image} alt="Post" />
                                    )}
                                </div>
                                <div className="post-text">{post.text}</div>
                                <div className="post-actions">
                                    <button className="like-button" onClick={() => handleLike(post.id)}>Likes {post.likes}</button>
                                    <button className="comment-button">Comment</button>
                                    <button className="delete-button" onClick={() => handleDeletePost(post.id)}> Delete</button>
                                </div>

                               {/* <div className="comments-section">
                                        <div className="existing-comments">
                                            {post.comments.map((comment) => (
                                            <div key={comment.id} className="comment">
                                                <strong>User #{comment.userId}:</strong> {comment.text}
                                            </div>
                                            ))}
                                        </div>
                                        <div className="add-comment">
                                            <input
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={commentInputs[post.id] || ""}
                                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  handleAddComment(post.id);
                                                }
                                              }}
                                           
                                           />
                                           
                                        </div>
                                    </div> */}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );

};

export default Home;
