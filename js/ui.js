import { getFavorites, saveFavorite, removeFavorite } from "./storage.js";

export default class WeatherUI {
  constructor() {
    this.currentWeather = document.getElementById("currentWeather");
    this.forecast = document.getElementById("forecast");
    this.favoriteList = document.getElementById("favoriteList");
    this.suggestions = document.getElementById("suggestions");

    // Render favorites on page load
    this.updateFavorites();
  }

  /* ========= Loader ========= */
  showLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.remove("hidden");
  }

  hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hidden");
  }

  /* ========= Error ========= */
  showError(message) {
    if (!this.currentWeather) return;

    this.currentWeather.innerHTML = `
      <div class="weather-card error">
        <p>${message}</p>
      </div>
    `;

    if (this.forecast) this.forecast.innerHTML = "";
  }

  /* ========= Current Weather ========= */
  showCurrent(data, unit, onFavoriteClick) {
    if (!this.currentWeather) return;

    const isFavorited = getFavorites().includes(data.name);

    this.currentWeather.innerHTML = `
      <div class="weather-card">
        <h2>${data.name}, ${data.sys.country}</h2>

        <div class="temperature">
          ${Math.round(data.main.temp)}°${unit === "metric" ? "C" : "F"}
        </div>

        <div class="weather-icon ${this.getIconClass(data.weather[0].main)}"></div>

        <p class="description">${data.weather[0].description}</p>

        <button id="favBtn">${isFavorited ? "⭐ Favorited" : "⭐ Add to Favorites"}</button>
      </div>
    `;

    // Favorite button click
    const favBtn = document.getElementById("favBtn");
    if (favBtn) {
      favBtn.addEventListener("click", () => {
        if (!isFavorited) {
          saveFavorite(data.name);
          favBtn.textContent = "⭐ Favorited";
          this.updateFavorites(onFavoriteClick); // immediately show favorite
        }
      });
    }
  }

  /* ========= Forecast ========= */
  showForecast(data, unit) {
    if (!this.forecast || !data?.list) return;

    let html = `<h3 class="forecast-title">5-Day Forecast</h3>`;

    data.list
      .filter((_, i) => i % 8 === 0)
      .forEach(day => {
        html += `
          <div class="weather-card forecast-card">
            <strong>${new Date(day.dt * 1000).toDateString()}</strong>
            <p>${Math.round(day.main.temp)}°${unit === "metric" ? "C" : "F"}</p>
          </div>
        `;
      });

    this.forecast.innerHTML = html;
  }

  /* ========= Weather Icons ========= */
  getIconClass(condition) {
    switch (condition) {
      case "Clear": return "icon-clear";
      case "Clouds": return "icon-clouds";
      case "Rain": return "icon-rain";
      case "Thunderstorm": return "icon-thunder";
      case "Snow": return "icon-snow";
      default: return "icon-mist";
    }
  }

  /* ========= Favorites ========= */
  updateFavorites(onClickHandler) {
    const favs = getFavorites();
    if (!this.favoriteList) return;

    this.favoriteList.innerHTML = "";

    favs.forEach(city => {
      const li = document.createElement("li");
      li.textContent = city;
      li.style.cursor = "pointer";
      li.title = "Click to remove from favorites";

      li.addEventListener("click", () => {
        removeFavorite(city);
        this.updateFavorites(onClickHandler);
        // Optional: load weather for this city when clicked
        if (onClickHandler) onClickHandler(city);
      });

      this.favoriteList.appendChild(li);
    });
  }

  /* ========= Suggestions ========= */
  renderSuggestions(cities, clickHandler) {
    if (!this.suggestions) return;

    this.suggestions.innerHTML = "";

    cities.forEach(city => {
      const div = document.createElement("div");
      div.textContent = `${city.name}, ${city.country}`;
      div.onclick = () => clickHandler(city.name);
      this.suggestions.appendChild(div);
    });
  }

  clearSuggestions() {
    if (this.suggestions) this.suggestions.innerHTML = "";
  }
}
