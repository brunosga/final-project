// Some parts that are commented in this file is gonna be explained on the final report of the project

// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChefDetail } from './hooks/useChefsDetails';
import Slider from "react-slick";
import { collection, addDoc, doc, updateDoc, getDoc, setDoc, arrayUnion, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, storage } from './firebase';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import './css/ChefDetails.css';
import './css/Review.css'
import 'react-toastify/dist/ReactToastify.css';

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
    // const [communicationRating, setCommunicationRating] = useState(0);
    // const [serviceRating, setServiceRating] = useState(0);
    // const [professionalismRating, setProfessionalismRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [slideIndex, setSlideIndex] = useState(0);
    const [hover, setHover] = useState(0);
    const [averageRating, setAverageRating] = useState(0);

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
        // Subscribe to authentication state changes
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

    // Getting the review data from the database
    useEffect(() => {
        const fetchReviews = async () => {
            const q = query(collection(db, 'reviews'), where('chefId', '==', id));
            const querySnapshot = await getDocs(q);
            const reviewsData = querySnapshot.docs.map((doc) => {
                // Log the review data to debug
                console.log(doc.data());
                return { ...doc.data(), id: doc.id };
            });

            setReviews(reviewsData);
            const averageRating = calculateAverageRating(reviewsData);
            setAverageRating(averageRating);
        };

        fetchReviews();
    }, [id]);


    // This function should be called to update the state whenever the reviews array updates
    const calculateAverageRating = (reviews) => {
        // Only proceed if reviews is not empty
        if (!reviews.length) return '0.0';
        const sum = reviews.reduce((acc, review) => acc + (Number(review.foodRating) || 0), 0);
        const average = (sum / reviews.length) || 0;
        return average.toFixed(1); // Rounds to one decimal and converts to string
    };


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
        if (!messageText.trim()) {
            toast.info('Please enter a message.'); // Inform the user to enter a message if the input is empty
            return;
        }

        console.log('Attempting to send message:', messageText);

        // Get the current user id from the Auth context or Auth state
        const currentUserId = auth.currentUser?.uid;
        if (!currentUserId) {
            // Display error toast if no user is logged in
            toast.error('You must be logged in to send a message.');
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

        try {
            // Add the message to the chat's messages subcollection
            await addDoc(collection(db, 'chats', chatDocRef.id, 'messages'), {
                text: messageText,
                timestamp: Timestamp.now(),
                senderId: currentUserId,
                readStatus: false // Assuming you want to track if the message has been read
            });

            setMessageText('');

            // Display success toast
            toast.success("Message sent successfully! Check the chat to see your messages!");
        } catch (error) {
            console.error("Error sending message:", error);
            // Optionally, display an error toast
            toast.error("Failed to send message. Please try again.");
        }
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
            toast.error('You must be logged in to submit a review.');
            return;
        }

        if (isChef) {
            toast.info("Only regular users can leave a review to the chefs");
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
            //  communicationRating,
            // serviceRating,
            // professionalismRating,
            comment: reviewText,
            date: Timestamp.now(),
        };

        try {



            // Push the new review to Firestore
            const docRef = await addDoc(collection(db, "reviews"), review);
            console.log('Review submitted successfully');
            toast.success('Review submitted successfully');

            // Update the local state with the new review
            setReviews((currentReviews) => {
                const updatedReviews = [...currentReviews, { ...review, id: docRef.id }];
                return updatedReviews;
            });

            // Recalculate the average rating based on the updated reviews
            const updatedReviews = [...reviews, { ...review, id: docRef.id }];
            const newAverageRating = calculateAverageRating(updatedReviews);
            setAverageRating(newAverageRating);

            // Resetting the form fields
            setReviewText('');
            setFoodRating(0);
            // ... reset other ratings as needed
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Error submitting review.');
        }
    };

    // Slider behaviour
    const reviewSliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        vertical: true,
        arrows: true,
        verticalSwiping: true,
        nextArrow: <UpArrow />,
        prevArrow: <DownArrow />,
        beforeChange: (current, next) => setSlideIndex(next) // Update state with current slide index
    };

    function UpArrow(props) {
        const { style, onClick, currentSlide, slideCount } = props;
        if (slideCount <= 1) return null;  // Hide if one or no reviews
        return (
            <div
                style={{ ...style, display: currentSlide === slideCount - 1 ? 'none' : 'block', fontSize: '24px' }} // Hide on last slide

                onClick={onClick}
            >
                &#9660; {/* Unicode upward triangle */}

            </div>
        );
    }

    function DownArrow(props) {
        const { style, onClick, currentSlide } = props;
        return (
            <div
                style={{ ...style, display: currentSlide === 0 ? 'none' : 'block', fontSize: '24px' }} // Hide on first slide
                onClick={onClick}
            >
                &#9650; {/* Unicode downward triangle */}
            </div>
        );
    }

    const StarRating = ({ rating, setRating }) => {
        return (
            <div className="star-rating">
                {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;

                    return (
                        <span
                            key={ratingValue}
                            className={`star ${ratingValue <= (hover || rating) ? 'on' : ''}`}
                            onClick={() => setRating(ratingValue)}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(rating)}
                        >
                            &#9733; {/* Unicode star character */}
                        </span>
                    );
                })}
            </div>
        );
    };

    const ReadOnlyStars = ({ rating }) => {
        // Convert rating to a number and round to nearest half
        const roundedRating = Math.round(rating * 2) / 2;

        return (
            <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < roundedRating ? 'on' : i === roundedRating - 0.5 ? 'half' : 'off'}`}>
                        {i === roundedRating - 0.5 ? <>&#9734;</> : <>&#9733;</>} {/* Display half star or full star */}
                    </span>
                ))}
            </div>
        );
    };

    const AverageRating = ({ rating, reviewCount }) => {
        // Parse the rating to a number and clamp it between 0 and 5
        const numericRating = parseFloat(rating);
        const clampedRating = Math.max(0, Math.min(numericRating, 5));

        // Calculate the number of full stars
        const fullStars = Math.floor(clampedRating);
        // Check if there should be a half star
        const halfStar = clampedRating % 1 >= 0.5 ? 1 : 0;
        // The rest are empty stars
        const emptyStars = 5 - fullStars - halfStar;

        return (
            <div className="average-rating">
                {[...Array(fullStars)].map((_, i) => (
                    <span key={i} className="star on">&#9733;</span>
                ))}
                {halfStar ? <span className="star half">&#9733;</span> : null}
                {[...Array(emptyStars)].map((_, i) => (
                    <span key={i} className="star off">&#9733;</span>
                ))}
                <span className="average-rating-value">{clampedRating.toFixed(1)}</span>
                <span className="review-count">{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</span>
            </div>
        );
    };


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

    // Before component return statement, adjust the settings based on food images availability
    const adjustedSettings = {
        ...settings,
        // Set arrows to false if no images or array is empty
        arrows: chefDetail.foodImage?.length > 0,
    };

    const defaultImage = 'https://dl.dropbox.com/scl/fi/rpn385ekm39c8spf7aret/imagem_2024-03-31_201209793.png?rlkey=bdyv4ryb21d2cvn7ujjdzcdga&';
    const defaultFoodImage = 'https://dl.dropbox.com/scl/fi/yq1xrou3e4pbq9jky4mc6/defaultFoodImage.png?rlkey=nzfu3ev5vrw9lof2o494p4x06&'

    return (
        <div>
            <ToastContainer position="bottom-center" />
            <div className="chef-detail">
                <div className='chef-detail-header'>
                    <button className='back-button' onClick={() => navigate(-1)}>&lt; All chefs</button>
                    {isChef && (
                        <button className='edit-profile-button' onClick={() => setIsEditMode(!isEditMode)}>
                            {isEditMode ? 'View Profile' : 'Edit Profile'}
                        </button>
                    )}
                </div>
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
                                    <pre className="chef-bio">{chefDetail.bio}</pre> {/* Use <pre> tag for preserving whitespace and line breaks */}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="specialties">
                    <h2>Specialties</h2>
                </div>


                <div className="slider-container">
                    <Slider {...adjustedSettings}>
                        {chefDetail.foodImage?.map((image, index) => (
                            <div key={index} className="chef-food-image">
                                <img src={image || defaultFoodImage} alt={`Food ${index + 1}`} />
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



                    <div className="average-rating-container">
                        <AverageRating rating={averageRating} reviewCount={reviews.length} />
                    </div>

                    <div className="review-list">
                        <Slider {...reviewSliderSettings}
                            slideCount={reviews.length}
                            currentSlide={slideIndex}>
                            {reviews.map((review, index) => (
                                <div className="review-item" key={index}>
                                    <div className="review-avatar">
                                        <img src={review.profilePicture || defaultImage} alt={review.name || 'User'} />
                                    </div>
                                    <div className="review-content">
                                        <p className="review-author">{review.name || 'Anonymous'}</p>
                                        {/* Check if review.date exists and is a Firestore Timestamp */}
                                        <p className="review-date">{review.date?.toDate ? review.date.toDate().toDateString() : 'Unknown date'}</p>
                                        <p className="review-comment">{review.comment}</p>
                                        <div className="review-rating"><ReadOnlyStars rating={review.foodRating} /></div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <form className="review-form" onSubmit={submitReview}>
                        <h4>If you had a culinary experience with this chef leave a review!</h4>
                        <textarea
                            className="input-edit"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Your review"
                        />
                        {/* Rating Inputs */}
                        <div className="rating-input">
                            <StarRating rating={foodRating} setRating={setFoodRating} />

                            {/*  <input
                            className="input-edit"
                            type="number"
                            value={foodRating}
                            onChange={(e) => setFoodRating(e.target.value)}
                            placeholder="Food rating"
                        />*/}
                            {/* Repeat for other ratings 
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
                        />*/}
                        </div>
                        <button className="button-edit" onClick={submitReview}>Submit Review</button>
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
                    <button className="send-message" onClick={handleSendClick}>Send Message</button>
                </div>
            </div>
        </div>
    );
}

export default ChefDetail; // Export the component for use in other parts of the app