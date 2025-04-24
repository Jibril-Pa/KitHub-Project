import React, { useState } from 'react';
import './Createpost.css';

export default function CreatePostModal({ onClose, onPublish }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Build form data to send to your backend or parent handler
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        if (file) {
            formData.append('image', file);
        }

        // Call the publish callback (e.g., API call)
        if (onPublish) {
            onPublish(formData);
        }

        // Close modal
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Create a New Post</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Title
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Body
                        <textarea
                            name="body"
                            rows="4"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </label>

                    {preview && (
                        <div className="image-preview">
                            <img src={preview} alt="Preview" />
                        </div>
                    )}

                    <button type="submit">Publish</button>
                </form>
                <button className="modal-close" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
}
