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

// Gelokalizacja
navigator.geolocation.getCurrentPosition((position) => {
    const parameters = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    // WeatherClass.downloadCurrentWeatherConditions(parameters).then(resolve => {
    //     const currentWeaherConditions = new WeatherClass(resolve.data);
    //     currentWeaherConditions.showCurrentWeatherConditions();
    //     AirQuality.downloadAirQualityData(position.coords.latitude, position.coords.longitude).then(resolve => {

    //         const airQualityResults = new AirQuality(resolve.data);
    //         document.querySelector(".current-air-results").setAttribute("style", "display: grid");
    //         airQualityResults.showAirQuality();

    //     }).catch(error => { Error(error) })
    // })
    //     .catch((error => Error(error)))

    loadWeatherData(parameters);

}, reject => {
    //Nie udzielenie zgody na geolokaizacje
    //wywoływanie pogody dla ostatniej lokalizacji
    if (localStorage.getItem("weatherConditionsLastLocation") != null) {
        const lastSearchedLocalization = JSON.parse(localStorage.getItem("weatherConditionsLastLocation"));

        // WeatherClass.downloadCurrentWeatherConditions(lastSearchedLocalization).then(resolve => {
        //     const currentWeatherConditions = new WeatherClass(resolve.data);
        //     currentWeatherConditions.showCurrentWeatherConditions();
        //     const lastSearchedLocalizationGeoCords = JSON.parse(localStorage.getItem("airQualityGeoCords"));

        //     if (localStorage.getItem("airQualityFlag") == "false") {
        //         document.querySelector(".current-air-results").setAttribute("style", "display: grid");
        //         AirQuality.downloadAirQualityData(lastSearchedLocalizationGeoCords.lat, lastSearchedLocalizationGeoCords.lng).then(resolve => {
        //             const airQualityResults = new AirQuality(resolve.data)
        //             airQualityResults.showAirQuality();
        //         })

        //     } else {
        //         document.querySelector(".current-air-results").setAttribute("style", "display: none");
        //     }
        // })
        loadWeatherData(lastSearchedLocalization);

    } else {
        // console.log("LocaL storage jest pusty");
        // WeatherClass.downloadCurrentWeatherConditions().then(resolve => {
        //     const currentWeatherClass = new WeatherClass(resolve.data);
        //     console.log(resolve.data);
        //     currentWeatherClass.showCurrentWeatherConditions();

        //     AirQuality.downloadAirQualityData().then(resolve => {
        //         document.querySelector(".current-air-results").setAttribute("style", "display: grid");
        //         const airQualityResults = new AirQuality(resolve.data);
        //         airQualityResults.showAirQuality();
        //     })
        // }).catch(error =>{
        //     Error(error);
        // })
        loadWeatherData();
    }

});

//Obsługa wyszukiwania przez submit

document.querySelector(".input-text-submit").addEventListener("click", ()=>{
    event.preventDefault()
    const city = {
                q: document.querySelector(".input-text").value
            }   
    console.log(city);
    if(document.querySelector(".input-text").value != ""){
        loadWeatherData(city);
    }
    document.querySelector(".input-text").value = ""; 
})

// document.querySelector(".input-text-submit").addEventListener("click", () => {
//     event.preventDefault();
//     const city = {
//         q: document.querySelector(".input-text").value
//     }
//     document.querySelector(".input-text").value = "";

//     WeatherClass.downloadCurrentWeatherConditions(city).then(resolve => {
//         const currentWeaherConditions = new WeatherClass(resolve.data);
//         currentWeaherConditions.showCurrentWeatherConditions();
//         currentWeaherConditions.savelastSearchedLocationInLocalStorage(city);
//         const geoCords = {
//             lat: resolve.data.coord.lat,
//             lng: resolve.data.coord.lon
//         }

//         AirQuality.downloadAirQualityData(geoCords.lat, geoCords.lng).then(resolve => {
//             document.querySelector(".current-air-results").setAttribute("style", "display: grid");
//             const airQualityResults = new AirQuality(resolve.data);
//             airQualityResults.showAirQuality();
//             airQualityResults.saveGeoCordsFromLastSearchedLocation(geoCords);
//             localStorage.setItem("airQualityFlag", "flag");

//         }).catch(error => {
//             Error(error);
//             document.querySelector(".current-air-results").setAttribute("style", "display: none");
//             //localStorage.setItem("airQualityFlag", "true");
//         })
//     })
//         .catch((error => Error(error)))
// });

