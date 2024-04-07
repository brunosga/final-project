// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { auth, db, storage } from './firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; 
import './css/Profile.css'; 

// Profile component for editing and updating user profile
const Profile = () => {
  // State hooks for managing user information and file for profile picture
  const [fullName, setFullName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [file, setFile] = useState(null); // File for the new profile picture
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Fetching user profile data on component mount
  useEffect(() => {
    if (auth.currentUser) {
      const docRef = doc(db, "users", auth.currentUser.uid); // Reference to the user's document
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
          // Setting state with fetched data
          setFullName(docSnap.data().name || '');
          setProfilePicture(docSnap.data().profilePicture || '');
        }
      });
    }
  }, []);

  // Handlers for input changes
  const handleNameChange = (e) => {
    setFullName(e.target.value); // Update name state
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update file state with the selected file
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!auth.currentUser) return; // Guard clause if no user is logged in

    const userRef = doc(db, "users", auth.currentUser.uid); // Reference to the user's Firestore document
    let url = profilePicture; // Default to the current profile picture

    if (file) {
      // If a new file is selected, upload it to Firebase Storage
      const fileRef = ref(storage, `profilePictures/${auth.currentUser.uid}/${file.name}`);
      await uploadBytes(fileRef, file); // Upload the file
      url = await getDownloadURL(fileRef); // Get the download URL of the uploaded file
    }

    // Update the Firestore document with the new name and profile picture URL
    await updateDoc(userRef, {
      name: fullName,
      profilePicture: url,
    });

    setProfilePicture(url); // Update state with the new profile picture URL
    alert('Profile updated successfully!'); // Inform the user of successful update
  };

  // Default image URL in case no profile picture is set
  const defaultImage = 'https://dl.dropbox.com/scl/fi/rpn385ekm39c8spf7aret/imagem_2024-03-31_201209793.png?rlkey=bdyv4ryb21d2cvn7ujjdzcdga&';

  // Rendering the profile editing form
  return (
    <div className="profile-container">
      <button className='go-back-button' onClick={() => navigate(-1)}>&lt;</button> {/* Back button */}
      <h1 className="profile-header">Edit Profile</h1> {/* Header */}
      <form onSubmit={handleSubmit}>
        {/* Profile picture */}
        <img src={profilePicture || defaultImage} alt="profile" className="profile-avatar" />
        {/* Input for user's full name */}
        <div className="profile-info">
          <label className="profile-info-title">Username:</label>
          <input type="text" value={fullName} onChange={handleNameChange} className="input-name" placeholder="Your name" />
        </div>
        {/* Input for selecting a new profile picture */}
        <div className="profile-info">
          <label className="profile-image-upload">Profile Picture:</label>
          <input type="file" onChange={handleFileChange} className="input-edit" />
        </div>
        {/* Submit button */}
        <button type="submit" className="button-edit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;  // Export the component for use in other parts of the app