
const isWithinOfficeRadius = (employeeLocation, officeLocation, maxDistance) => {
    const { lat: empLat, lng: empLng } = employeeLocation;
    const { lat: officeLat, lng: officeLng } = officeLocation;
    
    // Using Haversine formula to calculate distance between two points on Earth's surface
    const R = 6371; // Earth's radius in km
    const dLat = (officeLat - empLat) * Math.PI / 180;
    const dLng = (officeLng - empLng) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(empLat * Math.PI / 180) * Math.cos(officeLat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    return distance <= maxDistance; // True if employee is within maxDistance km
};

module.exports = isWithinOfficeRadius;
