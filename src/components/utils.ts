import { Restaurant } from './PlacesPage';
import { cosineSimilarity } from './cosineSimilarity';

const typeToNumber: { [index: string]: number } = {
    'restaurant': 0,
    'food': 1,
    'point_of_interest': 2,
    'establishment': 3,
    'bar': 4,
    'cafe': 5,
    'meal_takeaway': 6,
    'meal_delivery': 7,
    'bakery': 8,
    // 추가 type 값들이 있다면 추가
};


function convertTypeToNumber(type: string): number {
    return typeToNumber[type] || 0;  // 만약 알려지지 않은 타입이라면 음식점의 기본값인 0을 반환
}


// TODO: 나중에는 types의 값도 number로 바뀌게 된다면 numebr[]로 변경
export const loadUserVectorFromLocalStorage = (): {price_level: number, rating: number, types: string[]} => {
    const userVectorString = localStorage.getItem('selectedRestaurant');
    if (userVectorString) {
        return JSON.parse(userVectorString) as {price_level: number, rating: number, types: string[]};
    }
    return {price_level: 0, rating: 0, types: []}; // price_level, rating은 0, types는 빈 배열을 기본값으로 반환
}

export const calculateCosineSimilarity = (users: {price_level: number, rating: number, types: string[]}, restaurantData: Restaurant[]): Restaurant[] => {
    const userVector = convertToVector(users);
    return restaurantData.map((restaurant: Restaurant) => {
        // restaurant를 비교할 수 있는 Vector의 형태로 변환
        const restaurantVector = [restaurant.price_level || 0, restaurant.rating || 0, restaurant.types ? convertTypeToAverageNumber(restaurant.types) : 0];
        if (userVector) {
            restaurant.cosineSimilarity = cosineSimilarity(userVector, restaurantVector);
        }
        return restaurant;
    });
}

function convertTypeToAverageNumber(types: string[]): number {
    const sum = types.reduce((acc, type) => acc + convertTypeToNumber(type), 0);
    return sum / types.length;
}

// User 정보를 코사인 유사도 비교를 위해 숫자 배열로 변환
function convertToVector(user: {price_level: number, rating: number, types: string[]}): number[] {
    // TODO: 사용자의 취향분석을 위해 다양한 음식점의 값을 저장할땐 값을 저장함과 동시에 types의 값을 숫자로 변경하여 평균적인 값들로 저장하게 하기
    // 'types'의 각 원소를 고유한 숫자로 변환하고 평균을 구함
    const typeAverage = user.types.reduce((sum, type) => {
        // type을 고유한 숫자로 변환하는 함수가 필요함 (예: convertTypeToNumber)
        return sum + convertTypeToNumber(type);
    }, 0) / user.types.length;

    return [user.price_level, user.rating, typeAverage];
}

