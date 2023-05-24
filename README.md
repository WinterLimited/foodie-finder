# 음식점 추천 시스템

이 프로젝트는 React와 코사인 유사도 알고리즘을 사용하여 사용자의 취향에 맞는 음식점을 추천하는 애플리케이션입니다.

## 사용 기술
- React.js: 사용자 인터페이스 구현
- TypeScript: 타입 검사 및 안정성 제공
- LocalStorage: 사용자 취향 데이터 저장 (별도의 서버 구축이 없어 DB로 사용)
- Google Places API: 주변 음식점 정보 제공

## 앱 소개
사용자가 선택하는 음식점에 따라 개인화된 추천 목록을 제공합니다. 사용자의 위치를 기반으로 Google Places API를 사용하여 주변 음식점의 목록을 가져오고, 이를 바탕으로 사용자의 취향에 맞게 음식점을 추천합니다. 사용자의 취향은 LocalStorage에 저장되며, 가격, 평점, 음식점 유형 등을 포함합니다.

