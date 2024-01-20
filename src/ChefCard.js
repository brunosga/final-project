import React from 'react';

const ChefCard = ({ chef }) => {
    return (
        <div className="chef-card">
            <div className="chef-image" style={{ backgroundImage: `url(${chef.imageUrl})` }}></div>
            <h4>{chef.name}</h4>
            <p>{chef.bio}</p>
        </div>
    );
}

export default ChefCard;
