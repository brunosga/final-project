import React from 'react';
import CuisineCard from './CuisineCard';

const CuisineList = ({ cuisines }) => {
    return (
        <section className="cuisine-grid">
            {cuisines.map(cuisine => (
                <CuisineCard key={cuisine.id} cuisine={cuisine} />
            ))}
        </section>
    );
}

export default CuisineList;
