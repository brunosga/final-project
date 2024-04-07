// Import necessary dependencies
import React, { useContext, useState, useEffect, useRef } from 'react';
import { sendMessage, subscribeToMessages } from './ChatService'; 
import { ChatContext } from './ChatContext'; 
import { auth, db } from './firebase'; 
import { getDoc, doc } from 'firebase/firestore'; 
import { useAuthState } from 'react-firebase-hooks/auth'; 
import './css/MessageArea.css'; 

// The MessageArea component handles the display and sending of messages within a chat thread
function MessageArea({ activeChatId, selectedThread }) {
  const [user] = useAuthState(auth); // State hook to manage current user via Firebase authentication
  const { setActiveChatId } = useContext(ChatContext); // Accessing context to manage active chat ID
  const [currentMessages, setCurrentMessages] = useState([]); // State for managing the array of messages and the current message being typed
  const [newMessage, setNewMessage] = useState('');   // State for managing new messages
  const [participantDetails, setParticipantDetails] = useState(null); // State for storing details about the chat participant (other than the current user)
  const messageListRef = useRef(null); // Ref for auto-scrolling message list container to the bottom


  // Function to always show the most recent message
  const scrollToBottom = () => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  };

  // Effect hook to subscribe to new messages in the current chat and clean up on component unmount
  useEffect(() => {
    let unsubscribe = () => { };

    if (activeChatId) {
      unsubscribe = subscribeToMessages(activeChatId, (messages) => {
        const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
        setCurrentMessages(sortedMessages);
      });
    }

    return () => unsubscribe();
  }, [activeChatId]);

  // Effect hook to scroll to bottom immediately after the first render and when the currentMessages state updates
  useEffect(() => {
    if (currentMessages.length) {
      scrollToBottom();
    }
  }, [currentMessages]);

  useEffect(() => {
    let unsubscribe = () => { };

    if (activeChatId) {
      unsubscribe = subscribeToMessages(activeChatId, setCurrentMessages);
    }

    return () => unsubscribe(); // Clean up subscription
  }, [activeChatId]);

  // Effect hook to fetch details of the other participant in the chat based on activeChatId and current user
  useEffect(() => {
    const fetchParticipantDetails = async () => {
      if (activeChatId && user) {
        const chatDocRef = doc(db, 'chats', activeChatId);
        const chatDocSnap = await getDoc(chatDocRef);

        if (chatDocSnap.exists()) {
          const chatData = chatDocSnap.data();
          const otherParticipantId = chatData.participantsIds.find(id => id !== user.uid);

          let participantDocRef = doc(db, 'users', otherParticipantId);
          let participantDocSnap = await getDoc(participantDocRef);

          // If not found in 'users', try 'chefs' collection
          if (!participantDocSnap.exists()) {
            participantDocRef = doc(db, 'chefs', otherParticipantId);
            participantDocSnap = await getDoc(participantDocRef);
          }

          if (participantDocSnap.exists()) {
            setParticipantDetails(participantDocSnap.data());
          } else {
            console.log('Participant details not found.');
            setParticipantDetails(null);
          }
        } else {
          console.log('Chat document not found.');
          setParticipantDetails(null);
        }
      }
    };

    fetchParticipantDetails();
  }, [activeChatId, user]);

  // Handle Enter key press in input to send message
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Function to send a new message
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      // Assuming `auth.currentUser.uid` gives the current user's ID
      const userId = auth.currentUser.uid;

      // Fetch the user's full name from the 'users' collection
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userName = userDoc.exists() ? userDoc.data().fullName : null;

      // Fetch the chef's name and image from the 'chefs' collection using the chef's ID
      const chefDoc = await getDoc(doc(db, 'chefs', activeChatId));
      const chefName = chefDoc.exists() ? chefDoc.data().name : null;
      const chefImage = chefDoc.exists() ? chefDoc.data().chefImage : null;

      // Call the sendMessage function with the fetched names and image
      sendMessage(activeChatId, newMessage, userId, userName, chefName, chefImage);
      setNewMessage('');
    }
  };

  // Function to handle navigation back to the chat list
  const handleBack = () => {
    setActiveChatId(null); // Clear the active chat ID to return to the chat list
  };

  // When fetching and setting messages, sort them by timestamp
  useEffect(() => {
    let unsubscribe = () => { };

    if (activeChatId) {
      unsubscribe = subscribeToMessages(activeChatId, (messages) => {
        const sortedMessages = messages.sort((a, b) => a.timestamp - b.timestamp);
        setCurrentMessages(sortedMessages);
        // Scroll to bottom after messages state is updated
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      });
    }

    return () => unsubscribe(); // Clean up subscription
  }, [activeChatId]);

  const defaultImage = 'https://dl.dropbox.com/scl/fi/rpn385ekm39c8spf7aret/imagem_2024-03-31_201209793.png?rlkey=bdyv4ryb21d2cvn7ujjdzcdga&'; // Define a placeholder image URL

  return (
    <div className="message-area">
      <div className="message-header">
        <button onClick={handleBack} className="back-btn">&lt;</button>
        <img
          src={participantDetails?.chefImage || participantDetails?.image || defaultImage} // If doesn't find the main image it will try the other and so on
          alt={participantDetails?.name || participantDetails?.fullName || 'Unknown User'}
          className="message-avatar"
        />
        <div className="message-name">{participantDetails?.name || participantDetails?.fullName || 'Unknown User'}</div>
      </div>
      <div className="message-list" ref={messageListRef}>
        {currentMessages.map((msg
        ) => {
          const isSent = msg.senderId === auth.currentUser.uid; // Determine if the message was sent by the current user
          return (
            <div key={msg.id} className={`message-item ${isSent ? 'sent' : 'received'}`}>
              <div className="message-content">

                <p className="message-text">{msg.text}</p>

                <span className="message-date">{msg.timestamp?.toDate().toLocaleTimeString()}</span>

              </div>
            </div>
          );
        })}
      </div>
      <div className="message-input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message..."
          className="message-input"
          onKeyDown={handleKeyDown} // Add keyDown event handler here
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageArea; // Export the component for use in other parts of the app