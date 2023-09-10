//Initiate API Request's 1.5 seconds after typing
document.addEventListener("DOMContentLoaded", (event) => {
    var debounceTimeout = null;
    document
        .getElementById('searchInput')
        .addEventListener("input", function() {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => fetchCityGeocodingAPI(this.value.trim()), 1500);
        });
})

//Usable Variable's
var APIkey = '299d70913c79ba24166a03ce534df06d';
var geoCodingResponse;
const cityName = document.querySelector('#cityName');
const temp = document.querySelector('#temperature');
const description = document.querySelector('#description');
const dataCard = document.querySelector('#weatherData');
const weatherIcon = document.querySelector('#weatherIcon');

/**
 * API call - find fiven location coordinates
 * send coordinates to Weather API to fetch weather data
 * @param {String} city name.
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
                hideCurrentData();
            }
        }
    }

    ajaxRequest.send();
}

function requestWeatherData(response){
    //Check if any data is retrieved
    if(response.length === 0) {
        hideCurrentData();
        return;
    }

    //Save response for later use
    geoCodingResponse = response;

    //Get data required for weather API call
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

    ajaxRequest.open('GET', `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`, true);
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState === XMLHttpRequest.DONE) {
            if (ajaxRequest.status === 200) {
                handleResponse(JSON.parse(ajaxRequest.responseText));
            }
            else {
                alert("There was a problem with the request");
            }
        }
    }
    ajaxRequest.send();
}

function handleResponse(weatherResponse) {
    //Add information to the card
    let icon = weatherResponse.weather[0].icon;
    cityName.innerText = geoCodingResponse[0].name;
    temp.innerText = weatherResponse.main.temp;
    description.innerText = weatherResponse.weather[0].description;
    weatherIcon.setAttribute('src', `https://openweathermap.org/img/wn/${icon}.png`)
    dataCard.classList.remove('hidden');
}

function hideCurrentData(){
    dataCard.classList.add('hidden');
}