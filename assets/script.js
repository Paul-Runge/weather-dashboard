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

// Today's weather display
let weatherTodayEl = document.getElementById('weather-today');
let cityNameEl = document.getElementById('city-name');

// 5-Day forecast weather display
let fivedayEl = document.querySelectorAll('.forecast');
let fiveDayCard = document.getElementById('forecast-card');

// Specific weather data
let tempEl = document.getElementById('temperature');
let windEl = document.getElementById('wind');
let humidityEl = document.getElementById('humidity');
let todayIcon = document.getElementById('today-icon');

// Get current day & 5-day forecast weather data from openweathermap API using name of the desired city as argument.
function getWeather(cityName) {
    // Renders temp units in imperial instead of deafult Kelvin scale.
    // URL for current day weather
    let todayURL = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + cityName + "&appid=" + APIKey;
    
    // URL for 5-day forecast
    let fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + cityName + "&appid=" + APIKey;
    
    
    // Get, log, and display current day weather data to a card
    fetch(todayURL)
        .then(function (response) { 
            response.json()
            .then(function (data) { 
                // console.log(data);
                // Make today's weather card visible
                weatherTodayEl.classList.remove('d-none');
                // Get current date and extract relevant data points
                const date = new Date(data.dt * 1000);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                // Get icon representing current weather pattern
                let todayIconCode = data.weather[0].icon;
                let todayIconURL = "https://openweathermap.org/img/wn/" + todayIconCode + ".png";
                todayIcon.setAttribute("src", todayIconURL);
                // Format/render date and relevant weather data w/ imperial unit notation
                cityNameEl.innerHTML = data.name + " (" + month + "/" + day + "/" + year + ")";
                cityNameEl.append(todayIcon); // Display icon alongside city name
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
                // Make 5-day weather forecast card visible
                fiveDayCard.classList.remove('d-none');
                // Loop through each 5-day element giving them structural elements and relevant data points
                for (let i = 0; i < fivedayEl.length; i++) {
                    // Make sure each newly addressed element is initially empty
                    fivedayEl[i].innerHTML = "";
                    // The API gives blocks of data for every 3-hours (8 blokcs per day) starting with the last block of the current day.  This index caculation initially selects the first block of the next day, and jumps forward 1 day (8 blocks) with each subsequent iteration.
                    const index = i * 8 + 1;
                    // Get date and extract relevant data points for current index
                    const date = new Date(data.list[index].dt_txt);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const day = date.getDate();
                    // Create structural elements for current index
                    const fiveDayDate = document.createElement('h5');
                    const fiveDayIcon = document.createElement('img');
                    const fiveDayTemp = document.createElement('p');
                    const fiveDayWind = document.createElement('p');
                    const fiveDayHumidity = document.createElement('p');
                    // Get icon matching current index weather pattern and display
                    let fiveDayIconCode = data.list[index].weather[0].icon;
                    let fiveDayIconURL = "https://openweathermap.org/img/wn/" + fiveDayIconCode + ".png";
                    fiveDayIcon.setAttribute("src", fiveDayIconURL);
                    // Format/render date and relevant weather data w/ imperial unit notation
                    fiveDayDate.innerHTML = month + "/" + day + "/" + year;
                    fiveDayTemp.innerHTML = "Temperature: " + Math.floor(data.list[index].main.temp) + ' \u00B0F';
                    fiveDayWind.innerHTML = "Wind: " + data.list[index].wind.speed + " mph";
                    fiveDayHumidity.innerHTML = "Humidity: " + data.list[index].main.humidity + "%";
                    // Attach newly created elements to 5-day element at current index
                    fivedayEl[i].append(fiveDayDate);
                    fivedayEl[i].append(fiveDayIcon);
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
    // Call getWeather w/ user input city name as argument
    getWeather(cityInput.value);
    // Push city name to search history array
    searchHistory.push(cityInput.value);
    // Commit city name to local storage
    localStorage.setItem('search', JSON.stringify(searchHistory));
    // Render updated search history
    renderSearchHistory();
    // Reset input field; ready for next entry
    cityInput.value = "";
});

// Create new element for each search history item and render it to the screen as a button that will can be interacted with to perform a new search for weather data for the targeted city.
function renderSearchHistory() {
    // Initialize blank search history
    searchHistoryEl.innerHTML = "";
    // Loop through entire search history
    for (let i = 0; i < searchHistory.length; i++) {
        // Create new button element
        const historyBtn = document.createElement('button');
        // Set new button attributes
        historyBtn.setAttribute('type', 'submit');
        historyBtn.setAttribute('readonly', true);
        historyBtn.setAttribute('class', 'btn btn-secondary btn-block mt-2');
        // This button value to match search history item value (city name) at current index
        historyBtn.setAttribute('value', searchHistory[i]);
        // Give button a text value representing the targeted city
        historyBtn.innerHTML = historyBtn.value;
        // Event listener for click on search history button to execute getWeather() with targeted city name as argument.
        historyBtn.addEventListener('click', function (event) {
            event.preventDefault();
            getWeather(historyBtn.value);
        })
        // Display new search history button in search history bin
        searchHistoryEl.append(historyBtn);
    }
}

// Event listener for clear history button to reset local storage and search history upon click
clearHistoryBtn.addEventListener('click', function() {
    localStorage.clear();
    searchHistory = [];
    renderSearchHistory();
})
// Display search history upon page load/reload
renderSearchHistory();