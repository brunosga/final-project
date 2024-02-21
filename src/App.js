import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext'; // Adjust the path as necessary
//import { useParams } from 'react-router-dom';
import Header from './Header';
import Menu from './Menu';
import ChatMenu from './ChatMenu'; // Import the ChatMenu component
import CuisineDetail from './CuisineDetail'; // Assume this is a new component for cuisine details
import Cuisine from './Cuisine'; // Assume this is a new component for cuisine details
import ChefDetail from './ChefDetail';
import AuthPage from './AuthPage';

import './App.css';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { isLoggedIn } = useAuth(); // Use the useAuth hook to access isLoggedIn

  //const [cuisines, setCuisines] = useState([]);
  //const params = useParams();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const toggleChat = () => setChatOpen(!chatOpen);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header toggleMenu={toggleMenu} toggleChat={toggleChat} isUserLoggedIn={isLoggedIn}/>
          {menuOpen && <Menu closeMenu={closeMenu} />}
          <ChatMenu isOpen={chatOpen} closeChat={toggleChat} />
          <main>
            <Routes>
              <Route path="/home/" element={<Cuisine />} />
              <Route path="/cuisine/:id" element={<CuisineDetail  />} />
              <Route path="/chef/:id" element={<ChefDetail />} />
              <Route path="/login/" element={<AuthPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;