// ChatInterface.js
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from './ChatContext';
import { fetchChatThreads } from './ChatService';
import MessageArea from './MessageArea';
import './css/ChatInterface.css'; // Make sure this path is correct

function ChatInterface() {
  const { isChatVisible, toggleChatVisibility, activeChatId,  setActiveChatId } = useContext(ChatContext);
  const [chatThreads, setChatThreads] = useState([]);
  console.log('Chat Interface is rendering, visibility:', isChatVisible);

  // Define currentUserId outside of useEffect
  const currentUserId = 'x8rab3bFXeX2yHvEQxv9LvSEsdp2'; // Replace with actual user ID logic

// Handle selecting a chat
const handleSelectChat = (chatId) => {
  setActiveChatId(chatId);
};

  useEffect(() => {
    let unsubscribe = () => {};

    if (isChatVisible) {
      console.log('Setting up chat threads subscription for user:', currentUserId);
      unsubscribe = fetchChatThreads(currentUserId, setChatThreads);
    }

    return () => {
      console.log('Unsubscribing from chat threads');
      unsubscribe();
    };
  }, [isChatVisible, currentUserId]);

  if (!chatThreads.length) {
    return <div className="chat-interface">No chat threads available</div>;
  }

  return (
    <div className={`chat-interface ${isChatVisible ? 'visible' : 'hidden'}`}>
      <header className="chat-header">
        <span>Messages</span>
        <button onClick={toggleChatVisibility} className="close-button">
          X
        </button>
      </header>
      <div className="chat-threads">
      {chatThreads.map((thread) => (
          <ChatThread key={thread.id} thread={thread} onSelect={handleSelectChat} />
        ))}
      </div>
      {activeChatId && <MessageArea activeChatId={activeChatId} />}
    </div>
  );
}

function ChatThread({ thread, onSelect}) {
  // Simplified content for debugging
  return (
    <div className="chat-thread" onClick={() => onSelect(thread.id)}>
      <div className="chat-info">
        <div className="chat-name">{thread.name || 'Unknown User'}</div>
        <div className="chat-last-message">{thread.lastMessage || 'No message'}</div>
        <div className="chat-timestamp">{new Date(thread.lastMessageTimestamp?.seconds * 1000).toLocaleString()}</div>
      </div>
    </div>
  );
}

export default ChatInterface;