import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChefDetail } from './hooks/useChefsDetails';
import Slider from "react-slick";
import { collection, addDoc, doc, updateDoc, getDoc, setDoc, arrayUnion, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, storage } from './firebase'; // Adjust the path if needed
import './css/ChefDetails.css';
import './css/Review.css'

const ChefDetail = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [chefDetail, setChefDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isChef, setIsChef] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [foodRating, setFoodRating] = useState(0);
    const [communicationRating, setCommunicationRating] = useState(0);
    const [serviceRating, setServiceRating] = useState(0);
    const [professionalismRating, setProfessionalismRating] = useState(0);
    const [reviews, setReviews] = useState([]);

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
                // Check if the user ID exists in the chefs collection
                const chefDocRef = doc(db, 'chefs', user.uid);
                const chefDocSnap = await getDoc(chefDocRef);
                setIsChef(chefDocSnap.exists() && user.uid === id); // Set true if user is a chef and matches the profile ID
            } else {
                // User is signed out
                setIsChef(false);
            }
        });

        return () => unsubscribe(); // Unsubscribe on unmount
    }, [id]);

    useEffect(() => {
        const fetchReviews = async () => {
            const q = query(collection(db, 'reviews'), where('chefId', '==', id));
            const querySnapshot = await getDocs(q);
            setReviews(querySnapshot.docs.map((doc) => doc.data()));
        };

        fetchReviews();
    }, [id]);

    // Add a check to see if the current user can edit the profile

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
            const imageUrls = (await Promise.all(uploadPromises)).filter(url => url); // Filter out any undefined or empty strings

            // Check if there are URLs to update
            if (imageUrls.length > 0) {
                // Update Firestore document with new image URLs
                const chefDocRef = doc(db, "chefs", id); // Make sure 'id' is the chef's document ID
                await updateDoc(chefDocRef, {
                    foodImage: arrayUnion(...imageUrls) // This adds the new URLs to the existing array
                });

                // Update the chefDetail state with the new image URLs
                setChefDetail(prevDetails => ({
                    ...prevDetails,
                    foodImage: prevDetails.foodImage ? [...prevDetails.foodImage, ...imageUrls] : [...imageUrls]
                }));
            }
        } catch (error) {
            console.error("Error uploading images:", error);
            // Handle error, e.g., show a message to the user
        }
    };

    const handleDeleteImage = async (imageUrl) => {
        try {
            // Create a reference to the file to delete
            const imageRef = ref(storage, imageUrl);

            // Delete the file from Firebase Storage
            await deleteObject(imageRef);

            // Filter out the image URL from the local state array
            const updatedImages = chefDetail.foodImage.filter(image => image !== imageUrl);

            // Update Firestore document to remove the image URL
            const chefDocRef = doc(db, "chefs", id);
            await updateDoc(chefDocRef, { foodImage: updatedImages });

            // Update local state
            setChefDetail(prevDetails => ({ ...prevDetails, foodImage: updatedImages }));
        } catch (error) {
            console.error("Error deleting image:", error);
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


    // This function will be called when the "Send message" button is clicked
    const handleSendClick = async () => {
        // Prevent sending empty messages
        console.log('Send button clicked');
        if (!messageText.trim()) return;

        console.log('Attempting to send message:', messageText);

        // Get the current user id from the Auth context or Auth state
        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) {
            console.error('No user is logged in.');
            return;
        }

        console.log('Current User ID:', currentUserId);


        // Check if a chat between the user and the chef already exists
        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('participantsIds', 'array-contains', currentUserId));
        const querySnapshot = await getDocs(q);
        let existingChatRef = null;

        querySnapshot.forEach((doc) => {
            const participants = doc.data().participantsIds;
            if (participants.includes(id)) {
                existingChatRef = doc.ref; // Chat already exists
            }
        });

        let chatDocRef = existingChatRef;

        // If the chat doesn't exist, create it
        if (!chatDocRef) {
            chatDocRef = await addDoc(collection(db, 'chats'), {
                participantsIds: [currentUserId, id],
                lastMessage: messageText,
                lastMessageTimestamp: Timestamp.now(),
            });
        } else {
            // If chat exists, update the last message and timestamp
            await updateDoc(chatDocRef, {
                lastMessage: messageText,
                lastMessageTimestamp: Timestamp.now(),
            });
        }

        // Add the message to the chat's messages subcollection
        await addDoc(collection(db, 'chats', chatDocRef.id, 'messages'), {
            text: messageText,
            timestamp: Timestamp.now(),
            senderId: currentUserId,
            readStatus: false // Assuming you want to track if the message has been read
        });

        setMessageText('');
    };

     // Helper function to get user details
