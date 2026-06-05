// weatherAPI.js - Mengelola integrasi dengan OpenWeatherMap API
const WeatherAPI = (function() {
    // Konfigurasi API
    const API_KEY = 'aa8b4a07380e3c9454dc2247abcaa8b1'; // Ganti dengan API key Anda
    const CITY = 'Jakarta';
    const COUNTRY_CODE = 'ID';
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${API_KEY}&units=metric&lang=id`;
    
    // Cache untuk menyimpan data cuaca
    let weatherCache = {
        data: null,
        timestamp: null
    };
    
    // Durasi cache dalam milidetik (10 menit)
    const CACHE_DURATION = 10 * 60 * 1000;
    
    /**
     * Mendapatkan data cuaca dari API
     * @returns {Promise} Promise dengan data cuaca
     */
    async function fetchWeather() {
        // Cek cache terlebih dahulu
        if (weatherCache.data && weatherCache.timestamp) {
            const now = new Date().getTime();
            if (now - weatherCache.timestamp < CACHE_DURATION) {
                return weatherCache.data;
            }
        }
        
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Simpan ke cache
            weatherCache = {
                data: data,
                timestamp: new Date().getTime()
            };
            
            return data;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }
    
    /**
     * Memformat data cuaca untuk ditampilkan
     * @param {Object} weatherData - Data mentah dari API
     * @returns {Object} Data yang sudah diformat
     */
    function formatWeatherData(weatherData) {
        return {
            temperature: Math.round(weatherData.main.temp),
            description: weatherData.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
            city: weatherData.name
        };
    }
    
    /**
     * Memperbarui tampilan cuaca di UI
     * @param {HTMLElement} container - Elemen container untuk cuaca
     */
    async function updateWeatherDisplay(container) {
        if (!container) return;
        
        try {
            // Tampilkan loading
            container.innerHTML = '<div class="weather-loading">Memuat cuaca...</div>';
            
            // Ambil data cuaca
            const weatherData = await fetchWeather();
            const formattedData = formatWeatherData(weatherData);
            
            // Buat HTML untuk cuaca
            const weatherHTML = `
                <div class="weather-info">
                    <div class="weather-icon">
                        <img src="${formattedData.icon}" alt="${formattedData.description}">
                    </div>
                    <div class="weather-details">
                        <div class="weather-temp">${formattedData.temperature}°C</div>
                        <div class="weather-desc">${formattedData.description}</div>
                        <div class="weather-extra">
                            <span>Kelembaban: ${formattedData.humidity}%</span>
                            <span>Angin: ${formattedData.windSpeed} m/s</span>
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML = weatherHTML;
        } catch (error) {
            container.innerHTML = `
                <div class="weather-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    Gagal memuat cuaca. Coba lagi nanti.
                </div>
            `;
        }
    }
    
    // Public API
    return {
        updateWeatherDisplay
    };
})();