import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const CuisineCard = ({ cuisine }) => {
    const navigate = useNavigate();

    const navigateToDetail = () => {
        console.log("Navigating to cuisine with ID:", cuisine.id); // Add this to debug
        navigate(`/cuisine/${cuisine.id}`);
    };

    return (
        <div className="cuisine-card" onClick={navigateToDetail}>
            <div className="cuisine-image" style={{ backgroundImage: `url(${cuisine.imageUrl})` }}></div>
            <h3>{cuisine.name}</h3>
            <button>View Cuisine and Chefs</button>
            
        </div>
        
    );
    
}

export default CuisineCard;
