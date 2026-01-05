import { CONFIG } from "./config.js";

export default class WeatherService {

    async getCurrentWeather(city, unit) {
        const res = await fetch(
            `${CONFIG.BASE_URL}/weather?q=${city}&units=${unit}&appid=${CONFIG.API_KEY}`
        );
        if (!res.ok) throw new Error("City not found");
        return res.json();
    }

    async getForecast(city, unit) {
        const res = await fetch(
            `${CONFIG.BASE_URL}/forecast?q=${city}&units=${unit}&appid=${CONFIG.API_KEY}`
        );
        if (!res.ok) throw new Error("Forecast error");
        return res.json();
    }

    async getCitySuggestions(query) {
        const res = await fetch(
            `${CONFIG.GEO_URL}/direct?q=${query}&limit=5&appid=${CONFIG.API_KEY}`
        );
        return res.json();
    }
}
