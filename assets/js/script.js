const apiKey = "590f0512a60e033b915bf85a1436336f";
const cityText = $("#cityText");
const submitForm = $("#submitForm");


//event listener for the submit button. submit the input city to openWeatherAPI, get back the lat/long
//then submit that to the 5 day forecast API, and display the results
submitForm.on("submit", async function(event) {
    event.preventDefault();
    await fetchAllTheThings(cityText.val().trim());
    renderPastSearches();
});

//logic behind the API calls
const fetchAllTheThings = async (cityName) =>{
    //first we need to get the user provided city and get lat/long coordinates from that
    let geoCodeFetch = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`);
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
    await $('h2').text(`Today's weather in ${currentFetch.name}`)
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
    

    //the html we will write for each weather card
    const cardHTML = (index) => {
        let card = `
        <div class="col flex-column border border-3 rounded forecaster" id="forecast${index}">
            <h3>Weather in ${city.name} ${index+1} days from now.</h3>
            <img src="https://openweathermap.org/img/wn/${weatherFiveDay[index].weather[0].icon}.png">
            <div>Temp: ${weatherFiveDay[index].main.temp} F</div>
            <div>Wind: ${weatherFiveDay[index].wind.speed}mph at ${weatherFiveDay[index].wind.deg} degrees</div>
            <div>Humidity: ${weatherFiveDay[index].main.humidity}%</div>
        </div>
        `;
        return card;
    }
    //append each card to the page
    for (let i = 0; i < weatherFiveDay.length; i++) {
        $('#cardSpace').append(cardHTML(i));
    }
}

const renderPastSearches = () => {
    //array we will move search data to/from local storage
    let storageSave = [];
    //if our localstorage key doesnt exist, create it
    if (!localStorage.getItem("pastCities")) {
        //prevent saving the input field default text, to local storage
        if (cityText.val().trim() !== 'Enter a city here') {
            storageSave.push(cityText.val().trim());
        }
        localStorage.setItem("pastCities", JSON.stringify(storageSave));
    } else {
        //parse the stored past searches array, add the latest search to it, and resave it to local storage 
        storageSave=JSON.parse(localStorage.getItem("pastCities"));
        //as above, prevent saving the default text to the array
        if (cityText.val().trim() !== 'Enter a city here') {
            storageSave.push(cityText.val().trim());
        }
        //splice out the oldest search from the array to keep the list of searches at 5 or less
        if (storageSave.length > 5) {
            storageSave.splice(0,1);
        }
        localStorage.setItem("pastCities", JSON.stringify(storageSave));
    }
    
    //create an anchor tag for each search
    let displayCities = [];
    for (let i=0; i<storageSave.length; i++) {
        displayCities.push("<a class='searches'>" + storageSave[i] + "</a>");
    }
    //reverse the order of the cities so the oldest search displays on top
    displayCities = displayCities.reverse();
    

    //remove any old searches and readd the latest list of searches
    $(".searches").remove();
    //since the search a tags from above are stored as an array, convert it to a string, and remove comments from the string, then append to page
    $('#pastSearches').append(displayCities.toString().replace(/,/g, ""));
    
    //event listener for the list of searches
    const allSearches  = document.querySelectorAll('.searches');

    //will listen on every search on the page
    for (let j = 0; j < allSearches.length; j++) {
        allSearches[j].addEventListener('click', async (event) => {
            event.preventDefault();
            await fetchAllTheThings(allSearches[j].textContent);
            renderPastSearches();
        });
    }
}   
//call this function here to display any past searches on page load
renderPastSearches();
