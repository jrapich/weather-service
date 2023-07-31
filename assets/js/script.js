const apiKey = "590f0512a60e033b915bf85a1436336f";
let latitude;
let longitude;
let cityName = "london";
//const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
const geoCodeAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`


fetch(geoCodeAPI)
.then(function(response) {
    console.log(response);
    return response.json();
})
.then(function(data) {
    console.log(data);
    latitude = data[0].lat
    longitude = data[0].lon; 
    console.log(`latitude is ${latitude}`);
    console.log(`longitude is ${longitude}`);
    const apiURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    fetch(apiURL)
    .then(function(response) {
        console.log(response);
        return response.json();
    })
    .then(function(data){
        console.log(data);
    })
})