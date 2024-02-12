// AuthPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc, getDocs, collection, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import './App.css';

// Initialize Firestore
const db = getFirestore();

const AuthPage = () => {
    // State hooks
    const [isLogin, setIsLogin] = useState(true);
    const [isChef, setIsChef] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [cuisines, setCuisines] = useState([]);
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const navigate = useNavigate();



    // Toggle between login and signup form
    const toggleAuthMode = () => {
        setIsLogin(!isLogin); // This toggles the state between true and false
        setIsChef(false); // Reset chef toggle when switching forms
        setFormErrors({}); // Clear any form errors
        // Additionally, you might want to clear form inputs as well
        setEmail('');
        setPassword('');
        setFullName('');
    };

    // Input change handlers
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleFullNameChange = (e) => setFullName(e.target.value);

    // Fetch cuisine types from Firestore
    useEffect(() => {
        const fetchCuisines = async () => {
            // Assuming "cuisines" is the name of your collection
            const querySnapshot = await getDocs(collection(db, "cuisines"));
            const cuisineOptions = [];
            querySnapshot.forEach((doc) => {
                // Push document data along with doc.id to the cuisineOptions array
                cuisineOptions.push({ id: doc.id, ...doc.data() });
            });
            setCuisines(cuisineOptions);
        };

        fetchCuisines();
    }, []);

    // Function to handle cuisine selection
    const handleCuisineChange = (cuisineId) => {
        setSelectedCuisines(prevSelectedCuisines => {
            if (prevSelectedCuisines.includes(cuisineId)) {
                return prevSelectedCuisines.filter(id => id !== cuisineId);
            } else {
                return [...prevSelectedCuisines, cuisineId];
            }
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (validateForm()) {
             // Check if at least one cuisine is selected when signing up as a chef
             if (isChef && selectedCuisines.length === 0) {
                setFormErrors(errors => ({...errors, cuisine: "Choose at least one cuisine"}));
                return; // Stop the signup process if no cuisines are selected
            }
            try {
                // Create new user with Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Ensure that selectedCuisines are defined and mapped properly
            //    const selectedCuisineIds = selectedCuisines.map(cuisine => cuisine.id).filter(id => id !== undefined);

                // Create user profile object
                const chefProfile = {
                    id: user.uid,
                    email: email,
                    fullName: fullName || '',
                    bio: '',
                    cuisineType: selectedCuisines, // Use the array of selected cuisine IDs
                    chefImage: '',
                    foodImage: [],
                    price: ''

                };

                const userProfile = {
                    id: user.uid,
                    email: email,
                    fullName: fullName || '',
                };

                // If signing up as a chef, handle the permissions or roles accordingly
                if (isChef) {
                    console.log('Creating account as:', isChef ? 'Chef' : 'Regular user');

                    // Check if userProfile has all the required fields
                    if (Object.values(userProfile).some(value => value === undefined)) {
                        console.error('Some user profile information is undefined.');
                        return;
                    }

                    // Add to 'chefs' collection
                    await setDoc(doc(db, "chefs", user.uid), chefProfile);
                    // Redirect to the chef's profile page after a short delay
                    setTimeout(() => {
                        navigate(`/chef/${user.uid}`); // Modify this URL to your profile page's path
                    }, 2000);

                } else {
                    console.log('Creating account as:', isChef ? 'Chef' : 'Regular user');
                    // Add to 'users' collection
                    await setDoc(doc(db, "users", user.uid), userProfile);
                    // Redirect to the homepage or user's profile page if needed
                    setTimeout(() => {
                        navigate('/'); // Modify as needed
                    }, 2000);
                }

                // On successful signup, handle the user's session or redirect to the homepage/dashboard
                console.log('User signed up successfully', userCredential);

                // Set success message based on the user role
                const successMsg = isChef ? 'Chef account created successfully! Redirecting to profile...' : 'Account created successfully! Redirecting to homepage...';
                setSuccessMessage(successMsg);

            } catch (error) {
                // Handle errors, such as email already in use
                setFormErrors({ auth: error.message });
                console.error('Signup error:', error);
            }
        }
    };

    // Form submission handlers
    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Sign in existing user with Firebase Authentication
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Check if the signed-in user is a chef
                const chefDocRef = doc(db, "chefs", user.uid);
                const chefDocSnap = await getDoc(chefDocRef);

                if (chefDocSnap.exists()) {
                    // User is a chef, navigate to chef's profile page
                    navigate(`/chef/${user.uid}`);
                } else {
                    // User is a regular user, navigate to the cuisines page
                    navigate('/cuisines');
                }
                console.log('User logged in successfully');
               
            } catch (error) {
                // Handle errors, such as incorrect password or no user found
                setFormErrors({ auth: error.message });
                console.error('Login error:', error);
            }
        }
    };

   /* const toggleCuisineSelection = (cuisineId) => {
        setSelectedCuisines(prevSelectedCuisines => {
            if (prevSelectedCuisines.includes(cuisineId)) {
                // If already selected, remove it from the array
                return prevSelectedCuisines.filter(id => id !== cuisineId);
            } else {
                // Otherwise, add it to the array
                return [...prevSelectedCuisines, cuisineId];
            }
        });
    };*/

    // Chef toggle handler
    const handleChefToggle = () => setIsChef(!isChef);

    // Validation logic
    const validateForm = () => {
        let errors = {};
        let formIsValid = true;

        // Email validation
        if (!email) {
            formIsValid = false;
            errors["email"] = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formIsValid = false;
            errors["email"] = "Email is not valid";
        }

        // Password validation
        if (!password) {
            formIsValid = false;
            errors["password"] = "Password is required";
        } else if (password.length < 6) {
            formIsValid = false;
            errors["password"] = "Password must be at least 6 characters";
        } else if (!/\d/.test(password)) {
            formIsValid = false;
            errors["password"] = "Password must contain a number";
        }

        setFormErrors(errors);
        return formIsValid;
    };

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                // User is signed in
                console.log('User is signed in:', user);
            } else {
                // User is signed out
                console.log('User is signed out');
                // You can handle the logged out state here
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Render method
    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-header">{isLogin ? 'Login to Dining In' : 'Join Dining In'}</h2>
                <div className="auth-toggle">
                    <button
                        className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => toggleAuthMode()}
                    >
                        Login
                    </button>
                    <button
                        className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => toggleAuthMode()}
                    >
                        Join
                    </button>
                </div>
                <form onSubmit={isLogin ? handleLogin : handleSignup} className="auth-form">
                    {!isLogin && (
                        <label className="checkboxLabel">
                            <input
                                type="checkbox"
                                checked={isChef}
                                onChange={handleChefToggle}
                                className="form-checkbox"
                            />
                            <span className="asChef">Joining as a chef?</span>
                        </label>
                    )}
                    {!isLogin && isChef && (
                        <div className="cuisine-select-container">
                            <label>Choose your cuisine types:</label>
                            {cuisines.map(cuisine => (
                                <div key={cuisine.id} className="custom-checkbox">
                                    <input
                                        type="checkbox"
                                        id={`cuisine-${cuisine.id}`}
                                        className="custom-checkbox-input"
                                        checked={selectedCuisines.includes(cuisine.id)}
                                        onChange={() => handleCuisineChange(cuisine.id)}
                                    />
                                    <label htmlFor={`cuisine-${cuisine.id}`} className="custom-checkbox-label">{cuisine.name}</label>
                                </div>
                            ))}
                        </div>
                    )}


                    {!isLogin && (
                        <input
                            type="text"
                            value={fullName}
                            onChange={handleFullNameChange}
                            placeholder="Your full name"
                            className="auth-input"
                        />
                    )}
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Your email"
                        className="auth-input"
                    />
                    {formErrors.email && <p className="error-message">{formErrors.email}</p>}

                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Password"
                        className="auth-input"
                    />
                    {formErrors.password && <p className="error-message">{formErrors.password}</p>}

                    <button type="submit" className="auth-submit">
                        {isLogin ? 'Login' : 'Join'}
                    </button>

                    {successMessage && <div className="success-message">{successMessage}</div>}

                    {formErrors.auth && <p className="error-message">{formErrors.auth}</p>}

                    {formErrors.cuisine && <p className="error-message">{formErrors.cuisine}</p>}
                </form>
            </div >
        </div >
    );
};

export default AuthPage;