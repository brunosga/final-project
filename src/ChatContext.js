import React, { createContext, useState} from 'react';

// Create the context
export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    // State for tracking if the chat is visible
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [activeChatId, setActiveChatId] = useState(null);
   
    const toggleChatVisibility = () => {
        setIsChatVisible(!isChatVisible);
      };
           
    return (
        <ChatContext.Provider value={{ isChatVisible, toggleChatVisibility, activeChatId, setActiveChatId }}>
            {children}
        </ChatContext.Provider>
    );
};
