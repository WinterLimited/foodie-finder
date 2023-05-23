import React, { useState, useEffect } from 'react';
import { Spin, Button } from 'antd';
import RestaurantCard from './RestaurantCard';
import { fetchRestaurantsFromAPI } from './api';
import { loadUserVectorFromLocalStorage, calculateCosineSimilarity } from './utils';

export interface Restaurant {
    name: string;
    vicinity: string;
    rating: number;
    price_level?: number;
    types?: string[];
    cosineSimilarity?: number;
}

const PlacesPage: React.FC = () => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userLatitude, setUserLatitude] = useState<number | null>(null);
    const [userLongitude, setUserLongitude] = useState<number | null>(null);

    useEffect(() => {
        fetchUserLocation();
    }, []);

    const fetchUserLocation = () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLatitude(position.coords.latitude);
                setUserLongitude(position.coords.longitude);
                fetchRestaurants(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.log('Error:', error);
            }
        );
    };

    const fetchRestaurants = (latitude: number, longitude: number) => {
        const apiKey = process.env.REACT_APP_API_KEY;
        setLoading(true);

        if (latitude != null && longitude != null && apiKey) {

            fetchRestaurantsFromAPI(latitude, longitude, apiKey)
                .then((response) => {
                    const userVector = loadUserVectorFromLocalStorage();
                    const restaurantData = response.data.results;

                    let sortedRestaurants;

                    // userVector가 설정되지 않았으면 기본정렬
                    if (userVector.length === 0) {
                        sortedRestaurants = restaurantData.sort((a, b) => {
                            return b.rating - a.rating;
                        });
                    } else {
                        const restaurantDataWithSimilarity = calculateCosineSimilarity(
                            userVector,
                            restaurantData
                        );
                        sortedRestaurants = restaurantDataWithSimilarity.sort((a, b) => {
                            if (b.cosineSimilarity && a.cosineSimilarity) {
                                return b.cosineSimilarity - a.cosineSimilarity;
                            }
                            return 0;
                        });
                    }

                    setRestaurants(sortedRestaurants);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log('Error:', error);
                    setLoading(false);
                });
        }
    };


    const handleSelectRestaurant = (restaurant: Restaurant) => {
        console.log('seleRest');
        const selectedRestaurantDetails = {
            price_level: restaurant.price_level,
            types: restaurant.types,
            rating: restaurant.rating,
        };

        localStorage.setItem('selectedRestaurant', JSON.stringify(selectedRestaurantDetails));
    };

    const handleRecommendAgain = () => {
        fetchUserLocation();
    };

    return (
        <div>
            <Button type="primary" onClick={handleRecommendAgain}>
                재추천
            </Button>
            {loading ? (
                <Spin tip="Loading" size="large">
                    <div className="content" style={{ padding: '50px', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '4px' }} />
                </Spin>
            ) : (
                restaurants.map((restaurant, index) => (
                    <RestaurantCard
                        key={index}
                        restaurant={restaurant}
                        onSelect={handleSelectRestaurant}
                    />
                ))
            )}
        </div>
    );
};

export default PlacesPage;
