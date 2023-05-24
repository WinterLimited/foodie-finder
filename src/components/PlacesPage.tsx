import React, { useState, useEffect } from 'react';
import { Spin, Button } from 'antd';
import RestaurantCard from './RestaurantCard';
import { fetchRestaurantsFromAPI } from './api';
import {loadUserVectorFromLocalStorage, calculateCosineSimilarity, convertToVector} from './utils';

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

                    // userVector가 설정되지 않았으면 평점순으로 정렬
                    if (userVector.price_level === 0 && userVector.rating === 0 && userVector.types === 0) {
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
        console.log('userVector changed');

        // 만약 price_level이나 types이 undefined라면 기본값을 설정
        const selectedRestaurantDetails = {
            price_level: restaurant.price_level ?? 1, // price_level이 undefined이면 평균적인 값인 1로 설정
            rating: restaurant.rating ?? 0,
            types: restaurant.types ?? [], // types가 undefined이면 빈 배열로 설정 => 이후 처리에 의해 types = 0이 됨
        };
        const vector = convertToVector(selectedRestaurantDetails);
        const originUserVector = loadUserVectorFromLocalStorage();
        console.log(originUserVector);

        const combinedVector = {
            price_level: (originUserVector.price_level + vector[0]) / 2,
            rating: vector[1] === 0 ? originUserVector.rating : (originUserVector.rating + vector[1]) / 2,
            types: (originUserVector.types + vector[2]) / 2,
        };

        localStorage.setItem('selectedRestaurant', JSON.stringify(combinedVector));
        console.log(combinedVector);
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
