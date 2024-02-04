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
        slidesToShow: 3, // Show 3 images at a time
        slidesToScroll: 3, // Scroll 3 images at a time
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!chefDetail) return <div>Chef not found.</div>;

    return (
        <div className="chef-detail">
            <button className='back-button' onClick={() => navigate(-1)}>&lt; All chefs</button>
            <h1>{chefDetail.name}</h1>
            <h2>{chefDetail.cuisine}</h2>
            <div className="slider-container">
                <Slider {...settings}>
                    {chefDetail.foodImage?.map((image, index) => (
                        <div key={index} className="chef-food-image">
                            <img src={image} alt={`Food ${index + 1}`} />
                        </div>
                    ))}
                </Slider>
            </div>
            <div className="about-chef">
                <h3>About the Chef</h3>
                <p>{chefDetail.bio}</p>
            </div>
            <div className="review-section">
                <h2>Reviews</h2>
                <div className="review-list">
                    {/* Iterate through reviews and create a review item for each */}
                    <div className="review-item">
                        <div className="review-avatar"></div>
                        <div className="review-content">
                            <p className="review-author">karlinha</p>
                            <p className="review-comment">This is a review comment with some text.</p>
                            <div className="review-rating">⭐⭐⭐⭐⭐</div>
                        </div>
                    </div>
                    {/* Repeat the .review-item for each review */}
                </div>
            </div>

            {/* Message Section */}
            <div className="message-section">
                <h2>Get in touch with the chef</h2>
                <textarea placeholder="Leave a message for the chef"></textarea>
                <button className="send-message">Send message</button>
            </div>
        </div>
    );
}

export default ChefDetail;

// Implement 'getChefDetail' function in api/firebase.js
// This function should fetch the chef's details from Firebase.
