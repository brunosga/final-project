import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import { collection, getDocs} from 'firebase/firestore';
//import { db } from './firebase'; // Import db from firebase.js
import Header from './Header';
import Menu from './Menu';
//import CuisineList from './CuisineList';
import CuisineDetail from './CuisineDetail'; // Assume this is a new component for cuisine details
import Cuisine from './Cuisine'; // Assume this is a new component for cuisine details
import './App.css';
import { useParams } from 'react-router-dom';

// Initialize Firebase
//const myCollection = collection(db, 'cuisines');

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  //const [cuisines, setCuisines] = useState([]);
  const params = useParams();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  return (
    <Router>
      <div className="App">
        <Header toggleMenu={toggleMenu} />
        {menuOpen && <Menu closeMenu={closeMenu} />}
        <main>
          <Routes>
            <Route path="/" element={<Cuisine />} />
            <Route path="/cuisine/:id" element={<CuisineDetail id={params.id} />} />          
            </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;