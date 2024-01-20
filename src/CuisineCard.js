import React from 'react';
import { useNavigate } from 'react-router-dom';

const CuisineCard = ({ cuisine }) => {
    const navigate = useNavigate();

    const navigateToDetail = () => {
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
