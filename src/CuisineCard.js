// Import necessary dependencies
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const CuisineCard = ({ cuisine }) => {
    const navigate = useNavigate();

    //pass the id to the cuisine detail page to display the data
    const navigateToDetail = () => {
        navigate(`/cuisine/${cuisine.id}`);
        console.log(cuisine);
    };

    return (
        <div className="cuisine-card" onClick={navigateToDetail}>
            <div className="cuisine-image" style={{ backgroundImage: `url(${cuisine.imageUrl})` }}></div>
            <h3>{cuisine.name}</h3>
            <button>View Cuisine and Chefs</button>
            
        </div>
        
    );
    
}

export default CuisineCard; // Export the component for use in other parts of the app
