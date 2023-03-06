// API Key for openweathermap.org data use permission
const APIKey = "610e0742e0f7bcb4dfa496578d325d9a";

// Search form, input text-area, & button
const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('enter-city');
const searchBtn = document.getElementById('search-button');

// Search history form
const searchHistoryEl = document.getElementById('search-history');
// Search history, if there is one
let searchHistory = JSON.parse(localStorage.getItem('search')) || [];

// Clear search history
const clearHistoryBtn = document.getElementById('clear-history');

weatherTodayEl = document.getElementById('weather-today');
cityNameEl = document.getElementById('city-name');
tempEl = document.getElementById('temperature');
windEl = document.getElementById('wind');
humidityEl = document.getElementById('humidity');
fivedayEl = document.querySelectorAll('.forecast');
// console.log(fivedayEl.length);
// Get the current day & 5-day forecast weather data from openweathermap API using name of the desired city as parameter.
// Currently just displaying data to console.
// Will add code to render to app display later on.
function getWeather(cityName) {
    // Renders temp units in imperial instead of deafult Kelvin scale.
    // URL for current day weather
    let todayURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + cityName + "&appid=" + APIKey;
    
    // URL for 5-day forecast
    let fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + cityName + "&appid=" + APIKey;
    
    
    // Get, log, and display current day weather data
    fetch(todayURL)
        .then(function (response) { 
            response.json()
            .then(function (data) { 
                console.log(data);
                // Make element visible
                weatherTodayEl.classList.remove('d-none');
                const date = new Date(data.dt * 1000);
                // console.log(date);
                const year = date.getFullYear();
                //console.log(year);
                const month = date.getMonth() + 1;
                //console.log(month);
                const day = date.getDate();
                //console.log(day);
                cityNameEl.innerHTML = data.name + " (" + month + "/" + day + "/" + year + ")";
                tempEl.innerHTML = "Temperature: " + Math.floor(data.main.temp) + ' \u00B0F';
                windEl.innerHTML = "Wind: " + data.wind.speed + " mph";
                humidityEl.innerHTML = "Humidity: " + data.main.humidity + "%";
            });
        });

    // Get, log, and display 5-day forecast weather data
    fetch(fiveDayURL)
        .then(function (response) {
            response.json()
            .then (function (data) {
                // console.log(data);
                for (let i = 0; i < fivedayEl.length; i++) {
                    fivedayEl[i].innerHTML = "";
                    const index = i * 8 + 1;
                    const date = new Date(data.list[index].dt_txt);
                    // console.log(date);
                    const year = date.getFullYear();
                    //console.log(year);
                    const month = date.getMonth() + 1;
                    //console.log(month);
                    const day = date.getDate();
                    //console.log(day);
                    const fiveDayDate = document.createElement('p');
                    const fiveDayTemp = document.createElement('p');
                    const fiveDayWind = document.createElement('p');
                    const fiveDayHumidity = document.createElement('p');
                    // console.log(fivedayEl[index]);
                    fiveDayDate.innerHTML = month + "/" + day + "/" + year;
                    fiveDayTemp.innerHTML = "Temperature: " + Math.floor(data.list[index].main.temp) + ' \u00B0F';
                    fiveDayWind.innerHTML = "Wind: " + data.list[index].wind.speed + " mph";
                    fiveDayHumidity.innerHTML = "Humidity: " + data.list[index].main.humidity + "%";
                    fivedayEl[i].append(fiveDayDate);
                    fivedayEl[i].append(fiveDayTemp);
                    fivedayEl[i].append(fiveDayWind);
                    fivedayEl[i].append(fiveDayHumidity);
                 }
            })
        })
}

// Event listener for click on search button.
cityForm.addEventListener('submit', function (event) {
    event.preventDefault();
    // If input is blank, exit function.
    if (!cityInput.value) {
        return;
    }
    // Will fill out rest of code before implementing this block to avoid potential rendering issues.
    // This is intended to eliminate storing duplicate search items.
    // for (let i = 0; i < searchHistory.length; i++) {
    //     if (cityInput.value != searchHistory[i]) {
            
    //     }
    // }
    // console.log(cityInput.value);

    // Call getWeather w/ user input city name as parameter
    getWeather(cityInput.value);
    // Push city name to search history array
    searchHistory.push(cityInput.value);
    // Commit city name to local storage
    localStorage.setItem('search', JSON.stringify(searchHistory));
    renderSearchHistory();
    cityInput.value = "";
});

// Create new element for each search history item and render it to the screen as a button.
function renderSearchHistory() {
    // Initialize blank search history bin
    searchHistoryEl.innerHTML = "";
    // Loop through entire search history
    for (let i = 0; i < searchHistory.length; i++) {
        // Create new button element
        const historyBtn = document.createElement('button');
        // Set new button attributes
        historyBtn.setAttribute('type', 'submit');
        historyBtn.setAttribute('readonly', true);
        historyBtn.setAttribute('class', 'btn btn-secondary btn-block mt-2');
        // This button value matches this search history item
        historyBtn.setAttribute('value', searchHistory[i]);
        // Give button a text value
        historyBtn.innerHTML = historyBtn.value;
        // Event listener for click on search history button to execute getWeather() with associated city name as parameter.
        historyBtn.addEventListener('click', function (event) {
            event.preventDefault();
            getWeather(historyBtn.value);
        })
        // Display new search history button in search history bin
        searchHistoryEl.append(historyBtn);
    }
}

// Event listener to reset local storage and search history upon click 
clearHistoryBtn.addEventListener('click', function() {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
})
// Display search history upon page load/reload
renderSearchHistory();