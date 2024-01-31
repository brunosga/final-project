import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChefDetail } from './hooks/useChefsDetails';
import Slider from "react-slick";
import './App.css';

const ChefDetail = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    const [chefDetail, setChefDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        getChefDetail(id)
            .then(data => {
                setChefDetail(data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setIsLoading(false);
            });
    }, [id]);

   // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };


    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!chefDetail) return <div>Chef not found.</div>;

    return (
        <div className="chef-detail">
            <button onClick={() => navigate(-1)}>Go back</button>
            <h1>{chefDetail.name}</h1>
            <h2>{chefDetail.cuisine}</h2>
            <div className="chef-images">
            {chefDetail.foodImage && chefDetail.foodImage.length > 0 && (
                <Slider {...settings}>
                    {chefDetail.foodImage?.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt={`Food ${index + 1}`} />
                        </div>
                    ))}
                </Slider>
            )}
            </div>
            <div className="about-chef">
                <h3>About the Chef</h3>
                <p>{chefDetail.bio}</p>
            </div>
            <div className="reviews">
                {/* Display reviews */}
            </div>
            <div className="contact-chef">
                <button>Check what is the special menu of the moment</button>
                <button>Get in touch with chef</button>
                <textarea placeholder="Leave a message for the chef"></textarea>
                <button>Send message</button>
            </div>
        </div>
    );
}

export default ChefDetail;

// Implement 'getChefDetail' function in api/firebase.js
// This function should fetch the chef's details from Firebase.
