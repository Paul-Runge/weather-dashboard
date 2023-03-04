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


// Get the current day & 5-day forecast weather data from openweathermap API using name of the desired city as parameter.
// Currently just displaying data to console.
// Will add code to render to app display later on.
function getWeather(cityName) {
    // Renders temp units in imperial instead of deafult Kelvin scale.
    // URL for current day weather
    let todayURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + cityName + "&appid=" + APIKey;
    
    // URL for 5-day forecast
    let fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + cityName + "&appid=" + APIKey;
    
    // Get and log current day weather
    fetch(todayURL)
        .then(function (response) { 
            response.json()
            .then((data) => console.log(data));
        });

    // Get and log 5-day forecast
    fetch(fiveDayURL)
        .then(function (response) {
            response.json()
            .then ((data) => console.log(data));
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
    renderSearchHistory()
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