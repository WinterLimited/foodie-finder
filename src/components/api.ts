import axios from 'axios';
import { Restaurant } from './PlacesPage';

const apiUrl = '/maps/api/place/nearbysearch/json';

export const fetchRestaurantsFromAPI = (userLatitude: number, userLongitude: number, apiKey: string) => {
    const requestUrl = `${apiUrl}?location=${userLatitude},${userLongitude}&radius=1500&type=restaurant&key=${apiKey}`;
    return axios.get<{results: Restaurant[]}>(requestUrl);
};
