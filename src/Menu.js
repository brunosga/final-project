import React from 'react';
import { useAuth } from './AuthContext'; // Adjust the path as necessary
import { useNavigate } from 'react-router-dom';

const Menu = ({ closeMenu }) => {
    const navigate = useNavigate();
    const { isLoggedIn, handleLogout: contextHandleLogout } = useAuth();

    // This function wraps around the context's handleLogout to include navigation and closing the menu
    const handleLogout = async () => {
        await contextHandleLogout(); // Sign out
        navigate('/home/'); // Redirect to the home page or login page
        closeMenu(); // Close the menu
    };

    return (
        <div className="backdrop" onClick={closeMenu}>
            <div className="menu" onClick={e => e.stopPropagation()}>
                <div className="close-icon" onClick={closeMenu}>&times;</div>
                {isLoggedIn ? (
                    <>
                        <a href="/messages">Messages</a>
                        <a href="/profile">My Profile</a>
                        <a href="/settings">Settings</a>
                        <a href="/" onClick={handleLogout}>Logout</a>
                    </>
                ) : (
                    <a href="/login">Login</a>
                )}
                <a href="/about">About</a>
                <div className="menu-footer">
                    <div className="logo">LOGO</div>
                    <a href="/privacy">Privacy & Legal</a>
                </div>
            </div>
        </div>
    );
};

export default Menu;