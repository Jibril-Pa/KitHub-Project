import React, { useState } from 'react';
import heic2any from "heic2any"; // <--- import it
import './Createpost.css';

export default function CreatePostModal({ onClose, onPublish }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = async (e) => {
        const selected = e.target.files[0];
        if (selected) {
            if (selected.type === "image/heic" || selected.name.endsWith(".heic")) {
                try {
                    const convertedBlob = await heic2any({
                        blob: selected,
                        toType: "image/jpeg",
                        quality: 0.8, // optional, 0 to 1
                    });

                    const jpegFile = new File(
                        [convertedBlob],
                        selected.name.replace(/\.[^/.]+$/, ".jpg"),
                        { type: "image/jpeg" }
                    );

                    setFile(jpegFile);
                    setPreview(URL.createObjectURL(convertedBlob));
                } catch (error) {
                    console.error("HEIC to JPEG conversion failed", error);
                }
            } else {
                setFile(selected);
                setPreview(URL.createObjectURL(selected));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        if (file) {
            formData.append('image', file);
        }

        if (onPublish) {
            onPublish(formData);
        }

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
