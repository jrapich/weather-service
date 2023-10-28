const apiKey = "590f0512a60e033b915bf85a1436336f";
const cityText = $("#cityText");
const submitForm = $("#submitForm");


//event listener for the submit button. submit the input city to openWeatherAPI, get back the lat/long
//then submit that to the 5 day forecast API, and display the results
submitForm.on("submit", function(event) {
    event.preventDefault();
    fetchAllTheThings();
});


function fetchAllTheThings () {
    const cityName = cityText.val().trim();   
    const geoCodeAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`
    fetch(geoCodeAPI)
    .then(function(response) {
        console.log(response);
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        const latitude = data[0].lat
        const longitude = data[0].lon; 
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
}
