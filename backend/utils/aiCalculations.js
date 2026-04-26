const calculatePropertyScore = (property) => {
    let score = 0;
    
    const primeLocations = ['downtown', 'city center', 'prime', 'central'];
    if (primeLocations.some(loc => property.location.toLowerCase().includes(loc))) {
        score += 30;
    } else {
        score += Math.floor(Math.random() * 11) + 15;
    }

    if (property.price < 300000) score += 30;
    else if (property.price < 600000) score += 20;
    else score += 10;

    const amenitiesScore = Math.min((property.amenities.length * 5), 20);
    score += amenitiesScore;

    score += Math.floor(Math.random() * 11) + 10;

    return Math.min(score, 100);
};

const calculateROI = (price) => {
    const rentPercentage = (Math.random() * (0.008 - 0.005) + 0.005);
    const monthlyRent = price * rentPercentage;
    const annualRent = monthlyRent * 12;
    const roi = (annualRent / price) * 100;
    return parseFloat(roi.toFixed(2));
};

const calculateRiskLevel = (score, roi) => {
    if (score > 80 && roi > 7) return 'Low';
    if (score > 60 && roi > 4) return 'Medium';
    return 'High';
};

module.exports = { calculatePropertyScore, calculateROI, calculateRiskLevel };
