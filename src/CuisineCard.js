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
            <p>{cuisine.test}</p>
            <p>{cuisine.id}</p>
            <button>View Cuisine and Chefs</button>
            
        </div>
        
    );
    
}

export default CuisineCard;