// ChatService.js
import { db } from './firebase'; // Import your configured Firestore database instance
import { collection, addDoc, onSnapshot, query, where, orderBy, Timestamp } from 'firebase/firestore';

// Function to fetch chat threads
export const fetchChatThreads = (userId, callback) => {
  console.log('Fetching chat threads for user:', userId);

  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, where('participantsIds', 'array-contains', userId));

  const unsubscribe = onSnapshot(q, querySnapshot => {
    const threads = [];
    querySnapshot.forEach(doc => {
      threads.push({ id: doc.id, ...doc.data() });
    });
    console.log('Mapped threads:', threads);
    callback(threads);
  });

  return unsubscribe;
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

export const sendMessage = async (chatId, text, userId, userName, userAvatar) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');

  try {
    await addDoc(messagesRef, {
      text: text,
      timestamp: Timestamp.now(),
      senderId: userId,
      senderName: userName, // The user's full name
      senderAvatar: userAvatar, // The user's avatar or the chef's image as the context dictates
      readStatus: false
    });
    console.log('Message sent');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
