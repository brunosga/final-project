import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Menu from './Menu';
import CuisineDetail from './CuisineDetail'; // Assume this is a new component for cuisine details
import Cuisine from './Cuisine'; // Assume this is a new component for cuisine details
import ChefDetail from './ChefDetail';
import AuthPage from './AuthPage';
import { AuthProvider } from './AuthContext'; // Adjust the path as necessary
import { ChatProvider } from './ChatContext'; // Import the ChatProvider
import PasswordReset from './PasswordReset'; // Your renamed PasswordReset component
import './App.css';
import './css/Header.css';
import Footer from './Footer';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  //const [cuisines, setCuisines] = useState([]);
  const params = useParams();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  return (
    <AuthProvider> {/* Keep AuthProvider at the top level */}
      <ChatProvider> {/* Wrap the parts of your app that need chat with ChatProvider */}
      <Router>
        <div className="App">
          <Header toggleMenu={toggleMenu} />
          {menuOpen && <Menu closeMenu={closeMenu} />}
          <main>
            <Routes>
              <Route path="/home/" element={<Cuisine />} />
              <Route path="/cuisine/:id" element={<CuisineDetail id={params.id} />} />
              <Route path="/chef/:id" element={<ChefDetail />} />
              <Route path="/login/" element={<AuthPage />} />
              <Route path="/password-reset" element={<PasswordReset />} />
            </Routes>
            </main>
          <Footer />
        </div>
      </Router>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;