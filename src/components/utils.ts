import { Restaurant } from './PlacesPage';
import { cosineSimilarity } from './cosineSimilarity';

export const loadUserVectorFromLocalStorage = (): number[] => {
    const userVectorString = localStorage.getItem('selectedRestaurant');
    if (userVectorString) {
        return JSON.parse(userVectorString) as number[];
    }
    return []; // 기본값으로 빈 배열 반환
}


export const calculateCosineSimilarity = (userVector: number[], restaurantData: Restaurant[]): Restaurant[] => {
    return restaurantData.map((restaurant: Restaurant) => {
        const restaurantVector = loadUserVectorFromLocalStorage(); // Assuming this generates a vector for the restaurant
        if (userVector && restaurantVector) {
            restaurant.cosineSimilarity = cosineSimilarity(userVector, restaurantVector);
        }
        return restaurant;
    });
}
