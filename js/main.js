import WeatherClass from "./WeatherClass.js"
import AirQuality from "./AirQualityClass.js"

function loadWeatherData(inputValue = { q: "warszawa" }){
    console.log(inputValue);
    WeatherClass.downloadCurrentWeatherConditions(inputValue).then(weatherData => {        
        const currentWeather = new WeatherClass(weatherData.data);
        currentWeather.showCurrentWeatherConditions();
        currentWeather.savelastSearchedLocationInLocalStorage(inputValue);
        loadAirQualityData(weatherData.data.coord.lat, weatherData.data.coord.lon);
    })
    
    .catch(error => {
        Error(error);
        console.log(error);
        testFunction(inputValue.q);
    })
}

function loadAirQualityData(lat="52.23", lng="21.01"){
    const currentAirResults = document.querySelector(".current-air-results");
    AirQuality.downloadAirQualityData(lat, lng).then(airQualityData => {
        const currentAirQuality = new AirQuality(airQualityData.data);      
        currentAirResults.setAttribute("style", "display: grid")
        currentAirQuality.showAirQuality();
        const geoCords = {
            lat: lat,
            lng: lng
        }
        currentAirQuality.saveGeoCordsFromLastSearchedLocation(geoCords);
        localStorage.setItem("airQualityFlag", "flag");
        document.querySelector(".loader-cnt").setAttribute("style", "display: none");
    })

    .catch(error => {
        Error(error);
        currentAirResults.setAttribute("style", "display: none");
        localStorage.removeItem("airQualityFlag");
        document.querySelector(".loader-cnt").setAttribute("style", "display: none");
    })
}

function bindSearchButton (){
    event.preventDefault();

    const errorMessageCnt = document.querySelector(".error-message-cnt");
    errorMessageCnt.setAttribute("style", "display: none");

    const loaderCnt = document.querySelector(".loader-cnt");
    loaderCnt.setAttribute("style", "display: flex");

    const inputText = document.querySelector(".input-text");
    resizeContainer("loader-cnt");
    
    const city = {
            q: inputText.value
        };   

    if(inputText.value != ""){
        loadWeatherData(city);
    }

    inputText.blur();
    inputText.value = ""; 
}

function testFunction(x){
        
    const loaderCnt = document.querySelector(".loader-cnt");
    loaderCnt.setAttribute("style", "display: none");

    const errorMessageCnt = document.querySelector(".error-message-cnt");
    errorMessageCnt.setAttribute("style", "display: flex");
    console.log(errorMessageCnt.getAttribute("style", "display"));
    resizeContainer("error-message-cnt");

    const currentCity = document.querySelector(".current-city");
    currentCity.textContent = "Błąd";

    const errorMessage = errorMessageCnt.querySelector(".error-message");
    errorMessage.textContent = `Nie znalezionio danych dla ${x}. \n
                                    Upewnij się, że wpisałeś poprawne dane.`;
    console.log(errorMessageCnt.getAttribute("style", "display"));
    
}

function resizeContainer(container){
    const containerToResize = document.querySelector(`.${container}`);
    const containerToResizeStyle  = window.getComputedStyle(containerToResize);
    console.log(containerToResizeStyle);
    if(containerToResizeStyle.getPropertyValue("display") === "flex"){
        const currentResultsCnt = document.querySelector(".current-results-cnt");
        const currentResultsHeader = document.querySelector(".current-results-header");
        const containerSize = currentResultsCnt.clientHeight - currentResultsHeader.clientHeight;
        containerToResize.style.height = containerSize + "px";
    }else{
        console.log("saff");
    }
}

// function resizeLoader(){
//     const loaderCnt = document.querySelector(".loader-cnt");
//     const loaderCntStyle  = window.getComputedStyle(loaderCnt)
    
//     if(loaderCntStyle.getPropertyValue("display") === "flex"){
//         const currentResultsCnt = document.querySelector(".current-results-cnt");
//         const currentResultsHeader = document.querySelector(".current-results-header");
//         const loaderSize = currentResultsCnt.clientHeight - currentResultsHeader.clientHeight;
//         loaderCnt.setAttribute("style", `height: ${loaderSize}px`);
//     }
// }

// //Resize loader

resizeContainer("loader-cnt");
window.addEventListener("resize", function(){
    resizeContainer("loader-cnt");
    resizeContainer("error-message-cnt");
});

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

document.querySelector(".input-text-submit").addEventListener("click", bindSearchButton, false);
document.querySelector(".input-text-submit").addEventListener("touch", bindSearchButton, false);
document.querySelector(".input-text-submit").addEventListener("submit", bindSearchButton, false);