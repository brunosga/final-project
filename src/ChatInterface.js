// ChatInterface.js
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from './ChatContext';
import { fetchChatThreads } from './ChatService';
import MessageArea from './MessageArea';
import { useAuthState } from 'react-firebase-hooks/auth'; // Hook from react-firebase-hooks
import { auth } from './firebase'; // Assuming this is where your Firebase auth object is
import './css/ChatInterface.css'; // Make sure this path is correct

function ChatInterface() {
  const { isChatVisible, toggleChatVisibility, activeChatId,  setActiveChatId } = useContext(ChatContext);
  const [user] = useAuthState(auth); // This hook gives you the current user from Firebase Auth
  const [chatThreads, setChatThreads] = useState([]);
  console.log('Chat Interface is rendering, visibility:', isChatVisible);
    const [participantDetails, setParticipantDetails] = useState(null);

  // Define currentUserId outside of useEffect
 // const currentUserId = 'x8rab3bFXeX2yHvEQxv9LvSEsdp2'; // Replace with actual user ID logic

// Handle selecting a chat
const handleSelectChat = (chatId) => {
  setActiveChatId(chatId);
};

useEffect(() => {
  // Here we call the modified fetchChatThreads which now includes participant details
  if (user && isChatVisible) {
    const unsubscribe = fetchChatThreads(user.uid, (threads) => {
      setChatThreads(threads);
      // Prepare participant details object for easy access in ChatThread component
      const details = {};
      threads.forEach(thread => {
        details[thread.id] = {
          name: thread.participantName,
          image: thread.participantImage,
        };
      });
      setParticipantDetails(details);
    });

    return () => unsubscribe();
  }
}, [user, isChatVisible]);

// Ensure chat threads exist before rendering them
const renderChatThreads = () => {
  return chatThreads.length > 0 ? (
    chatThreads.map((thread) => (
      <ChatThread
        key={thread.id}
        thread={thread}
        onSelect={handleSelectChat}
        participantDetails={participantDetails} // Pass participantDetails as a prop
      />
    ))
  ) : (
    <div className="chat-interface">No chat threads available</div>
  );
};

  return (
    <div className={`chat-interface ${isChatVisible ? 'visible' : 'hidden'}`}>
      <header className="chat-header">
        <span>Messages</span>
        <button onClick={toggleChatVisibility} className="close-button">
          X
        </button>
      </header>
      <div className="chat-threads">
        {renderChatThreads()}
      </div>
      {activeChatId && <MessageArea activeChatId={activeChatId} />}
    </div>
  );
}

const defaultImage = 'https://dl.dropbox.com/scl/fi/rpn385ekm39c8spf7aret/imagem_2024-03-31_201209793.png?rlkey=bdyv4ryb21d2cvn7ujjdzcdga&'; // Define a placeholder image URL

function ChatThread({ thread, onSelect, participantDetails }) {
  const details = participantDetails[thread.id] || {};
  return (
    <div className="chat-thread" onClick={() => onSelect(thread.id)}>
      <div className="chat-info">
        <img src={details.image || defaultImage} alt={details.name || 'Unknown User'} className="chat-avatar" />
        <div className="chat-name">{details.name || 'Unknown User'}</div>
        <div className="chat-last-message">{thread.lastMessage || 'No message'}</div>
        <div className="chat-timestamp">{thread.lastMessageTimestamp?.toDate().toLocaleString()}</div>
      </div>
    </div>
  );
}

export default ChatInterface;