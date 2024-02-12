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
import './App.css';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  //const [cuisines, setCuisines] = useState([]);
  const params = useParams();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header toggleMenu={toggleMenu} />
          {menuOpen && <Menu closeMenu={closeMenu} />}
          <main>
            <Routes>
              <Route path="/" element={<Cuisine />} />
              <Route path="/cuisine/:id" element={<CuisineDetail id={params.id} />} />
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