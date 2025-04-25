import React, { useState, useEffect } from 'react';
import { FaCat } from 'react-icons/fa';
import './Home.css';
import Navbar from '/src/layout/Navbar';
import CreatePost from './Createpost';

const Home = () => {
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
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Failed to load posts.');
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

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
            <Navbar />
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

                <div className="posts-container">
                    {loading ? (
                        <div>Loading posts...</div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="post-card">
                                <div className="post-header">
                                    <div className="user-info">
                                        <div className="profile-image">👤</div>
                                        <span>User {post.userId}</span>
                                    </div>
                                    <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="post-content">
                                    <p>{post.text}</p>
                                    {post.image && (
                                        <img src={`http://localhost:7777${post.image}`} alt="Post" />
                                    )}
                                </div>
                                <div className="post-actions">
                                    <button>Like</button>
                                    <button>Comment</button>
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