async function getUserDetails(userId) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
  
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log('User details not found.');
      return null;  // Handle the case where the user data doesn't exist appropriately
    }
  }
   
  // Function to submit a review
  const submitReview = async (event) => {
      // Prevent the default form submission behavior
    event.preventDefault();
    
    if (!auth.currentUser) {
      console.error('User not logged in');
      alert('You must be logged in to submit a review.');
      return;
    }
  
    // Fetch user details
    const userDetails = await getUserDetails(auth.currentUser.uid);
    console.log(userDetails); // Log to see if userDetails are as expected

    if (!userDetails) {
      console.error('Cannot fetch user details for review');
      return;
    }
  
    const review = {
      chefId: id, // ID from the useParams hook
      userId: auth.currentUser.uid,
      name: userDetails.fullName, // Assuming 'fullName' is stored in the user document
      profilePicture: userDetails.profilePicture, // Assuming 'profilePicture' is stored in the user document
      foodRating,
      communicationRating,
      serviceRating,
      professionalismRating,
      comment: reviewText,
      date: Timestamp.now(),
    };
  
    try {
      const docRef = await addDoc(collection(db, "reviews"), review);
      console.log('Review submitted successfully');
      alert('Review submitted successfully');

  
      // Optionally clear the review form here
      setReviewText('');
      setFoodRating(0);
      setCommunicationRating(0);
      setServiceRating(0);
      setProfessionalismRating(0);
  
      // Add the review to the local state to update the UI without re-fetching
      setReviews(currentReviews => [
        ...currentReviews,
        { ...review, id: docRef.id } // Include the Firestore-generated ID in the review object
      ]);
    } catch (error) {
      console.error('Error submitting review:', error);
      // Handle the error, e.g., show a message to the user
    }
  }; 

  const reviewSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    nextArrow: <UpArrow />,
    prevArrow: <DownArrow />
  };
  
  function UpArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
        className={`${className} custom-slick-up`} // Renamed class for up arrow
        style={{ ...style, display: 'block' }} // Your style here
        onClick={onClick}
      />
    );
  }
  
  function DownArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
        className={`${className} custom-slick-down`} // Renamed class for down arrow
        style={{ ...style, display: 'block' }} // Your style here
        onClick={onClick}
      />
    );
  }
  

