// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 
import { db, auth } from './firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { onAuthStateChanged } from 'firebase/auth'; 

// Menu component definition, accepts a prop for closing the menu
const Menu = ({ closeMenu }) => {
    const navigate = useNavigate(); // Hook for navigation
    const { isLoggedIn, handleLogout: contextHandleLogout } = useAuth(); // Destructuring isLoggedIn and handleLogout from useAuth custom hook
    const [isChef, setIsChef] = useState(false);  // State to track if the current user is a chef
    const [chefId, setChefId] = useState(null); // Store chef's ID

    // Effect to check if the logged-in user is a chef
    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // If a user is signed in, check if they are listed in the 'chefs' collection
                const chefDocRef = doc(db, 'chefs', user.uid);
                const chefDocSnap = await getDoc(chefDocRef);
                setIsChef(chefDocSnap.exists());
                if (chefDocSnap.exists()) {
                    setChefId(user.uid); // Store chef's ID if the user is a chef
                }
            } else {
                // If no user is signed in, set isChef to false
                setIsChef(false);
            }
        });

        // Cleanup function to unsubscribe from auth state changes
        return () => unsubscribe();
    }, []);

    // Handle user logout
    const handleLogout = async () => {
        await contextHandleLogout(); // Logout using the method provided by useAuth
        navigate('/login'); // Redirect to the login page
        closeMenu(); // Close the menu
    };

    return (
        // The backdrop div closes the menu when clicked
        <div className="backdrop" onClick={closeMenu}>
            {/* Prevents menu close when clicking inside the menu area */}
            <div className="menu" onClick={(e) => e.stopPropagation()}>
                <div className="close-icon" onClick={closeMenu}>&times;</div>
                {isLoggedIn && (
                    <>
                        {/* Conditionally render "My Profile" based if the user is a chef or regular user */}
                        {isChef ? (
                            // If the user is a chef, navigate to the chef profile
                            <div className="my-profile" onClick={() => navigate(`/chef/${chefId}`)}>My Profile</div>
                        ) : (
                            // If the user is not a chef, link to a generic profile page
                            <a href="/profile">My Profile</a>
                        )}
                        <a href="/login" onClick={handleLogout}>Logout</a>
                    </>
                )}
                {/* Show login link if the user is not logged in */}
                {!isLoggedIn && <a href="/login">Login</a>}
                {/* Link to about page */}
                <a href="/about">About</a>
                {/* Footer with the logo, navigates to home when clicked */}
                <div className="menu-footer">
                    <div className="logo2" onClick={() => navigate(`/home`)}>
                        <img src="https://dl.dropbox.com/scl/fi/pxvag5jnp4mq1nm4g7ixz/logo2w-1.png?rlkey=vahz32bbdru09hchtzuxtoz8z&" alt="Logo" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu; // Export the component for use in other parts of the app
