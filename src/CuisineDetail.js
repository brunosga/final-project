import React from 'react';
import useCuisinesDetail from './hooks/useCuisinesDetails'; // Ensure correct path
import { useParams, useNavigate } from 'react-router-dom';
import useChefs from './hooks/useChefs';
import ChefCard from './ChefCard'; // Make sure you have a ChefCard component
import './App.css';

const CuisineDetail = () => {
    const { id } = useParams(); // This is the cuisine document ID
    const navigate = useNavigate();
    const { cuisine, isLoading: isLoadingCuisine, error: cuisineError } = useCuisinesDetail(id);
    const { chefs, isLoading: isLoadingChefs, error: chefsError } = useChefs(id); // Pass the cuisine document ID here
    
    if (isLoadingCuisine || isLoadingChefs) {
        return <p className="text-center">Loading...</p>;
    }

    if (cuisineError || chefsError) {
        return <p className="text-center text-red-500">{cuisineError || chefsError}</p>;
    }

    return (
        <div className="cuisine-detail">
           
            <div className="cuisine-header">
            <button className='back-button' onClick={() => navigate('/home')}>&lt; All cuisines</button>
                <div className="cuisine-image" style={{ backgroundImage: `url(${cuisine.imageUrl})` }}>
                
                    <h1 className="cuisine-title">{cuisine.name}</h1>
                </div>
            </div>
            <div className="cuisine-description">
                <p>{cuisine.description}</p>
            </div>
            <div className="chef-section">
                <h1>Meet our Chefs</h1>
                <p>Our chefs are ready to cook you the best {cuisine.name} dishes.</p>
                <div className="chef-grid">
                    {chefs.map(chef => (
                        <ChefCard key={chef.id} chef={chef} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CuisineDetail;
