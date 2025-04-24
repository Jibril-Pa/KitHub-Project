// src/pages/Home.jsx
import React, { useState , useEffect } from 'react';
import Navbar from '/src/layout/Navbar';
import CreatePostModal from '/src/Createpost';
import { FaCat } from 'react-icons/fa';
import './Home.css';

export default function Home({ setIsLoggedIn }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts,setPosts] = useState([]);

    useEffect(() => {
      document.title = "KitHub 🐾 | Home";
    }, []);
    
    useEffect(()=>{
        fetch('http://localhost:3001/posts') // replace w mysql server link
        .then (res => res.json())
        .then (data => {
            if (Array.isArray(data) && data.length > 0) {
            setPosts(data);
          } else {
            // fallback to mock data
            setPosts([
              {
                id: 1,
                title: "Mock Cat Nap",
                body: "Waiting for real posts 🐱",
                imgUrl: "https://placekitten.com/400/300",
                comments: [
                  { id: 1, author: "CatFan", text: "Where's the backend?" }
                ]
              }
            ]);
          }
        })
        .catch(err => {
          console.error('Failed to fetch user posts: ', err);
          // set mock fallback
          setPosts([
            {
              id: 1,
              title: "Mock Cat Nap",
              body: "Waiting for real posts 🐱",
              imgUrl: "https://placekitten.com/400/300",
              comments: [
                { id: 1, author: "CatFan", text: "Where's the backend?" }
              ]
            }
          ]);
        });
    }, []);

    return (
        <>
            <Navbar setIsLoggedIn={setIsLoggedIn}/>

            <div className="home-feed">
            {posts.map(post=>(
                <div key={post.id} className="post-box">
                    <img src={post.imgUrl} alt={post.title}/>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>


                    <div className="comment-section">
                        {post.comments && post.comments.length > 0 ? (
                        post.comments.map(comment => (
                            <div key={comment.id} className="comment">
                            <strong>{comment.author}:</strong> {comment.text}
                            </div>
                        ))
                        ) : (
                        <p className="no-comments">No comments yet.</p>
                        )}
                    </div>
                </div>

            ))}
            </div>

            <button
                className="create-post-button"
                onClick={() => setIsModalOpen(true)}
                aria-label="Create Post"
            >
                <FaCat className="cat-icon" />
                <span className="cat-label">Create Post</span>
            </button>

            {isModalOpen && (
                <CreatePostModal onClose={() => setIsModalOpen(false)} />
            )}
        </>
    )
}
