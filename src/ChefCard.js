import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Make sure to create a CSS file for styling

const ChefCard = ({ chef }) => {
  const navigate = useNavigate();

  const goToChefDetail = () => {
    navigate(`/chef/${chef.id}`);
  };

  return (
    <div className="chef-card" onClick={goToChefDetail}>
      <div className="chef-food-image" style={{ backgroundImage: `url(${chef.foodImage})` }}>
        {/* This is the cuisine image overlay */}
        <div className="cuisine-image-overlay">
          <img src={chef.chefImage} alt={`${chef.name}`} className="chef-image" />
        </div>
      </div>
      <div className="cuisineType">{chef.cuisineType}</div>
      <div className="chef-details">
        <h3 className="chef-name">{chef.name}</h3>
        <p className="chef-price">From €{chef.price}</p>
      </div>
      <div className="chef-favorite">
    <span className="star-icon">★</span> 
  </div>
    </div>

    
  );
}

export default ChefCard;
