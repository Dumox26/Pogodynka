/* eslint-disable import/extensions */
/* eslint-disable no-restricted-globals */

import WeatherClass from './WeatherClass.js';
import AirQuality from './AirQualityClass.js';

function loadAirQualityData(lat = '52.23', lng = '21.01') {
  const currentAirResults = document.querySelector('.current-air-results');
  const loaderCnt = document.querySelector('.loader-cnt');

  AirQuality.downloadAirQualityData(lat, lng).then((airQualityData) => {
    const currentAirQuality = new AirQuality(airQualityData.data);
    currentAirResults.setAttribute('style', 'display: grid');
    currentAirQuality.showAirQuality();
    const geoCords = {
      lat,
      lng,
    };
    currentAirQuality.saveGeoCordsFromLastSearchedLocation(geoCords);
    localStorage.setItem('airQualityFlag', 'flag');
    loaderCnt.setAttribute('style', 'display: none');
  })

    .catch((error) => {
      Error(error);
      currentAirResults.setAttribute('style', 'display: none');
      localStorage.removeItem('airQualityFlag');
      loaderCnt.setAttribute('style', 'display: none');
    });
}

function resizeContainer(container) {
  const containerToResize = document.querySelector(`.${container}`);
  const containerToResizeStyle = window.getComputedStyle(containerToResize);

  if (containerToResizeStyle.getPropertyValue('display') === 'flex') {
    const currentResultsCnt = document.querySelector('.current-results-cnt');
    const currentResultsHeader = document.querySelector('.current-results-header');
    const containerSize = currentResultsCnt.clientHeight - currentResultsHeader.clientHeight;
    containerToResize.style.height = `${containerSize}px`;
  }
}

function showErrorMessage(inputValue) {
  const loaderCnt = document.querySelector('.loader-cnt');
  loaderCnt.setAttribute('style', 'display: none');

  const errorMessageCnt = document.querySelector('.error-message-cnt');
  errorMessageCnt.setAttribute('style', 'display: flex');

  resizeContainer('error-message-cnt');

  const currentCity = document.querySelector('.current-city');
  currentCity.textContent = 'Błąd';

  const errorMessage = errorMessageCnt.querySelector('.error-message');
  errorMessage.textContent = `Nie znalezionio danych dla ${inputValue}. \n
                                    Upewnij się, że wpisałeś poprawne dane.`;
}

function loadWeatherData(inputValue = { q: 'warszawa' }) {
  WeatherClass.downloadCurrentWeatherConditions(inputValue).then((weatherData) => {
    const currentWeather = new WeatherClass(weatherData.data);
    currentWeather.showCurrentWeatherConditions();
    currentWeather.saveLastSearchedLocationInLocalStorage(inputValue);
    loadAirQualityData(weatherData.data.coord.lat, weatherData.data.coord.lon);
  })

    .catch((error) => {
      Error(error);
      showErrorMessage(inputValue.q);
    });
}

function bindSearchButton() {
  event.preventDefault();

  const errorMessageCnt = document.querySelector('.error-message-cnt');
  errorMessageCnt.setAttribute('style', 'display: none');

  const loaderCnt = document.querySelector('.loader-cnt');
  loaderCnt.setAttribute('style', 'display: flex');

  const inputText = document.querySelector('.input-text');
  resizeContainer('loader-cnt');

  const city = {
    q: inputText.value,
  };

  if (inputText.value !== '') {
    loadWeatherData(city);
  }

  inputText.blur();
  inputText.value = '';
}

// Resize loader

resizeContainer('loader-cnt');
window.addEventListener('resize', () => {
  resizeContainer('loader-cnt');
  resizeContainer('error-message-cnt');
});

// Geolocalization
navigator.geolocation.getCurrentPosition((position) => {
  const parameters = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  loadWeatherData(parameters);
}, () => {
  // refuse to geolocalization
  // download data for last searched localization

  if (localStorage.getItem('weatherConditionsLastLocation') != null) {
    const lastSearchedLocalization = JSON.parse(localStorage.getItem('weatherConditionsLastLocation'));
    loadWeatherData(lastSearchedLocalization);
  } else {
    loadWeatherData();
  }
});

// submit click

document.querySelector('.input-text-submit').addEventListener('click', bindSearchButton, false);
document.querySelector('.input-text-submit').addEventListener('touch', bindSearchButton, false);
document.querySelector('.input-text-submit').addEventListener('submit', bindSearchButton, false);
