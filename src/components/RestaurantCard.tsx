import React from 'react';

interface Restaurant {
    name: string;
    vicinity: string;
    rating: number;
}

interface RestaurantCardProps {
    restaurant: Restaurant;
}

// RestaurantCard 컴포넌트는 각각의 음식점 정보를 표시합니다.
const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => (
    <div>
        <h3>{restaurant.name}</h3>
        <p>Address: {restaurant.vicinity}</p>
        <p>Rating: {restaurant.rating}</p>
        <hr />
    </div>
);

export default RestaurantCard;
