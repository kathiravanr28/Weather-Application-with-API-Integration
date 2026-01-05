import WeatherService from "./weatherService.js";
import WeatherUI from "./ui.js";

const service = new WeatherService();
const ui = new WeatherUI();

let unit = "metric";
let currentCity = "";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const unitToggle = document.getElementById("unitToggle");

async function loadWeather(city) {
  try {
    currentCity = city;
    ui.showLoader();

    const current = await service.getCurrentWeather(city, unit);
    const forecast = await service.getForecast(city, unit);

    // Pass a function to load weather when a favorite is clicked
    ui.showCurrent(current, unit, loadWeather);
    ui.showForecast(forecast, unit);
  } catch (err) {
    console.error(err);
    ui.showError("City not found or API error");
  } finally {
    ui.hideLoader();
  }
}

searchBtn.onclick = () => {
  if (searchInput.value.trim()) {
    loadWeather(searchInput.value.trim());
  }
};

unitToggle.onclick = () => {
  unit = unit === "metric" ? "imperial" : "metric";
  unitToggle.textContent = unit === "metric" ? "Switch to °F" : "Switch to °C";
  if (currentCity) loadWeather(currentCity);
};

document.addEventListener("DOMContentLoaded", () => {
  loadWeather("Chennai");
});
