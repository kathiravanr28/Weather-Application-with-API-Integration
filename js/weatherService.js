import { CONFIG } from "./config.js";

class WeatherService {
  constructor(apiKey) {
    this.apiKey = CONFIG.API_KEY;
    this.baseUrl = CONFIG.BASE_URL;
    this.geoUrl = CONFIG.GEO_URL;
  }

  async getCurrentWeather(city, unit = "metric") {
    const res = await fetch(
      `${this.baseUrl}/weather?q=${city}&units=${unit}&appid=${this.apiKey}`
    );
    if (!res.ok) throw new Error("City not found");
    return res.json();
  }

  async getForecast(city, unit = "metric") {
    const res = await fetch(
      `${this.baseUrl}/forecast?q=${city}&units=${unit}&appid=${this.apiKey}`
    );
    if (!res.ok) throw new Error("Forecast not found");
    return res.json();
  }
}

export default WeatherService;
