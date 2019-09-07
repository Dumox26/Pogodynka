import WeatherClass from "./WeatherClass.js"
import AirQuality from "./AirQualityClass.js"

function loadWeatherData(inputValue = { q: "warszawa" }){
    console.log(inputValue);
    WeatherClass.downloadCurrentWeatherConditions(inputValue).then(weatherData => {
        document.querySelector(".loader-cnt").setAttribute("style", "display: none");
        const currentWeather = new WeatherClass(weatherData.data);
        currentWeather.showCurrentWeatherConditions();
        currentWeather.savelastSearchedLocationInLocalStorage(inputValue);
        loadAirQualityData(weatherData.data.coord.lat, weatherData.data.coord.lon);
    })
    
    .catch(error => {
        Error(error);
        console.log(error);
    })
}

function loadAirQualityData(lat="52.23", lng="21.01"){
    AirQuality.downloadAirQualityData(lat, lng).then(airQualityData => {
        const currentAirQuality = new AirQuality(airQualityData.data);
        document.querySelector(".current-air-results").setAttribute("style", "display: grid");
        currentAirQuality.showAirQuality();
        const geoCords = {
            lat: lat,
            lng: lng
        }
        currentAirQuality.saveGeoCordsFromLastSearchedLocation(geoCords);
        localStorage.setItem("airQualityFlag", "flag");
    })

    .catch(error => {
        Error(error);
        document.querySelector(".current-air-results").setAttribute("style", "display: none");
        localStorage.removeItem("airQualityFlag");
    })
}

function bindSearchButton (){
    event.preventDefault();
    document.querySelector(".loader-cnt").setAttribute("style", "display: flex");
    const city = {
            q: document.querySelector(".input-text").value
        }   

    if(document.querySelector(".input-text").value != ""){
        loadWeatherData(city);
    }

    document.querySelector(".input-text").value = ""; 
}

function resizeLoader(){
    const loaderCnt = document.querySelector(".loader-cnt");
    if(loaderCnt.style.display = "flex"){
        const currentResultsCnt = document.querySelector(".current-results-cnt");
        const currentResultsHeader = document.querySelector(".current-results-header");
        const loaderSize = currentResultsCnt.clientHeight - currentResultsHeader.clientHeight;
        loaderCnt.setAttribute("style", `height: ${loaderSize}px`);
    }
}

//Resize loader

resizeLoader();
window.addEventListener("resize", resizeLoader);

// Geolocalization
navigator.geolocation.getCurrentPosition((position) => {
    const parameters = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    loadWeatherData(parameters);

}, reject => {
    //refuse to geolocalization
    //download data for last searched localization

    if (localStorage.getItem("weatherConditionsLastLocation") != null) {
        const lastSearchedLocalization = JSON.parse(localStorage.getItem("weatherConditionsLastLocation"));
        loadWeatherData(lastSearchedLocalization);

    } else {
        loadWeatherData();
    }
});

// submit click

document.querySelector(".input-text-submit").addEventListener("click", bindSearchButton)