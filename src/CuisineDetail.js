import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChefCard from './ChefCard'; // This component displays chef details
import { db } from './firebase'; // Import your firebase database reference

const CuisineDetail = () => {
    let { id } = useParams(); // Get the id from the URL
    const [cuisineDetail, setCuisineDetail] = useState(null); // State to hold the fetched cuisine detail
    const [isLoading, setIsLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to hold any error messages

    useEffect(() => {
        const getCuisineDetail = async () => {
            setIsLoading(true);
            try {
                const doc = await db.collection('cuisines').doc(id).get();
                if (doc.exists) {
                    setCuisineDetail({ id: doc.id, ...doc.data() });
                } else {
                    setError('Cuisine not found.');
                }
            } catch (error) {
                setError('Failed to load cuisine details.');
            }
            setIsLoading(false);
        };

        getCuisineDetail();
    }, [id]);


    if (isLoading) {
        return <div>Loading...</div>; // Display a loading state while fetching data
    }

    if (error) {
        return <div>Error: {error}</div>; // Display an error message if the fetch fails
    }

    if (!cuisineDetail) {
        return <div>Cuisine not found.</div>; // Display this if the cuisine detail is null
    }

    // Render the cuisine detail page
    return (
        <div className="cuisine-detail">
            <div className="cuisine-image">
                <h2>{cuisineDetail.name}</h2>
            </div>
            <div className="cuisine-description">
                <p>{cuisineDetail.description}</p>
            </div>
            <div className="chef-section">
                <h3>Meet our Chefs</h3>
                <div className="chef-cards">
                    {cuisineDetail.chefs && cuisineDetail.chefs.map(chef => (
                        <ChefCard key={chef.id} chef={chef} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CuisineDetail;