/* 
    // Add the function to submit a review
    const submitReview = async () => {
         // Prevent the default form submission behavior
    event.preventDefault();
        if (!auth.currentUser) {
            console.error('User not logged in');
            return;
        }

        const review = {
            chefId: id, // ID from the useParams hook
            userId: auth.currentUser.uid,
            name: "Annonymous", // Replace with actual user name if available
            profileImage: "User's Profile Image URL", // Replace with actual user profile image URL if available
            foodRating,
            communicationRating,
            serviceRating,
            professionalismRating,
            comment: reviewText,
            date: Timestamp.now(),
        };

        try {
            await addDoc(collection(db, "reviews"), review);
            console.log('Review submitted successfully');
             alert('Review submitted successfully');
            // You may want to clear the form or give user feedback here
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    }; */



    /*  // Generate a unique chatId, could be a combination of user and chef IDs
     const chatId = `${currentUserId}_${id}`; // This is a simple way to ensure uniqueness

     // Create a reference to the chat document in Firestore
     const chatRef = doc(db, 'chats', chatId);

     // Set the chat document with participants and last message details
     await setDoc(chatRef, {
         participantsIds: [currentUserId, id],
         lastMessage: messageText,
         lastMessageTimestamp: Timestamp.now(),
     }, { merge: true });

     console.log('Chat document set with last message');

     // Add the message to the chat's messages subcollection
     const messageRef = collection(db, 'chats', chatId, 'messages');
     await addDoc(messageRef, {
         text: messageText,
         timestamp: Timestamp.now(),
         senderId: currentUserId,
     });

     // Clear the textarea after sending the message
     setMessageText('');
 }; */

    const defaultImage = 'https://dl.dropbox.com/scl/fi/rpn385ekm39c8spf7aret/imagem_2024-03-31_201209793.png?rlkey=bdyv4ryb21d2cvn7ujjdzcdga&'; // Replace with the actual path to your default image



    return (
        <div className="chef-detail">
            <button className='back-button' onClick={() => navigate(-1)}>&lt; All chefs</button>
            {isChef && (
                <button onClick={() => setIsEditMode(!isEditMode)}>
                    {isEditMode ? 'View Profile' : 'Edit Profile'}
                </button>
            )}
            <div className="chef-profile">
                <div className="chef-image-container">
                    <img src={chefDetail.chefImage || defaultImage} alt={`Chef ${chefDetail.name}`} />
                </div>
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
                                value={chefDetail.price}
                                onChange={e => setChefDetail({ ...chefDetail, price: e.target.value })}
                                placeholder="Please enter your starting price for your services"
                            />
                            <textarea
                                type="text"
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
                            <h1>{chefDetail.name.startsWith("Chef ") ? chefDetail.name : `Chef ${chefDetail.name}`}</h1>
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
                            {isEditMode && (
                                <button onClick={() => handleDeleteImage(image)} className="delete-image-button">
                                    Delete
                                </button>
                            )}
                        </div>
                    ))}
                </Slider>
            </div>
            <div className="review-section">
                <h2>Reviews</h2>


                {/* Review Form */}

                <div className="review-list">
                <Slider {...reviewSliderSettings}>
                    {reviews.map((review, index) => (
                        <div className="review-item" key={index}>
                            <div className="review-avatar">
                                {/* If there is no image, a default one will be shown */}
                                <img src={review.profilePicture || defaultImage} alt={review.name || 'User'}/>
                            </div>
                            <div className="review-content">
                            <p className="review-author">{review.name || 'Anonymous'}</p>
                                <p className="review-date">{review.date.toDate().toDateString()}</p>
                                <p className="review-comment">{review.comment}</p>
                                <div className="review-rating">Food Rating: {review.foodRating}</div>
                                {/* Add other ratings like communication, service, professionalism */}
                            </div>
                        </div>
                    ))}
                </Slider>
                </div>
                <form className="review-form" onSubmit={submitReview}>
                    <h3>Leave a Review</h3>
                    <textarea
                        className="input-edit"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Your review"
                    />
                    {/* Rating Inputs */}
                    <div className="rating-input">
                        <input
                            className="input-edit"
                            type="number"
                            value={foodRating}
                            onChange={(e) => setFoodRating(e.target.value)}
                            placeholder="Food rating"
                        />
                        {/* Repeat for other ratings */}
                        <input
                            className="input-edit"
                            type="number"
                            value={communicationRating}
                            onChange={(e) => setCommunicationRating(e.target.value)}
                            placeholder="Communication rating"
                        />
                        <input
                            className="input-edit"
                            type="number"
                            value={serviceRating}
                            onChange={(e) => setServiceRating(e.target.value)}
                            placeholder="Service rating"
                        />
                        <input
                            className="input-edit"
                            type="number"
                            value={professionalismRating}
                            onChange={(e) => setProfessionalismRating(e.target.value)}
                            placeholder="Professionalism rating"
                        />
                    </div>
                    <button className="button-edit" type="submit">Submit Review</button>
                </form>

            </div>


            {/* Message Section */}
            <div className="message-section">
                <h2>Get in touch with the chef</h2>
                <textarea
                    id="messageText" // Adding an id
                    name="messageText" // Adding a name
                    placeholder="Leave a message for the chef"
                    value={messageText} // Controlled component
                    onChange={(e) => setMessageText(e.target.value)} // Update state on change
                ></textarea>
                <button className="send-message" onClick={handleSendClick}>Send message</button>
            </div>
        </div>
    );
}

export default ChefDetail;