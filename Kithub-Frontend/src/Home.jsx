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

    useEffect(() => {
        document.title = "KitHub | Home";
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:7777/api/posts');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setPosts(data);
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
            const response = await fetch('http://localhost:7777/api/posts', {
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
                                            <div className="username">User #{post.userId}</div>
                                            <div className="timestamp">{new Date(post.createdAt).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="post-image">
                                    {post.image && (
                                        <img src={`http://localhost:7777${post.image}`} alt="Post" />
                                    )}
                                </div>
                                <div className="post-text">{post.text}</div>
                                <div className="post-actions">
                                    <button className="like-button">Like (0)</button>
                                    <button className="comment-button">Comment (0)</button>
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
