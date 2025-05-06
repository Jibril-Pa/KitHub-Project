import React, { useState, useEffect } from 'react';
import { FaCat } from 'react-icons/fa';
import './Home.css';
import Navbar from '/src/layout/Navbar';
import CreatePost from './Createpost';

<<<<<<< HEAD
const SERVER_URL = 'http://192.168.1.125:7777';
=======
const SERVER_URL = 'http://172.19.213.126:7777';



>>>>>>> db4bc7a97406291de85c851b061e0a039d56668a

const Home = ({ setIsLoggedIn, isLoggedIn, user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});

    useEffect(() => {
        document.title = "KitHub | Home";

        const fetchPosts = async () => {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                setError('User not logged in.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${SERVER_URL}/api/posts`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to load posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleDeletePost = async (postId) => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`${SERVER_URL}/api/posts/${postId}?user_id=${userId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete post');
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error(error);
            alert('Error deleting post.');
        }
    };

    const handleCommentChange = (postId, value) => {
        setCommentInputs((prev) => ({ ...prev, [postId]: value }));
    };

    const handleAddComment = async (postId) => {
        const text = commentInputs[postId];
        const userId = localStorage.getItem('userId');

        if (!text || text.trim() === "" || !userId) return;

        try {
            const response = await fetch(`${SERVER_URL}/api/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId,
                    userId,
                    text: text.trim()
                })
            });

            if (!response.ok) throw new Error("Failed to send comment");

            const newComment = await response.json();

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, comments: [...(post.comments || []), newComment] }
                        : post
                )
            );

            setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment.");
        }
    };

    const handleCreatePost = async (formData) => {
        setLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/api/posts`, {
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
                post.id === postId ? { ...post, likes: (post.likes ?? 0) + 1 } : post
            )
        );
    };
    
    return (
        <>
            <Navbar setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
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
                                            <div className="timestamp">{new Date(post.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="post-image">
                                    {post.image && (
                                        <img src={`${SERVER_URL}${post.image}`} alt="Post" />
                                    )}
                                </div>
                                <div className="post-text">{post.text}</div>
                                <div className="post-actions">
<<<<<<< HEAD
                                    <button className="like-button" onClick={() => handleLike(post.id)}>Likes {post.likes ?? 0}</button>
                                    <button className="comment-button">Comment</button>
=======
                                    <button className="like-button" onClick={() => handleLike(post.id)}>Like {post.likes}</button>
                                    {/* <button className="comment-button">Comment</button> */}
>>>>>>> db4bc7a97406291de85c851b061e0a039d56668a
                                    <button className="delete-button" onClick={() => handleDeletePost(post.id)}>Delete</button>
                                </div>

                                <div className="comments-section">
                                    <div className="existing-comments">
                                        {(post.comments ?? []).map((comment) => (
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
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
