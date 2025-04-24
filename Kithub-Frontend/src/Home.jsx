import React, { useState, useEffect } from 'react';
import { FaCat } from 'react-icons/fa';
import './Home.css';
import Navbar from '/src/layout/Navbar'; // Import Navbar
import CreatePostModal from './Createpost';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts'); // Adjust the URL as needed
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

    const handleCreatePost = async (formData) => { // Receive formData
        setLoading(true);
        try {


            const response = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                body: formData, // Send the FormData object
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newPost = await response.json();
             setPosts([newPost, ...posts]);
            setNewPostText('');
            setNewPostImage(null);
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
        <button
          className="create-post-button"
          onClick={() => setIsModalOpen(true)}
          aria-label="Create Post"
        >
          <FaCat className="cat-icon" />
          <span className="cat-label">Create Post</span>
        </button>

        {isModalOpen && (
          <CreatePostModal
            onClose={() => setIsModalOpen(false)}
            onPublish={handleCreatePost} // Pass handleCreatePost
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
                    {/* Replace with actual user profile image and link */}
                    <div className="profile-image">👤</div>
                    <span>{post.username}</span>
                  </div>
                  <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
                </div>
                <div className="post-content">
                  <p>{post.text}</p>
                  {post.imageUrl && <img src={`http://localhost:5000${post.imageUrl}`} alt="Post Image" />}
                  {post.videoUrl && (
                    <video controls width="100%">
                      <source src={`http://localhost:5000${post.videoUrl}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                <div className="post-actions">
                  <button>Like</button>
                  <button>Comment</button>
                </div>
                {/* comments */}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Home;