import React from 'react';

const Menu = ({ closeMenu }) => {
    return (
        <div className="backdrop" onClick={closeMenu}>
            <div className="menu" onClick={e => e.stopPropagation()}>
                <div className="close-icon" onClick={closeMenu}>&times;</div>
                <a href="/messages">Messages</a>
                <a href="/profile">My Profile</a>
                <a href="/settings">Settings</a>
                <a href="/logout">Log Out</a>
                <a href="/about">About</a>
                <div className="menu-footer">
                    <div className="logo">LOGO</div>
                    <a href="/privacy">Privacy & Legal</a>
                </div>
            </div>
        </div>
    );
}

export default Menu;
