import React, { useState } from 'react';
import './Settings.css';
import Navbar from './layout/Navbar';

function Settings({ user }) {
    const [firstName, setFirstName] = useState('First Name');
    const [lastName, setLastName] = useState('Last Name');
    const [userName, setUserName] = useState('Username');
    const [profilePicture, setProfilePicture] = useState(null);
    const [tempProfilePicture, setTempProfilePicture] = useState(null);

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false); // Modal state

    const handleFirstNameChange = (e) => setFirstName(e.target.value);
    const handleLastNameChange = (e) => setLastName(e.target.value);
    const handleUserNameChange = (e) => setUserName(e.target.value);

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setTempProfilePicture(URL.createObjectURL(file));
            setProfilePicture(file);
            setIsProfileModalOpen(false); // Close modal after selecting
        }
    };

    const handleUpdateSettings = () => {
        console.log('Updating settings:', { firstName, lastName, userName, profilePicture });
        setTempProfilePicture(null);
    };

    const handleFocus = (e, defaultValue) => {
        if (e.target.value === defaultValue) e.target.value = '';
    };

    const handleBlur = (e, defaultValue) => {
        if (e.target.value === '') e.target.value = defaultValue;
    };

    const openProfileModal = () => setIsProfileModalOpen(true);
    const closeProfileModal = () => setIsProfileModalOpen(false);

    return (
        <>
            <Navbar />
            <div className="settings-container lato-font">
                <div className="settings-scrollable">
                    <form onSubmit={(e) => e.preventDefault()} className="settings-form">

                        {/* Profile Picture At Top */}
                        <div className="profile-picture-wrapper" onClick={openProfileModal}>
                            {tempProfilePicture ? (
                                <img src={tempProfilePicture} alt="Profile" className="profile-picture" />
                            ) : (
                                <div className="profile-placeholder">+</div>
                            )}
                        </div>

                        {/* Modal for changing profile picture */}
                        {isProfileModalOpen && (
                            <div className="modal-overlay" onClick={closeProfileModal}>
                                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                    <label htmlFor="profilePicture" className="modal-label">
                                        Change Profile Picture
                                    </label>
                                    <input
                                        type="file"
                                        id="profilePicture"
                                        accept="image/*"
                                        onChange={handleProfilePictureChange}
                                        className="modal-input"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Settings Inputs */}
                        {/* <div className="settings-form-group cred-box">
                            <label htmlFor="firstName" className="settings-label">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onFocus={(e) => handleFocus(e, 'First Name')}
                                onBlur={(e) => handleBlur(e, 'First Name')}
                                onChange={handleFirstNameChange}
                                className="settings-input"
                            />
                        </div> */}

                        {/* <div className="settings-form-group cred-box">
                            <label htmlFor="lastName" className="settings-label">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onFocus={(e) => handleFocus(e, 'Last Name')}
                                onBlur={(e) => handleBlur(e, 'Last Name')}
                                onChange={handleLastNameChange}
                                className="settings-input"
                            />
                        </div> */}

                        <div className="settings-form-group cred-box">
                            <label htmlFor="userName" className="settings-label">Username:</label>
                            <input
                                type="text"
                                id="userName"
                                value={userName}
                                onFocus={(e) => handleFocus(e, 'Username')}
                                onBlur={(e) => handleBlur(e, 'Username')}
                                onChange={handleUserNameChange}
                                className="settings-input"
                            />
                        </div>

                        <button className="settings-update-button" onClick={handleUpdateSettings}>
                            Update Settings
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Settings;