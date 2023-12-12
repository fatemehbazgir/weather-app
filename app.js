import getWeatherData from "./utils/httpReq.js";
import { removeModal, showModal } from "./utils/modals.js";
import { getWeekDay } from "./utils/customeDate.js";
const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const forecastContainer = document.getElementById("forecast");
const locationIcon = document.getElementById("location");
const modalButton = document.getElementById("modal-button");
const positionCallback = async (position) => {
  const { latitude, longitude } = position.coords;
  const currentData = await getWeatherData("current", position.coords);
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", position.coords);
  renderForecastWeather(forecastData);
};
const errorCallback = (error) => {
  showModal(error.message);
};
const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    showModal("your browser error not support geolocation.");
  }
};
const renderCurrentWeather = (data) => {
  if (!data) return;
  const weatherJSX = `
    <h1>${data.name} , ${data.sys.country}</h1>
    <div id="main">
    <img alt="weather icon" src="http://openweathermap.org/img/w/${
      data.weather[0].icon
    }.png">
    <span>${data.weather[0].main}</span>
    <p>${Math.round(data.main.temp)} °C</p>
    </div>
    <div id="info">
    <p>Humidity: <span>${data.main.humidity}%</span></p>
    <p>Wind Speed: <span>${data.wind.speed} m/s</span></p>
    </div>
    `;
  weatherContainer.innerHTML = weatherJSX;
};
const renderForecastWeather = (data) => {
  forecastContainer.innerHTML = "";
  if (!data) return;
  forecastContainer.innerHTML = "";
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));
  data.forEach((i) => {
    const forecastJSX = `
        <div>
        <img alt="weather icon" src="https://api.openweathermap.org/img/w/${
          i.weather[0].icon
        }.png">
        <h3>${getWeekDay(i.dt)}</h3>
        <p>${Math.round(i.main.temp)}°C</p>
        <span>${i.weather[0].main}</span>
        </div>
        `;
    forecastContainer.innerHTML += forecastJSX;
  });
};
const searchHandler = async () => {
  const cityName = searchInput.value;
  if (!cityName) {
    showModal("please enter city name");
    return;
  }
  const currentData = await getWeatherData("current", cityName);
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", cityName);
  renderForecastWeather(forecastData);
};

const initHandler = async () => {
  const currentData = await getWeatherData("current", "shush");
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", "shush");
  renderForecastWeather(forecastData);
};
searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
modalButton.addEventListener("click", removeModal);
document.addEventListener("DOMContentLoaded", initHandler);
