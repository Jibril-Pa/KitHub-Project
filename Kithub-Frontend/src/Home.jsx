import React, { useState, useEffect } from 'react';
import { FaCat } from 'react-icons/fa';
import './Home.css';
import Navbar from '/src/layout/Navbar';
import CreatePost from './Createpost';

const SERVER_URL = 'http://172.19.213.126:7777';




const Home = ({ setIsLoggedIn, isLoggedIn, user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});

    useEffect(() => {
        document.title = "KitHub | Home";
    }, []);

    const handleDeletePost = async (postId,e) => {
        try {
            const response = await fetch(`${SERVER_URL}/api/posts/${postId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete post');
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (error) {
            console.error(error);
            alert('Error deleting post.');
        }
        e.preventDefault();
    };

    const handleCommentChange = (postId, value) => {
        setCommentInputs((prev) => ({ ...prev, [postId]: value }));
    };

    const handleAddComment = async (postId) => {
        const text = commentInputs[postId];
        if (!text || text.trim() === "") return;

        try {
            const response = await fetch(`${SERVER_URL}/api/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: postId,
                    userId: 999,  // Replace with dynamic user ID if you have login
                    text: text.trim()
                })
            });

            if (!response.ok) throw new Error("Failed to send comment");

            const newComment = await response.json();

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? { ...post, comments: [...post.comments, newComment] }
                        : post
                )
            );

            setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment.");
        }
    };


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/api/posts`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                // Fetch comments for each post
                const postsWithComments = await Promise.all(data.map(async (post) => {
                    try {
                        const commentRes = await fetch(`${SERVER_URL}/api/comments/${post.id}`);
                        const commentData = await commentRes.json();

                        // Format comments
                        const formattedComments = commentData.map((c, index) => ({
                            id: `${post.id}-${index}`, // Unique ID for React rendering
                            userId: 'N/A',              // Adjust if user info is added later
                            text: c.comments_text,
                            createdAt: new Date().toISOString()
                        }));

                        return {
                            ...post,
                            comments: formattedComments
                        };
                    } catch (err) {
                        console.error(`Failed to fetch comments for post ${post.id}:`, err);
                        return {
                            ...post,
                            comments: []
                        };
                    }
                }));

                setPosts(postsWithComments);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to load posts.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);


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
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
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
                                    <button className="like-button" onClick={() => handleLike(post.id)}>Like {post.likes}</button>
                                    {/* <button className="comment-button">Comment</button> */}
                                    <button className="delete-button" onClick={() => handleDeletePost(post.id)}>Delete</button>
                                    
                                </div>
                                { 
                                        <div className="comments-section">
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
                                        </div>
                }
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
