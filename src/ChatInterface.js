// Some parts that are commented in this file is gonna be explained on the final report of the project

// Import necessary dependencies
import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from './ChatContext';
import { fetchChatThreads } from './ChatService';
import MessageArea from './MessageArea';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase'; 
import './css/ChatInterface.css'; 

function ChatInterface() {
  const { isChatVisible, toggleChatVisibility, activeChatId,  setActiveChatId } = useContext(ChatContext);
  const [user] = useAuthState(auth); // This hook gives you the current user from Firebase Auth
  const [chatThreads, setChatThreads] = useState([]);
  console.log('Chat Interface is rendering, visibility:', isChatVisible);
    const [participantDetails, setParticipantDetails] = useState(null);

  // Define currentUserId outside of useEffect
 // const currentUserId = 'x8rab3bFXeX2yHvEQxv9LvSEsdp2'; 

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
  if (chatThreads.length > 0) {
    return chatThreads.map((thread) => (
      <ChatThread
        key={thread.id}
        thread={thread}
        onSelect={handleSelectChat}
        participantDetails={participantDetails} // Pass participantDetails as a prop
      />
    ));
  } else {
    // Display a message when there are no chat messages
    return (
      <div className="no-chat-threads">
        You don't have any messages.
      </div>
    );
  }
};

  return (
    <div className={`chat-interface ${isChatVisible ? 'visible' : 'hidden'}`}>
      <div className="chat-header">
        <div onClick={toggleChatVisibility} className="close-button">
        &times;
        </div>
      </div>
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
  const lastMessageDate = thread.lastMessageTimestamp?.toDate();
  return (
    <div className="chat-thread" onClick={() => onSelect(thread.id)}>
      <div className="chat-info">
        <img src={details.image || defaultImage} alt={details.name || 'Unknown User'} className="chat-avatar" />
        <div className="chat-name">{details.name || 'Unknown User'}</div>
        <div className="chat-last-message">{thread.lastMessage || 'No message'}</div>
      <div className="chat-timestamp">{lastMessageDate ? lastMessageDate.toLocaleString() : 'No recent activity'}</div>
      </div>
    </div>
  );
}

export default ChatInterface; // Export the component for use in other parts of the app