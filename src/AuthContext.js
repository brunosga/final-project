// Import necessary dependencies
import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(''); // Added state for user role
    const [userId, setUserId] = useState(''); // Added state for user ID

    // Effect hook to monitor authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLoggedIn(true);
                setUserId(user.uid); // Set the user ID
                // Fetch user role from Firestore (or your method of storing user roles)
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setUserRole(userDoc.data().role); // Assuming the role is stored in the user document
                }
            } else {
                setIsLoggedIn(false);
                setUserRole('');
                setUserId('');
            }
        });

        return () => unsubscribe();
    }, []);

    // Function to handle logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false);
            setUserRole(''); // Clear user role on logout
            setUserId(''); // Clear user ID on logout
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, handleLogout, userRole, userId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext); // Custom hook to use the auth context