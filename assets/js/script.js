const apiKey = "590f0512a60e033b915bf85a1436336f";
const cityText = $("#cityText");
const submitForm = $("#submitForm");


//event listener for the submit button. submit the input city to openWeatherAPI, get back the lat/long
//then submit that to the 5 day forecast API, and display the results
submitForm.on("submit", function(event) {
    event.preventDefault();
    fetchAllTheThings();
});

//logic behind the API calls
const fetchAllTheThings = async () =>{
    //first we need to get the user provided city and get lat/long coordinates from that
    const cityName = cityText.val().trim();   
    let geoCodeFetch = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`);
    geoCodeFetch = await geoCodeFetch.json();
    //call the weather forecast by lattitude and longitude
    let weatherFetch = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geoCodeFetch[0].lat}&lon=${geoCodeFetch[0].lon}&appid=${apiKey}`);
    weatherFetch = await weatherFetch.json();
    console.log(weatherFetch);
}
