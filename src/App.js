import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, getDocs} from 'firebase/firestore';
import { db } from './firebase'; // Import db from firebase.js
import Header from './Header';
import Menu from './Menu';
import CuisineList from './CuisineList';
import CuisineDetail from './CuisineDetail'; // Assume this is a new component for cuisine details
import './App.css';

// Initialize Firebase
const myCollection = collection(db, 'cuisines');

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cuisines, setCuisines] = useState([]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    // Get the documents from the collection
    getDocs(myCollection)
      .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
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
            <Route path="/cuisine/:id" element={<CuisineDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;