"use client";

import React, { useState } from "react";
import Button from "../../ui/button/button"; // Adjust this path based on your project
import { useRouter } from "next/navigation";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const response = await fetch(`https://1014-2405-201-402f-d855-2370-8fb8-7c5e-bc68.ngrok-free.app/weather?city=${city}`);
      const result = await response.json();
      setWeatherData(result);

      // Save temporarily for another page if you want
      localStorage.setItem("weatherData", JSON.stringify(result));
    } catch (error) {
      console.error("Error fetching weather", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[100vh]"><div className="bg-tertiary text-main w-120 min-h-[32rem] rounded-md flex flex-col justify-center items-center p-6">
      
      <h1 className="text-2xl font-bold mb-6">Live Weather Checker</h1>

      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
        className="mb-4 p-3 rounded-md text-black w-60 text-center"
      />

      <Button onClick={fetchWeather} varient="secondary">
        {loading ? "Loading..." : "Get Weather"}
      </Button>

      {weatherData && !loading && (
        <div className="mt-6 flex flex-col items-center gap-2 bg-primary p-6 rounded-xl">
          <h2 className="text-xl font-semibold">{city}</h2>
          <p>🌡️ Temperature: {weatherData.temperature} °C</p>
          <p>💧 Humidity: {weatherData.humidity} %</p>
          <p>⛅ Condition: {weatherData.condition}</p>
          <p>🌱 Advice: {weatherData.advice}</p>
        </div>
      )}

      {loading && <p className="mt-4 text-white">Fetching weather...</p>}

      <div className="mt-6">
        <Button onClick={() => router.push("/")} varient="primary">
          Go Home
        </Button>
      </div>

    </div>
    </div>
  );
}
