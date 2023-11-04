const apiKey = "590f0512a60e033b915bf85a1436336f";
const cityText = $("#cityText");
const submitForm = $("#submitForm");


//event listener for the submit button. submit the input city to openWeatherAPI, get back the lat/long
//then submit that to the 5 day forecast API, and display the results
submitForm.on("submit", async function(event) {
    event.preventDefault();
    await fetchAllTheThings();
    renderPastSearches();
});

//logic behind the API calls
const fetchAllTheThings = async () =>{
    //first we need to get the user provided city and get lat/long coordinates from that
    const cityName = cityText.val().trim();   
    let geoCodeFetch = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`);
    geoCodeFetch = await geoCodeFetch.json();
    //call the weather forecast by lattitude and longitude
    let currentFetch = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geoCodeFetch[0].lat}&lon=${geoCodeFetch[0].lon}&appid=${apiKey}&units=imperial`);
    currentFetch = await currentFetch.json();
    let weatherFetch = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geoCodeFetch[0].lat}&lon=${geoCodeFetch[0].lon}&appid=${apiKey}&units=imperial`);
    weatherFetch = await weatherFetch.json();
    console.log('current weather obj:');
    console.log(currentFetch);
    console.log('weather forecast obj:');
    console.log(weatherFetch);
    //set the current weather fields to the values received from current weather API
    await $('h2').text(currentFetch.name)
    .next().attr('src', `https://openweathermap.org/img/wn/${currentFetch.weather[0].icon}.png`)
    .next().text(`Temp: ${currentFetch.main.temp} F`)
    .next().text(`Wind: ${currentFetch.wind.speed}mph at ${currentFetch.wind.deg} degrees`)
    .next().text(`Humidity: ${currentFetch.main.humidity}%`);
    //add five cards to the page and fill them with forecasts for the next 5 days
    addFiveCards(weatherFetch);
}

const addFiveCards = async ({city, count, code, list, message}) => {
    //forecast weather data is stored in the list parameter, and is data for every 3 hours
    //this sets an array of the data at noon for the next 5 days from now
    const weatherFiveDay = [
        list[2],
        list[10],
        list[18],
        list[26],
        list[34]
    ];

    //if 5 cards already exist, remove them before we append 5 more
    $('.forecaster').remove();
    

    //the html we will write for each card
    const cardHTML = (index) => {
        let card = `
        <div class="col flex-column border border-3 rounded forecaster" id="forecast${index}">
            <h2>${city.name}</h2>
            <img src="https://openweathermap.org/img/wn/${weatherFiveDay[index].weather[0].icon}.png">
            <div>Temp: ${weatherFiveDay[index].main.temp} F</div>
            <div>Wind: ${weatherFiveDay[index].wind.speed}mph at ${weatherFiveDay[index].wind.deg} degrees</div>
            <div>Humidity: ${weatherFiveDay[index].main.humidity}%</div>
        </div>
        `;
        return card;
    }
    for (let i = 0; i < weatherFiveDay.length; i++) {
        $('#cardSpace').append(cardHTML(i));
    }
}

const renderPastSearches = () => {
    let storageSave = [];
    if (!localStorage.getItem("pastCities")) {
    if (cityText.val().trim() !== 'Enter a city here') {
        storageSave[0]=cityText.val().trim();
    }
    localStorage.setItem("pastCities", JSON.stringify(storageSave));
    } else {
        storageSave=JSON.parse(localStorage.getItem("pastCities"));
        if (cityText.val().trim() !== 'Enter a city here') {
            storageSave[0]=cityText.val().trim();
        }
        if (storageSave.length > 5) {
            storageSave.splice(0,4);
        }
        localStorage.setItem("pastCities", JSON.stringify(storageSave));
    }
    
    let displayCities = "";
    for (let i=0; i<storageSave.length; i++) {
        displayCities +="<li>" + storageSave[i] + "</li>";
    }

    $(".searches").remove();
    $('#pastSearches').append(displayCities);
    $("li").attr("class", "searches");
}

renderPastSearches();