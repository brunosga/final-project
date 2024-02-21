import React from 'react';
import './App.css';

const ChatMenu = ({ isOpen, closeChat }) => {
  if (!isOpen) return null;

  return (
    <div className="chat-menu">
      <header className="chat-menu-header">
        <h2>Chats</h2>
        <div className="close-icon" onClick={closeChat}>&times;</div>
      </header>
      <ul className="chat-list">
        {/* Placeholder for chat list items */}
        <li>Chat 1</li>
        <li>Chat 2</li>
        {/* Dynamically render chat items here */}
      </ul>
      <form className="send-message-form">
        <input type="text" placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatMenu;
