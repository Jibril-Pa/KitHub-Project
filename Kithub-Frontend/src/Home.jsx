// src/pages/Home.jsx
import React, { useState } from 'react';
import Navbar from '/src/layout/Navbar';
import CreatePostModal from '/src/Createpost';
import { FaCat } from 'react-icons/fa';
import './Home.css';

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Navbar />

            {/* …other page content… */}

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
