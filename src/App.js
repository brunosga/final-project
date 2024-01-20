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
  { name: 'Brazilian', id: 'brazilian' },
  { name: 'Portuguese', id: 'portuguese' }
];

function App() {

  const handleCuisineClick = (cuisineId) => {
    // Implement navigation to the specific cuisine page
  };
  
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };


  return (
    <div className="App">
      <header>
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <input type="search" placeholder="Search bar" />
        <div className="hamburger-icon" onClick={toggleMenu}>
          &#9776; {/* Unicode for hamburger icon */}
        </div>
      </header>
      
      {menuOpen && (
        <div className="backdrop" onClick={closeMenu}>
          <div className="menu" onClick={e => e.stopPropagation()}>
            <div className="close-icon" onClick={closeMenu}>&times;</div>
            <a href="/messages">messages</a>
            <a href="/profile">my profile</a>
            <a href="/settings">settings</a>
            <a href="/logout">log out</a>
            <a href="/about">about</a>
            <div className="menu-footer">
              <div className="logo">LOGO</div>
              <a href="/privacy">Privacy & Legal</a>
            </div>
          </div>
        </div>
      )}

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
