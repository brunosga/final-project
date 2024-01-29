import React from 'react';
import useCuisinesDetail from './hooks/useCuisinesDetails'; // Ensure correct path
import { useParams } from 'react-router-dom';
import ChefCard from './ChefCard'; // Make sure you have a ChefCard component
import './App.css';

const CuisineDetail = () => {
    const { id } = useParams();
    const { cuisine, isLoading, error } = useCuisinesDetail(id);

    if (isLoading) {
        return <p className="text-center">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="cuisine-detail">
            <div className="cuisine-image bg-cover bg-center h-64" style={{ backgroundImage: `url(${cuisine.imageUrl})` }}></div>
            <h1 className="text-3xl text-center my-4">{cuisine.name}</h1>
            <div className="cuisine-description mx-auto p-4 border-t border-gray-300">
                <p>{cuisine.description}</p>
            </div>
            <div className="chef-section mt-8">
                <h3 className="text-2xl text-center mb-4">Meet our Chefs</h3>
                <div className="grid grid-cols-3 gap-4">
                    {cuisine.chefs && cuisine.chefs.map(chef => (
                        <ChefCard key={chef.id} chef={chef} />
                    ))}
                </div>
            </div>
        </div>

    );
}

export default CuisineDetail;
