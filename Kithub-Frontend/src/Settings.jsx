import React, { useState, useEffect } from 'react';
import heic2any from 'heic2any';
import './Settings.css';
import Navbar from './layout/Navbar';

function Settings({ user }) {
    const [firstName, setFirstName] = useState('First Name');
    const [lastName, setLastName] = useState('Last Name');
    const [userName, setUserName] = useState(user?.username || '');
    const [profilePicture, setProfilePicture] = useState(null);
    const [tempProfilePicture, setTempProfilePicture] = useState(null);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Load user profile picture
    useEffect(() => {
        if (user && user.id) {
            console.log('Loading profile picture for user:', user.id);
            fetch(`http://10.176.104.215:7777/api/user/${user.id}/profile-picture`)
                .then(res => res.ok ? res.blob() : null)
                .then(blob => {
                    if (blob) {
                        const imageUrl = URL.createObjectURL(blob);
                        setTempProfilePicture(imageUrl);
                    }
                })
                .catch(err => console.error('Error fetching profile picture:', err));
        } else {
            console.warn('User object or user ID missing.');
        }
    }, [user]);

    // Handle profile picture file input
    const handleProfilePictureChange = async (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (selected.type === 'image/heic' || selected.name.toLowerCase().endsWith('.heic')) {
            try {
                const convertedBlob = await heic2any({
                    blob: selected,
                    toType: 'image/jpeg',
                    quality: 0.8,
                });

                const jpegFile = new File(
                    [convertedBlob],
                    selected.name.replace(/\.[^/.]+$/, '.jpg'),
                    { type: 'image/jpeg' }
                );

                setProfilePicture(jpegFile);
                setTempProfilePicture(URL.createObjectURL(convertedBlob));
            } catch (error) {
                console.error('HEIC to JPEG conversion failed:', error);
            }
        } else {
            setProfilePicture(selected);
            setTempProfilePicture(URL.createObjectURL(selected));
        }

        setIsProfileModalOpen(false);
    };

    // Update profile picture (optional) and log debug info
    const handleUpdateSettings = () => {
        console.log('Update button clicked');
        console.log('User:', user);
        console.log('Selected profilePicture:', profilePicture);

        if (!user || !user.id) {
            console.warn('Missing user ID. Cannot proceed.');
            return;
        }

        if (profilePicture) {
            const formData = new FormData();
            formData.append('profile_picture', profilePicture);

            fetch(`http://10.176.104.215:7777/api/user/${user.id}/profile-picture`, {
                method: 'POST',
                body: formData,
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Profile picture uploaded:', data);
                    setTempProfilePicture(null);
                })
                .catch(err => console.error('Upload failed:', err));
        } else {
            console.log('No new profile picture selected. Skipping image upload.');
        }

        // Add logic here to save other settings (username, etc.) if needed
    };

    const openProfileModal = () => setIsProfileModalOpen(true);
    const closeProfileModal = () => setIsProfileModalOpen(false);

    const handleFocus = (e, defaultValue) => {
        if (e.target.value === defaultValue) e.target.value = '';
    };

    const handleBlur = (e, defaultValue) => {
        if (e.target.value === '') e.target.value = defaultValue;
    };

    return (
        <>
            <Navbar />
            <div className="settings-container lato-font">
                <div className="settings-scrollable">
                    <form onSubmit={(e) => e.preventDefault()} className="settings-form">
                        {/* Profile Picture Display */}
                        <div className="profile-picture-wrapper" onClick={openProfileModal}>
                            {tempProfilePicture ? (
                                <img src={tempProfilePicture} alt="Profile" className="profile-picture" />
                            ) : (
                                <div className="profile-placeholder">+</div>
                            )}
                        </div>

                        {/* Profile Picture Modal */}
                        {isProfileModalOpen && (
                            <div className="modal-overlay" onClick={closeProfileModal}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <label htmlFor="profilePicture" className="modal-label">
                                        Change Profile Picture
                                    </label>
                                    <input
                                        type="file"
                                        id="profilePicture"
                                        accept="image/*,.heic"
                                        onChange={handleProfilePictureChange}
                                        className="modal-input"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Username Input */}
                        <div className="settings-form-group cred-box">
                            <label htmlFor="userName" className="settings-label">Username:</label>
                            <input
                                type="text"
                                id="userName"
                                value={userName}
                                onFocus={(e) => handleFocus(e, 'Username')}
                                onBlur={(e) => handleBlur(e, 'Username')}
                                onChange={(e) => setUserName(e.target.value)}
                                className="settings-input"
                            />
                        </div>

                        {/* Update Button */}
                        <button
                            type="button"
                            className="settings-update-button"
                            onClick={handleUpdateSettings}
                        >
                            Update Settings
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Settings;
