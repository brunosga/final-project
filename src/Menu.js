import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase'; // Adjust the path if needed
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const Menu = ({ closeMenu }) => {
    const navigate = useNavigate();
    const { isLoggedIn, handleLogout: contextHandleLogout } = useAuth();
    const [isChef, setIsChef] = useState(false);
    const [chefId, setChefId] = useState(null); // Store chef's ID

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const chefDocRef = doc(db, 'chefs', user.uid);
                const chefDocSnap = await getDoc(chefDocRef);
                setIsChef(chefDocSnap.exists());
                if (chefDocSnap.exists()) {
                    setChefId(user.uid); // Set chef's ID
                }
            } else {
                setIsChef(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await contextHandleLogout(); // Sign out
        navigate('/login'); // Redirect to the login page
        closeMenu(); // Close the menu
    };

    return (
        <div className="backdrop" onClick={closeMenu}>
            <div className="menu" onClick={(e) => e.stopPropagation()}>
                <div className="close-icon" onClick={closeMenu}>&times;</div>
                {isLoggedIn && (
                    <>
                        {/* Conditionally render "My Profile" based on user role */}
                        {isChef ? (
                            <div className="my-profile" onClick={() => navigate(`/chef/${chefId}`)}>My Profile</div>
                        ) : (
                            <a href="/profile">My Profile</a>
                        )}
                        <a href="/settings">Settings</a>
                        <a href="/login" onClick={handleLogout}>Logout</a>
                    </>
                )}
                {!isLoggedIn && <a href="/login">Login</a>}
                <a href="/about">About</a>
                <div className="menu-footer">
                    <div className="logo2" onClick={() => navigate(`/home`)}>
                            <img src="https://dl.dropbox.com/scl/fi/pxvag5jnp4mq1nm4g7ixz/logo2w-1.png?rlkey=vahz32bbdru09hchtzuxtoz8z&" alt="Logo" />     
                    </div>
                    <a href="/privacy">Privacy & Legal</a>
                </div>
            </div>
        </div>
    );
};

export default Menu;
