// Import necessary dependencies
import React from 'react';
import CuisineCard from './CuisineCard';
import useCuisines from './hooks/useCuisines';
import './App.css';

const Cuisine = () => {
    const { cuisines, isLoading, error } = useCuisines();

    console.log(cuisines);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <section className="cuisine-grid">
            {cuisines.map(cuisine => (
                <CuisineCard key={cuisine.id} cuisine={cuisine} />
            ))}
        </section>
    );
}


export default Cuisine; // Export the component for use in other parts of the app
