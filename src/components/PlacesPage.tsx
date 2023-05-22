import React, { Component } from 'react';
import axios from 'axios';
import RestaurantCard from './RestaurantCard'; // RestaurantCard 컴포넌트를 import

interface Restaurant {
    name: string;
    vicinity: string;
    rating: number;
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
                this.setState({
                    userLatitude: position.coords.latitude,
                    userLongitude: position.coords.longitude,
                }, this.fetchRestaurants); // 위치를 얻은 후 fetchRestaurants 메서드를 호출
            },
            (error) => {
                console.log('Error:', error);
            }
        );
    }

    fetchRestaurants = () => {
        const { userLatitude, userLongitude } = this.state;
        const apiKey = process.env.REACT_APP_API_KEY;
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
        const requestUrl = `${proxyUrl}${apiUrl}?location=${userLatitude},${userLongitude}&radius=1500&type=restaurant&key=${apiKey}`;

        // Google Places API 호출
        axios.get(requestUrl)
            .then(response => {
                // API 응답에서 음식점 목록 추출
                console.log(response.data);
                const restaurantData: Restaurant[] = response.data.results;
                this.setState({ restaurants: restaurantData });
            })
            .catch(error => {
                console.log('Error:', error);
            });
    }

    render() {
        const { restaurants } = this.state;

        return (
            <div>
                <h2>Recommended Restaurants</h2>
                {restaurants.map((restaurant, index) => (
                    <RestaurantCard key={index} restaurant={restaurant} />
                ))}
            </div>
        );
    }
}

export default PlacesPage;
