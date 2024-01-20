import React from 'react';
import './App.css';

const cuisines = [
  { name: 'Vegetarian', id: 'vegetarian' },
  { name: 'Japanese', id: 'japanese' },
  { name: 'Mediterranean', id: 'mediterranean' },
  { name: 'Italian', id: 'italian' },
  { name: 'Tapas', id: 'tapas' },
  { name: 'Asian', id: 'asian' },
  { name: 'French', id: 'french' },
  { name: 'Brazilian', id: 'japanese' },
  { name: 'Portuguese', id: 'portuguese' }
];

function App() {
  const handleCuisineClick = (cuisineId) => {
    // Implement navigation to the specific cuisine page
  };

  return (
    <div className="App">
      <header>
        {/* Logo */}
        <div>LOGO</div>
        
        {/* Search Bar */}
        <input type="search" placeholder="Search bar" />
        
        {/* Login/Profile Dropdown */}
        <div>Login/Profile</div>
      </header>
      
      <main>
        <h2>Popular cuisines</h2>
        <section className="cuisine-grid">
          {cuisines.map((cuisine) => (
            <div key={cuisine.id} className="cuisine-card" onClick={() => handleCuisineClick(cuisine.id)}>
              <div className="cuisine-image"></div>
              <h3>{cuisine.name}</h3>
              <button>View cuisine and chefs</button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
