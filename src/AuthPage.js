// AuthPage.js
import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc} from 'firebase/firestore';
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

    // Form submission handlers
    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Sign in existing user with Firebase Authentication
                await signInWithEmailAndPassword(auth, email, password);
                // On successful login, handle the user's session or redirect to the homepage/dashboard
                console.log('User logged in successfully');
                // Redirect to home/dashboard or handle login session
            } catch (error) {
                // Handle errors, such as incorrect password or no user found
                setFormErrors({ auth: error.message });
                console.error('Login error:', error);
            }
        }
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Create new user with Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Create user profile object
                const userProfile = {
                    uid: user.uid,
                    email: email,
                    fullName: fullName
                };

                // If signing up as a chef, handle the permissions or roles accordingly
                if (isChef) {
                    console.log('Creating account as:', isChef ? 'Chef' : 'Regular user');

                    // Add to 'chefs' collection
                    await setDoc(doc(db, "chefs", user.uid), userProfile);
                    // Additional chef-specific setup can go here
                } else {
                    console.log('Creating account as:', isChef ? 'Chef' : 'Regular user');

                    // Add to 'users' collection
                    await setDoc(doc(db, "users", user.uid), userProfile);
                }

                // On successful signup, handle the user's session or redirect to the homepage/dashboard
                console.log('User signed up successfully', userCredential);

                // Redirect to home/dashboard or handle login session
            } catch (error) {
                // Handle errors, such as email already in use
                setFormErrors({ auth: error.message });
                console.error('Signup error:', error);
            }
        }
    };

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

   //  const navigate = useNavigate();

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
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

                    <button type="submit" className="auth-submit">
                        {isLogin ? 'Login' : 'Join'}
                    </button>
                    {formErrors.auth && <p className="error-message">{formErrors.auth}</p>}
                </form>
            </div>
        </div>
    );
};
export default AuthPage;

