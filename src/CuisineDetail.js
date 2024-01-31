import React from 'react';
import useCuisinesDetail from './hooks/useCuisinesDetails'; // Ensure correct path
import { useParams } from 'react-router-dom';
import useChefs from './hooks/useChefs';
import ChefCard from './ChefCard'; // Make sure you have a ChefCard component
import './App.css';

const CuisineDetail = () => {
    const { id } = useParams(); // This is the cuisine document ID
    const { cuisine, isLoading: isLoadingCuisine, error: cuisineError } = useCuisinesDetail(id);
    const { chefs, isLoading: isLoadingChefs, error: chefsError } = useChefs(id); // Pass the cuisine document ID here
    
    if (isLoadingCuisine) {
        return <p className="text-center">Loading cuisine...</p>;
    }

    if (cuisineError) {
        return <p className="text-center text-red-500">{cuisineError}</p>;
    }
    if (isLoadingChefs) {
        return <p className="text-center">Loading chefs...</p>;
    }

    if (chefsError) {
        return <p className="text-center text-red-500">{chefsError}</p>;
    }

    return (
        <div className="cuisine-detail">
            <div className="cuisine-header">
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
