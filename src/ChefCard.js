// Import necessary dependencies
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/ChefCard.css'; // Make sure to create a CSS file for styling

const ChefCard = ({ chef }) => {
  const navigate = useNavigate();

  const defaultImage = 'https://dl.dropbox.com/scl/fi/rpn385ekm39c8spf7aret/imagem_2024-03-31_201209793.png?rlkey=bdyv4ryb21d2cvn7ujjdzcdga&'; 
  const defaultFoodImage = 'https://dl.dropbox.com/scl/fi/yq1xrou3e4pbq9jky4mc6/defaultFoodImage.png?rlkey=nzfu3ev5vrw9lof2o494p4x06&'

  const goToChefDetail = () => {
    navigate(`/chef/${chef.id}`);
  };

  // Ternary operation to determine the chef's name for display
  const chefName = chef?.name ? (chef.name.startsWith("Chef") ? chef.name : `Chef ${chef.name}`) : "Chef";

  return (
    <div className="chef-card" onClick={goToChefDetail}>
      <div className="chef-food-image" style={{ backgroundImage: `url(${chef.foodImage || defaultFoodImage})`  }}>
        {/* This is the cuisine image overlay */}
        <div className="cuisine-image-overlay">
          <img src={chef.chefImage || defaultImage} alt={chefName} className="chef-image" />
        </div>
      </div>
      <div className="cuisineType">{chef.cuisineType}</div>
      <div className="chef-details">
        <h3 className="chef-name">{chefName}</h3>
        <p className="chef-price">From €{chef.price} per person</p>
      </div>
      <div className="chef-favorite">
  </div>
    </div>

    
  );
}

export default ChefCard; // Export the component for use in other parts of the app
