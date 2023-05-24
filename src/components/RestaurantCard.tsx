import React from 'react';
import { Card } from 'antd';
import { Restaurant } from './PlacesPage';

interface RestaurantCardProps {
    restaurant: Restaurant;
    onSelect: (restaurant: Restaurant) => void; // add an onSelect prop
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSelect }) => {
    const { name, vicinity, rating, cosineSimilarity } = restaurant;

    const handleRestaurantClick = () => {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(name)}`);
    };

    return (
        <div onClick={() => onSelect(restaurant)}>
            <Card
                title={<a href="" onClick={handleRestaurantClick}>{name}</a>}
                hoverable
                style={{ width: '100%' }}
            >
                <p>주소: {vicinity}</p>
                <p>별점: {rating}</p>
                {cosineSimilarity ?
                    (<p>맞춤도: {cosineSimilarity * 100}</p>) : ''
                }

            </Card>
        </div>
    );
};

export default RestaurantCard;
