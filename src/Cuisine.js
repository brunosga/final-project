// give a dummy page to display the cuisine list with cards to direct to the cuisine detail page, pass the id to the cuisine detail page to display the data

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


export default Cuisine;
