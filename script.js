// API Key for openweathermap.org data use permission
const APIKey = "610e0742e0f7bcb4dfa496578d325d9a";

// Gets the current day & 5-day forecast weather data from openweathermap API using name of the desired city as parameter.
// Currently just displaying data to console.
// Will add code to render to app display later on.
function getWeather(cityName) {
    // Renders temp in imperial instead of deafult Kelvin scale.
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