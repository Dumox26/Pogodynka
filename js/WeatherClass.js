class WeatherClass {
    constructor(weatherConditions) {
        this.city = weatherConditions.name,
            this.humidity = Math.round(weatherConditions.main.humidity),
            this.pressure = Math.round(weatherConditions.main.pressure),
            this.temp = Math.round(weatherConditions.main.temp),
            this.tempMax = Math.round(weatherConditions.main.temp_max),
            this.tempMin = Math.round(weatherConditions.main.temp_min)
        this.description = weatherConditions.weather[0].description,
            this.windSpeed = Math.round(weatherConditions.wind.speed),
            this.icon = weatherConditions.weather[0].icon
    }

    calculateWindSpeed() {
        return this.windSpeed * 3.6;
    }

    calculateDetectableTemp() {
        const windSpeed = this.calculateWindSpeed();
        return Math.round(13.12 + (0.6215 * this.temp) - Math.pow(11.37 * windSpeed, 0.16)
            + Math.pow(0.3965 * windSpeed * this.temp, 0.16));
    }

    savelastSearchedLocationInLocalStorage(inputValue) {
        try {
            localStorage.setItem("weatherConditionsLastLocation", JSON.stringify(inputValue));
        } catch (error) {
            Error(error);
        }
    }

    showCurrentWeatherConditions() {
        const iconAPiURL = "http://openweathermap.org/img/wn/";
        const weatherCurrentIcone = document.querySelector(".current-weather-img");
        const weatherCurrentDescription = document.querySelector(".current-weather-describe");
        const weatherCurrentTemp = document.querySelector(".current-temp-value");
        const weatherCurrentCity = document.querySelector(".current-city");
        const weatherCurrentDetailsTempMax = document.querySelector(".tempm-value");
        const weatherCurrentDetailsTempMin = document.querySelector(".templ-value ");
        const weatherConditionsDetailsHumidity = document.querySelector(".humidity-value");
        const weatherConditionsDetailsPressure = document.querySelector(".pressure-value");
        const weatherCurrentDetailsWindSpeed = document.querySelector(".wind-value");
        const weatherCurrentDetectableTemp = document.querySelector(".detectable-value");


        weatherCurrentIcone.setAttribute("src", iconAPiURL + this.icon + "@2x.png");
        weatherCurrentIcone.setAttribute("alt", this.description);
        weatherCurrentDescription.textContent = this.description;
        weatherCurrentTemp.textContent = this.temp + " \u2103";
        weatherCurrentCity.textContent = this.city;
        weatherCurrentDetailsTempMax.textContent = this.tempMax + " \u2103";
        weatherCurrentDetailsTempMin.textContent = this.tempMin + " \u2103";
        weatherConditionsDetailsHumidity.textContent = this.humidity + " %";
        weatherConditionsDetailsPressure.textContent = this.pressure + " hPa";
        weatherCurrentDetailsWindSpeed.textContent = this.calculateWindSpeed() + " km/h";
        weatherCurrentDetectableTemp.textContent = this.calculateDetectableTemp() + " \u2103";
    }

    static async downloadCurrentWeatherConditions(params = { q: "warszawa" }) {
        console.log(params);
        return await axios.get("http://api.openweathermap.org/data/2.5/weather?appid=92c581f751a8ab015bc220ef2217adf5&units=metric&lang=pl&",
            { params });
    }
}

document.querySelector(".activate-details-btn").addEventListener("click", () => {
    const weatherCnt = document.querySelector(".current-results-cnt");
    weatherCnt.classList.toggle("active-details");
})

export default WeatherClass;