document.addEventListener("DOMContentLoaded", (event) => {
    var debounceTimeout = null;
    document
        .getElementById('searchInput')
        .addEventListener("input", function() {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => fetchCityGeocodingAPI(this.value.trim()), 1500);
        });
    
    const cityName = document.querySelector('#cityName');
})

var APIkey = '299d70913c79ba24166a03ce534df06d';
var geoCodingResponse;
var weatherResponse;

/**
 * API call with the objective to find a location coordinates
 * by its name. then send coordinates ti main API to fetch weather data
 * @param {String} city user input
 */
function fetchCityGeocodingAPI(city) {
    let ajaxRequest = new XMLHttpRequest();
    if (!ajaxRequest) {
        alert("Giving up :( Trouble creating XMLHTTP Instance");
        return false;
    }

    ajaxRequest.open('GET', `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APIkey}`, true);
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState === XMLHttpRequest.DONE){
            if (ajaxRequest.status === 200) {
                requestWeatherData(JSON.parse(ajaxRequest.responseText));
            }
            else {
                alert("there was a problem with the request (Geocoding)");
            }
        }
    }

    ajaxRequest.send();
}

function requestWeatherData(response){
    //Save response for later use
    geoCodingResponse = response;
    let lat = geoCodingResponse[0].lat;
    let lon = geoCodingResponse[0].lon;
    fetchWeatherDataAPI(lat, lon);
}

function fetchWeatherDataAPI(lat, lon) {
    //Create XHR object
    let ajaxRequest = new XMLHttpRequest();
    if (!ajaxRequest) {
        alert("Giving up :( Trouble creating XMLHTTP Instance");
        return false;
    }

    ajaxRequest.open('GET', `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`, true);
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState === XMLHttpRequest.DONE) {
            if (ajaxRequest.status === 200) {
                handleResponse(JSON.parse(ajaxRequest.responseText));
            }
            else {
                alert("There was a problem with the request 2.5");
            }
        }
    }
    ajaxRequest.send();
}

function handleResponse(response) {
    console.log(response.weather[0].description);
    // cityName.innerText = geoCodingResponse.weather[0].name;
}