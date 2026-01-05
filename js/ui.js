export default class WeatherUI {

    constructor() {
        this.currentWeather = document.getElementById("currentWeather");
        this.forecast = document.getElementById("forecast");
        this.status = document.getElementById("status");
        this.favoriteList = document.getElementById("favoriteList");
        this.suggestions = document.getElementById("suggestions");
    }

    showLoading() {
        this.status.innerHTML = "<p class='loading'>Loading...</p>";
    }

    clearStatus() {
        this.status.innerHTML = "";
    }

    showError(msg) {
        this.status.innerHTML = `<p class="error">${msg}</p>`;
    }


    showCurrent(data, unit) {
        this.currentWeather.innerHTML = `
            <div class="weather-card">
                <h2>${data.name}, ${data.sys.country}</h2>
                <div class="temperature">
                    ${Math.round(data.main.temp)}°${unit === "metric" ? "C" : "F"}
                </div>
               <div class="weather-icon ${this.getIconClass(data.weather[0].main)}"></div>
                <p>${data.weather[0].description}</p>

                <button id="favBtn">⭐ Add to Favorites</button>
            </div>
        `;
    }

    showForecast(data, unit) {
        let html = "<h3 style='text-align:center'>5-Day Forecast</h3>";
        data.list.filter((_, i) => i % 8 === 0).forEach(day => {
            html += `
                <div class="weather-card">
                    <strong>${new Date(day.dt * 1000).toDateString()}</strong>
                    <p>${Math.round(day.main.temp)}°</p>
                </div>
            `;
        });
        this.forecast.innerHTML = html;
    }

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

    renderFavorites(favs, clickHandler) {
        this.favoriteList.innerHTML = "";
        favs.forEach(city => {
            const li = document.createElement("li");
            li.textContent = city;
            li.onclick = () => clickHandler(city);
            this.favoriteList.appendChild(li);
        });
    }

    renderSuggestions(cities, clickHandler) {
        this.suggestions.innerHTML = "";
        cities.forEach(city => {
            const div = document.createElement("div");
            div.textContent = `${city.name}, ${city.country}`;
            div.onclick = () => clickHandler(city.name);
            this.suggestions.appendChild(div);
        });
    }

    clearSuggestions() {
        this.suggestions.innerHTML = "";
    }
}
