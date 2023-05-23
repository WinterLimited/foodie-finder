// 코사인 유사도 함수
export function cosineSimilarity(a: number[], b: number[]) {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += Math.pow(a[i], 2);
        normB += Math.pow(b[i], 2);
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
