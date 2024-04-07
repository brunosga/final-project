// Some parts that are commented in this file is gonna be explained on the final report of the project

// Import necessary dependencies
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy, Timestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

/* // Helper function to get participant details
async function getParticipantDetails(participantId) {
  let participantRef = doc(db, 'users', participantId);
  let participantSnap = await getDoc(participantRef);

  if (!participantSnap.exists()) {
    // If not found in 'users', try 'chefs' collection
    participantRef = doc(db, 'chefs', participantId);
    participantSnap = await getDoc(participantRef);
  }

  if (participantSnap.exists()) {
    return participantSnap.data();
  } else {
    console.log('Participant details not found.');
    return null;
  }
} */

// Function to fetch chat threads
export const fetchChatThreads = (userId, callback) => {
  console.log('Fetching chat threads for user:', userId);

  const chatsRef = collection(db, 'chats');
  const q = query(
    chatsRef,
    where('participantsIds', 'array-contains', userId),
    orderBy('lastMessageTimestamp', 'desc') // Order by last message timestamp
  );

  const unsubscribe = onSnapshot(q, async querySnapshot => {
    const threads = [];
    for (const docSnapshot of querySnapshot.docs) {
      const chatData = docSnapshot.data();
      // Find the other participant's ID
      const otherParticipantId = chatData.participantsIds.find(id => id !== userId);

      // First, try to get the participant from 'users' collection
      let participantDocRef = doc(db, 'users', otherParticipantId);
      let participantDocSnap = await getDoc(participantDocRef);

      let isChef = false; // Initialize as false
      let participantData;
      
      if (participantDocSnap.exists()) {
        participantData = participantDocSnap.data();
      } else {
        // If not found in 'users', try 'chefs' collection
        participantDocRef = doc(db, 'chefs', otherParticipantId);
        participantDocSnap = await getDoc(participantDocRef);
        if (participantDocSnap.exists()) {
          isChef = true; // Found in 'chefs', so participant is a chef
          participantData = participantDocSnap.data();
        }
      }
      
      // If participant is found, add them to the thread data
      if (participantData) {
        threads.push({
          id: docSnapshot.id,
          ...chatData,
          participantName: participantData.name || 'Unknown User',
          participantImage: isChef ? participantData.chefImage : participantData.image,
        lastMessage: chatData.lastMessage,
        lastMessageTimestamp: chatData.lastMessageTimestamp
      });
    }
  }
  
  callback(threads); // Send the threads back through the callback
});

return unsubscribe; // Return the unsubscribe function to be able to unsubscribe later
};


// Function to subscribe to messages within a specific chat thread
export const subscribeToMessages = (chatId, callback) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    callback(messages);
  });

  return unsubscribe;
};

// Function to send the messages
export const sendMessage = async (chatId, text, userId, userName, userAvatar) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const chatRef = doc(db, 'chats', chatId); // Reference to the chat document

  try {
    const newMessage = {
      text: text,
      timestamp: Timestamp.now(),
      senderId: userId,
      senderName: userName,
      senderAvatar: userAvatar,
      readStatus: false
    };

    // Add the new message to the 'messages' subcollection
    await addDoc(messagesRef, newMessage);

    // Update the last message and timestamp in the chat document
    await updateDoc(chatRef, {
      lastMessage: text,
      lastMessageTimestamp: newMessage.timestamp
    });

    console.log('Message sent');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};