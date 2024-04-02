import React, { useState, useEffect } from 'react';
import { auth, db, storage } from './firebase'; // Adjust import paths as necessary
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './css/Profile.css'; // Make sure to create a CSS file for styling

const Profile = () => {
    const [fullName, setFullName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    if (auth.currentUser) {
      const docRef = doc(db, "users", auth.currentUser.uid);
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
            setFullName(docSnap.data().name || '');
          setProfilePicture(docSnap.data().profilePicture || '');
        }
      });
    }
  }, []);

  const handleNameChange = (e) => {
    setFullName(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    const userRef = doc(db, "users", auth.currentUser.uid);
    let url = profilePicture;

    if (file) {
      const fileRef = ref(storage, `profilePictures/${auth.currentUser.uid}/${file.fullName}`);
      await uploadBytes(fileRef, file);
      url = await getDownloadURL(fileRef);
    }

    await updateDoc(userRef, {
        fullName: fullName,
      profilePicture: url,
    });

    setProfilePicture(url);
    alert('Profile updated successfully!');
  };

  const defaultImage = 'https://dl.dropbox.com/scl/fi/rpn385ekm39c8spf7aret/imagem_2024-03-31_201209793.png?rlkey=bdyv4ryb21d2cvn7ujjdzcdga&'; // Replace with the actual path to your default image

  return (
    <div className="profile-container">
      <h1 className="profile-header">Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        {profilePicture && (
          <img src={profilePicture || defaultImage} alt="profile" className="profile-avatar" />
        )}
        <div className="profile-info">
          <label className="profile-info-title">Username:</label>
          <input type="text" value={fullName} onChange={handleNameChange} className="input-edit" />
        </div>
        <div className="profile-info">
          <label className="profile-info-title">Profile Picture:</label>
          <input type="file" onChange={handleFileChange} className="input-edit" />
        </div>
        <button type="submit" className="button-edit">Update Profile</button>
        <button onClick={() => navigate(-1)} className="button-edit" style={{backgroundColor: "#6c757d", marginLeft: "10px"}}>Go Back</button>
      </form>
    </div>
  );
};

export default Profile;
