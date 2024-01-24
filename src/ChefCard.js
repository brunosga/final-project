import React from 'react';
import './App.css'; // Make sure to create a CSS file for styling

const ChefCard = ({ chef }) => {
  return (
    <div className="chef-card">
      <div className="chef-food-image" style={{ backgroundImage: `url(${chef.foodImage})` }}>
        {/* This is the cuisine image overlay */}
        <div className="cuisine-image-overlay">
          <img src={chef.chefImage} alt={`${chef.name}`} className="chef-image" />
        </div>
      </div>
      <div className="chef-details">
        <h3 className="chef-name">{chef.name}</h3>
        <p className="chef-price">{chef.price}</p>
      </div>
    </div>
  );
}

export default ChefCard;
