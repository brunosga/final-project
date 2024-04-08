// Import necessary dependencies and components
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Menu from './Menu';
import Profile from './Profile';
import CuisineDetail from './CuisineDetail';
import Cuisine from './Cuisine';
import ChefDetail from './ChefDetail';
import AuthPage from './AuthPage';
import { AuthProvider } from './AuthContext';
import { ChatProvider } from './ChatContext';
import PasswordReset from './PasswordReset';
import Cookies from './Cookies';
import About from './About';
import Privacy from './Privacy';
import './App.css';
import './css/Header.css';
import Footer from './Footer';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useParams();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
        <div data-testid="app-container" className="App">
            {/* Header component with menu toggle function */}
            <Header toggleMenu={toggleMenu} />
            {/* Menu component with close function, only displayed if menuOpen is true */}
            {menuOpen && <Menu closeMenu={closeMenu} />}
            <main>
              {/* Define application routes and components associated with each path */}
              <Routes>
                <Route path="/home/" element={<Cuisine />} />
                <Route path="/cuisine/:id" element={<CuisineDetail id={params.id} />} />
                <Route path="/chef/:id" element={<ChefDetail />} />
                <Route path="/login/" element={<AuthPage />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy" element={<Privacy />} />
              </Routes>
            </main>
            <Footer />
            <Cookies />
          </div>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; // Export the component for use in other parts of the app