import React, { Component } from 'react';
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

class PlacesPage extends Component {
    state = {
        restaurants: [] as Restaurant[],
        userLatitude: null as number | null,
        userLongitude: null as number | null,
    };

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState(
                    {
                        userLatitude: position.coords.latitude,
                        userLongitude: position.coords.longitude,
                    },
                    this.fetchRestaurants
                );
            },
            (error) => {
                console.log('Error:', error);
            }
        );
    }

    fetchRestaurants = () => {
        const { userLatitude, userLongitude } = this.state;
        const apiKey = process.env.REACT_APP_API_KEY;

        if (userLatitude && userLongitude && apiKey) {
            fetchRestaurantsFromAPI(userLatitude, userLongitude, apiKey)
                .then((response) => {
                    const userVector = loadUserVectorFromLocalStorage();
                    const restaurantData = response.data.results;

                    let sortedRestaurants;

                    if (userVector.length === 0) {
                        // 최초 검색, 별도의 유사도 검증 없이 음식점 나열
                        // If user vector is empty, sort restaurants based on a default order
                        sortedRestaurants = restaurantData.sort((a, b) => {
                            // Implement your sorting logic here
                            // For example, sort by rating in descending order
                            return b.rating - a.rating;
                        });
                    } else {
                        // Calculate cosine similarity and sort restaurants based on similarity
                        const restaurantDataWithSimilarity = calculateCosineSimilarity(userVector, restaurantData);
                        sortedRestaurants = restaurantDataWithSimilarity.sort((a, b) => {
                            if (b.cosineSimilarity && a.cosineSimilarity) {
                                return b.cosineSimilarity - a.cosineSimilarity;
                            }
                            return 0;
                        });
                    }

                    this.setState({ restaurants: sortedRestaurants });
                })
                .catch((error) => {
                    console.log('Error:', error);
                });
        }
    };


    handleSelectRestaurant = (restaurant: Restaurant) => {
        console.log('seleRest');
        const selectedRestaurantDetails = {
            price_level: restaurant.price_level,
            types: restaurant.types,
            rating: restaurant.rating,
        };

        localStorage.setItem('selectedRestaurant', JSON.stringify(selectedRestaurantDetails));
    };

    render() {
        const { restaurants } = this.state;

        return (
            <div>
                <h2>Recommended Restaurants</h2>
                {restaurants.map((restaurant, index) => (
                    <RestaurantCard
                        key={index}
                        restaurant={restaurant}
                        onSelect={this.handleSelectRestaurant}
                    />
                ))}
            </div>
        );
    }
}

export default PlacesPage;
