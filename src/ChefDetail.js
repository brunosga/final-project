import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChefDetail } from './hooks/useChefsDetails';
import Slider from "react-slick";
import { doc, updateDoc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, storage } from './firebase'; // Adjust the path if needed
import './App.css';



const ChefDetail = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [chefDetail, setChefDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isChef, setIsChef] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        getChefDetail(id)
            .then(data => {
                setChefDetail(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [id]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in
                setCurrentUser(user);
                // Check if the user ID exists in the chefs collection
                const chefDocRef = doc(db, 'chefs', user.uid);
                const chefDocSnap = await getDoc(chefDocRef);
                setIsChef(chefDocSnap.exists()); // Set true if user is a chef
            } else {
                // User is signed out
                setCurrentUser(null);
                setIsChef(false);
            }
        });

        return () => unsubscribe(); // Unsubscribe on unmount
    }, []);


    // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Show 3 images at a time
        slidesToScroll: 3, // Scroll 3 images at a time
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!chefDetail) return <div>Chef not found.</div>;

    const handleImageUpload = async (event) => {
        const files = event.target.files;
        if (!files.length) return;

        // Use Promise.all to wait for all uploads to complete
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                // Create a unique file name for the storage reference
                const uniqueFileName = `foodImage_${Date.now()}_${file.name}`;
                const storageRef = ref(storage, `food-images/${uniqueFileName}`);

                // Upload file
                const uploadResult = await uploadBytes(storageRef, file);
                // Get download URL
                return getDownloadURL(uploadResult.ref);
            });

            // Resolve all promises to get the download URLs
            const imageUrls = await Promise.all(uploadPromises);

            // Update Firestore document with new image URLs
            const chefDocRef = doc(db, "chefs", id); // Make sure 'id' is the chef's document ID
            await updateDoc(chefDocRef, {
                foodImage: arrayUnion(...imageUrls) // This adds the new URLs to the existing array
            });

            // Update the chefDetail state with the new image URLs
            setChefDetail(prevDetails => ({
                ...prevDetails,
                foodImage: [...prevDetails.foodImage, ...imageUrls]
            }));
        } catch (error) {
            console.error("Error uploading images:", error);
            // Handle error, e.g., show a message to the user
        }
    };

    const handleProfileImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const uniqueFileName = `chefImage_${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `chef-images/${uniqueFileName}`);

        try {
            const uploadResult = await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(uploadResult.ref);

            // Update Firestore document for chefImage
            const chefDocRef = doc(db, "chefs", id);
            await updateDoc(chefDocRef, { chefImage: downloadUrl });

            // Update local state
            setChefDetail(prevDetails => ({ ...prevDetails, chefImage: downloadUrl }));
        } catch (error) {
            console.error("Error uploading profile image:", error);
        }
    };

    const handleSaveProfile = async () => {
        try {
            await setDoc(doc(db, "chefs", id), chefDetail);
            setIsEditMode(false); // Optionally exit edit mode on save
            // Add additional logic if needed, like a success message or redirect
        } catch (error) {
            console.error("Error saving profile:", error);
            // Handle error, e.g., show a message to the user
        }
    };


    return (
        <div className="chef-detail">
            <button className='back-button' onClick={() => navigate(-1)}>&lt; All chefs</button>
            {isChef && (
                <button onClick={() => setIsEditMode(prev => !prev)}>Edit Mode</button>
            )
            }
            <div className="chef-profile">
                {chefDetail.chefImage && (
                    <div className="chef-image-container">
                        <img src={chefDetail.chefImage} alt={`Chef ${chefDetail.name}`} />
                    </div>
                )}
                <div className="chef-info">
                    {isEditMode ? (
                        <>
                            <input
                                type="text"
                                value={chefDetail.name}
                                onChange={e => setChefDetail({ ...chefDetail, name: e.target.value })}
                                placeholder="Chef Name"
                            />
                            <input
                                type="text"
                                value={chefDetail.cuisine}
                                onChange={e => setChefDetail({ ...chefDetail, cuisine: e.target.value })}
                                placeholder="Cuisine"
                            />
                            <textarea
                                value={chefDetail.bio}
                                onChange={e => setChefDetail({ ...chefDetail, bio: e.target.value })}
                                placeholder="About the Chef"
                            />
                            <label htmlFor="profile-image-upload" className="custom-file-upload">
                                Upload Profile Image
                            </label>
                            <input
                                id="profile-image-upload"
                                type="file"
                                onChange={handleProfileImageUpload} // Use the new handler
                                style={{ display: 'none' }} // Hide the default file input
                            />
                            <label htmlFor="food-image-upload" className="custom-file-upload">
                                Upload Your Dishes
                            </label>
                            <input
                                id="food-image-upload"
                                type="file"
                                multiple
                                onChange={handleImageUpload}
                                style={{ display: 'none' }} // Hide the default file input
                            />

                            <button className="save-changes" onClick={handleSaveProfile}>Save Changes</button>

                        </>
                    ) : (
                        <>
                            <h1>{chefDetail.name}</h1>
                            <h2>{chefDetail.cuisine}</h2>
                            <div className="about-chef">
                                <h3>About the Chef</h3>
                                <p>{chefDetail.bio}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="specialties">
                <h2>Specialties</h2>
            </div>


            <div className="slider-container">
                <Slider {...settings}>
                    {chefDetail.foodImage?.map((image, index) => (
                        <div key={index} className="chef-food-image">
                            <img src={image} alt={`Food ${index + 1}`} />
                        </div>
                    ))}
                </Slider>
            </div>
            <div className="review-section">
                <h2>Reviews</h2>
                <div className="review-list">
                    {/* Iterate through reviews and create a review item for each*/}
                    <div className="review-item">
                        <div className="review-avatar"></div>
                        <div className="review-content">
                            <p className="review-author">karlinha</p>
                            <p className="review-comment">This is a review comment with some text.</p>
                            <div className="review-rating">⭐⭐⭐⭐⭐</div>
                        </div>
                    </div>
                    {/* Repeat the .review-item for each review */}
                </div>
            </div>

            {/* Message Section */}
            <div className="message-section">
                <h2>Get in touch with the chef</h2>
                <textarea placeholder="Leave a message for the chef"></textarea>
                <button className="send-message">Send message</button>
            </div>
        </div>
    );
}

export default ChefDetail;

// Implement 'getChefDetail' function in api/firebase.js
// This function should fetch the chef's details from Firebase.

