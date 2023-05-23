import axios from 'axios';
import { Restaurant } from './PlacesPage';

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

export const fetchRestaurantsFromAPI = (userLatitude: number, userLongitude: number, apiKey: string) => {
    const requestUrl = `${proxyUrl}${apiUrl}?location=${userLatitude},${userLongitude}&radius=1500&type=restaurant&key=${apiKey}`;
    return axios.get<{results: Restaurant[]}>(requestUrl);
}
