import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '24f246d079655b17050f8b185f170612';

const WeatherApp = () => {
    const [city, setCity] = useState('Москва');
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchWeather = async (city) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=ru`
            );
            setWeather(response.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        const savedCity = localStorage.getItem('city');
        if (savedCity) {
            setCity(savedCity);
        }
        fetchWeather(savedCity || city);

        const interval = setInterval(() => {
            fetchWeather(city);
        }, 600000); // 10 минут

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        localStorage.setItem('city', city);
        fetchWeather(city);
    }, [city]);

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    const handleUpdateClick = () => {
        fetchWeather(city);
    };

    return (
        <div className="weather-app">
            <h1>Погода</h1>
            <input type="text" value={city} onChange={handleCityChange} />
            <button onClick={handleUpdateClick}>Обновить</button>
            {loading ? (
                <p>Загрузка...</p>
            ) : weather ? (
                <div>
                    <h2>{weather.name}</h2>
                    <p>Температура: {weather.main.temp} °C</p>
                    <p>Описание: {weather.weather[0].description}</p>
                    <img
                        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                        alt="Иконка погоды"
                    />
                </div>
            ) : (
                <p>Данные о погоде не найдены.</p>
            )}
        </div>
    );
};

export default WeatherApp;
