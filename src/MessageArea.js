// MessageArea.js
import React, { useContext, useState, useEffect } from 'react';
import { sendMessage, subscribeToMessages } from './ChatService'; // These are your custom functions to handle messages
import { ChatContext } from './ChatContext'; // Import the ChatContext
import { auth, db } from './firebase';
import { getDoc, doc } from 'firebase/firestore'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import './css/MessageArea.css';


function MessageArea({ activeChatId }) {
  const [user] = useAuthState(auth);
  const { setActiveChatId } = useContext(ChatContext); // Access the setActiveChatId function from context
  const [currentMessages, setCurrentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
 // const [currentUser, setCurrentUser] = useState(null);
  const [participantDetails, setParticipantDetails] = useState(null); 
 

  useEffect(() => {
    let unsubscribe = () => { };

    if (activeChatId) {
      unsubscribe = subscribeToMessages(activeChatId, setCurrentMessages);
    }

    return () => unsubscribe(); // Clean up subscription
  }, [activeChatId]);

  /*  // New useEffect to fetch user details (user name and avatar)
   useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        // If the user is a chef, you'd fetch from the 'chefs' collection instead
        const userDetails = userDoc.exists() ? userDoc.data() : null;
        setCurrentUser(userDetails); // You'll need to add this state to your component
      }
    };

    fetchUserDetails();
  }, [user]); */
  

  /* useEffect(() => {
    const fetchParticipantDetails = async () => {
      if (activeChatId && user) {
        console.log(`Active chat ID: ${activeChatId}`);
        const chatDocRef = doc(db, 'chats', activeChatId);
        const chatDocSnap = await getDoc(chatDocRef);

        if (chatDocSnap.exists()) {
          const chatData = chatDocSnap.data();
          console.log(`Chat data: ${JSON.stringify(chatData)}`);
          
          const otherParticipantId = chatData.participantsIds.find(id => id !== user.uid);
          console.log(`Other participant ID: ${otherParticipantId}`);
          
          // Try fetching from 'users' collection first
          let participantDocRef = doc(db, 'users', otherParticipantId);
          let participantDocSnap = await getDoc(participantDocRef);

          if (!participantDocSnap.exists()) {
            // If not found in 'users', try 'chefs' collection
            participantDocRef = doc(db, 'chefs', otherParticipantId);
            participantDocSnap = await getDoc(participantDocRef);
          }

          if (participantDocSnap.exists()) {
            const participantDetails = participantDocSnap.data();
            console.log(`Participant details: ${JSON.stringify(participantDetails)}`);
            setParticipantDetails(participantDetails);
          } else {
            console.log('Participant details not found.');
          }
        } else {
          console.log('Chat document not found.');
        }
      }
    };

    fetchParticipantDetails();
  }, [activeChatId, user]); */

  
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

          if (!participantDocSnap.exists()) {
            // If not found in 'users', try 'chefs' collection
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

/*   useEffect(() => {
    // Fetch the current user details
    const fetchUserDetails = async () => {
      if (user) {
        // Try fetching from 'users' collection first
        let userDocRef = doc(db, 'users', user.uid);
        let userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          // If not found in 'users', try 'chefs' collection
          userDocRef = doc(db, 'chefs', user.uid);
          userDocSnap = await getDoc(userDocRef);
        }

        if (userDocSnap.exists()) {
          setCurrentUser(userDocSnap.data());
        } else {
          console.log('Current user details not found.');
          setCurrentUser(null);
        }
      }
    };

    fetchUserDetails();
  }, [user]); */
  
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      // Assuming `auth.currentUser.uid` gives us the current user's ID
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
  
  const handleBack = () => {
    setActiveChatId(null); // Clear the active chat ID to return to the chat list
  };

  return (
    <div className="message-area">
      <div className="message-header">
        <button onClick={handleBack} className="back-button">&lt;</button>
        <img
          src={participantDetails?.chefImage || participantDetails?.image || 'default-avatar.png'}
          alt={participantDetails?.name || participantDetails?.fullName || 'Unknown User'}
          className="message-avatar"
        />
        <div className="message-name">{participantDetails?.name || participantDetails?.fullName || 'Unknown User'}</div>
      </div>
      <div className="message-list">
      {currentMessages.map((msg) => {
        const isSent = msg.senderId === auth.currentUser.uid; // Determine if the message was sent by the current user
        return (
          <div key={msg.id} className={`message-item ${isSent ? 'sent' : 'received'}`}>
            {!isSent && <img src={msg.senderAvatar || 'default-avatar.png'} alt="Avatar" className="message-avatar" />}
            <div className="message-content">
             
              <p className="message-text">{msg.text}</p>
             
                <span className="message-date">{msg.timestamp?.toDate().toLocaleTimeString()}</span>
              
            </div>
            {isSent && <img src={msg.senderAvatar || 'default-avatar.png'} alt="Avatar" className="message-avatar" />}
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
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}  

export default MessageArea;