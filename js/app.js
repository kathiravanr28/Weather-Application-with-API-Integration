import WeatherService from "./weatherService.js";
import WeatherUI from "./ui.js";
import { getFavorites, saveFavorite } from "./storage.js";

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
        ui.showLoading();

        const current = await service.getCurrentWeather(city, unit);
        const forecast = await service.getForecast(city, unit);

        ui.clearStatus();
        ui.showCurrent(current, unit);
        ui.showForecast(forecast, unit);

        document.getElementById("favBtn").onclick = () => {
            saveFavorite(city);
            loadFavorites();
        };

    } catch (err) {
        ui.showError(err.message);
    }
}

function loadFavorites() {
    ui.renderFavorites(getFavorites(), loadWeather);
}

searchBtn.onclick = () => {
    if (searchInput.value) loadWeather(searchInput.value);
};

unitToggle.onclick = () => {
    unit = unit === "metric" ? "imperial" : "metric";
    unitToggle.textContent = unit === "metric" ? "Switch to °F" : "Switch to °C";
    if (currentCity) loadWeather(currentCity);
};

searchInput.oninput = async () => {
    if (searchInput.value.length < 2) return ui.clearSuggestions();
    const cities = await service.getCitySuggestions(searchInput.value);
    ui.renderSuggestions(cities, city => {
        searchInput.value = city;
        ui.clearSuggestions();
        loadWeather(city);
    });
};

loadFavorites();
