import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Menu from './Menu';
import CuisineList from './CuisineList';
import CuisineDetail from './CuisineDetail'; // Assume this is a new component for cuisine details
import './App.css';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cuisines, setCuisines] = useState([]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    // The URL here should point to your actual Postman mock server endpoint
    fetch('https://f805bb92-ed78-4c1e-a834-9e920d5d6f83.mock.pstmn.io/cuisine-card')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Assuming 'data' is an array of cuisines, we set it to state
        setCuisines(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Router>
      <div className="App">
        <Header toggleMenu={toggleMenu} />
        {menuOpen && <Menu closeMenu={closeMenu} />}
        <main>
          <Routes>
            <Route path="/" element={<CuisineList cuisines={cuisines} />} />
            <Route path="/cuisine/:id" element={<CuisineDetail cuisines={cuisines} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;