import WeatherClass from "./WeatherClass.js"
import AirQuality from "./AirQualityClass.js"

// Gelokalizacja
navigator.geolocation.getCurrentPosition((position) => {
    console.log(position.coords);
    const parameters = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
    WeatherClass.downloadCurrentWeatherConditions(parameters).then(resolve => {
        const currentWeaherConditions = new WeatherClass(resolve.data);
        currentWeaherConditions.showCurrentWeatherConditions();
        AirQuality.downloadtAirQualityData(position.coords.latitude, position.coords.longitude).then(resolve => {
            const airQualityResults = new AirQuality(resolve.data);
            document.querySelector(".current-air-results").setAttribute("style", "display: grid");
            airQualityResults.showAirQuality();
        }).catch(error => { Error(error) })
    })
        .catch((error => Error(error)))

}, reject => {
    //Nie udzielenie zgody na geolokaizacje
    //wywoływanie pogody dla ostatniej lokalizacji
    if (localStorage.getItem("weatherConditionsLastLocation") != "") {
        const lastSearchedLocalization = JSON.parse(localStorage.getItem("weatherConditionsLastLocation"));
        WeatherClass.downloadCurrentWeatherConditions(lastSearchedLocalization).then(resolve => {
            const currentWeatherConditions = new WeatherClass(resolve.data);
            currentWeatherConditions.showCurrentWeatherConditions();
            const lastSearchedLocalizationGeoCords = JSON.parse(localStorage.getItem("airQualityGeoCords"));
            if (localStorage.getItem("airQualityFlag") === "false") {
                document.querySelector(".current-air-results").setAttribute("style", "display: grid");
                AirQuality.downloadtAirQualityData(lastSearchedLocalizationGeoCords.lat, lastSearchedLocalizationGeoCords.lng).then(resolve => {
                    const airQualityResults = new AirQuality(resolve.data)
                    airQualityResults.showAirQuality();
                })
            } else {
                document.querySelector(".current-air-results").setAttribute("style", "display: none");
            }
        })
    } else {
        WeatherClass.downloadCurrentWeatherConditions().then(resolve => {
            const currentWeatherClass = new WeatherClass(resolve.data);
            console.log(resolve.data);
            currentWeatherClass.showCurrentWeatherConditions();
            AirQuality.downloadtAirQualityData().then(resolve => {
                document.querySelector(".current-air-results").setAttribute("style", "display: grid");
                const airQualityResults = new AirQuality(resolve.data);
                airQualityResults.showAirQuality();
            })
        })
    }

});

//Obsługa wyszukiwania przez submit

document.querySelector(".input-text-submit").addEventListener("click", () => {
    event.preventDefault();
    const parameters = {
        q: document.querySelector(".input-text").value
    }
    document.querySelector(".input-text").value = "";
    WeatherClass.downloadCurrentWeatherConditions(parameters).then(resolve => {
        const currentWeaherConditions = new WeatherClass(resolve.data);
        currentWeaherConditions.showCurrentWeatherConditions();
        currentWeaherConditions.savelastSearchedLocationInLocalStorage(parameters);
        const geoCords = {
            lat: resolve.data.coord.lat,
            lng: resolve.data.coord.lon
        }
        console.log(geoCords);
        AirQuality.downloadtAirQualityData(geoCords.lat, geoCords.lng).then(resolve => {
            console.log("sadfassa");
            document.querySelector(".current-air-results").setAttribute("style", "display: grid");
            const airQualityResults = new AirQuality(resolve.data);
            airQualityResults.showAirQuality();
            console.log(geoCords);
            airQualityResults.saveGeoCordsFromLastSearchedLocation(geoCords);
            localStorage.setItem("airQualityFlag", "false");
        }).catch(error => {
            Error(error);
            document.querySelector(".current-air-results").setAttribute("style", "display: none");
            localStorage.setItem("airQualityFlag", "true");
        })
    })
        .catch((error => Error(error)))
});

