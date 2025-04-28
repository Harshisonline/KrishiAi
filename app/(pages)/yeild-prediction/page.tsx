"use client";

import { useState } from "react";
import Button from "../../ui/button/button"; // adjust the path as per your structure

export default function YieldPrediction() {
    const [crop, setCrop] = useState("");
    const [state, setState] = useState("");
    const [season, setSeason] = useState("");
    const [area, setArea] = useState("");
    const [prediction, setPrediction] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handlePredict() {
        setLoading(true);
        setError("");
        setPrediction(null);

        try {
            const response = await fetch("https://93e5-2405-201-402f-d855-2370-8fb8-7c5e-bc68.ngrok-free.app/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ crop, state, season, area: Number(area) }),
            });

            const data = await response.json();

            if (response.ok && data.predicted_production !== undefined) {
                setPrediction(data.predicted_production);
            } else {
                setError(data.error || "Failed to predict yield.");
            }
        } catch (err) {
            setError("Backend server not reachable.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-anothershade p-8 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-8 text-main text-center">
                Crop Yield Prediction
            </h1>

            <div className="flex flex-col gap-6 w-full max-w-2xl">
                <div>
                    <label className="text-lg font-semibold text-main">Crop Name</label>
                    <input
                        type="text"
                        value={crop}
                        onChange={(e) => setCrop(e.target.value)}
                        placeholder="Enter crop name (e.g., Rice, Wheat)"
                        className="w-full p-3 mt-2 rounded-lg border focus:outline-none"
                    />
                </div>

                <div>
                    <label className="text-lg font-semibold text-main">State</label>
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Enter state name (e.g., Punjab, Maharashtra)"
                        className="w-full p-3 mt-2 rounded-lg border focus:outline-none"
                    />
                </div>

                <div>
                    <label className="text-lg font-semibold text-main">Season</label>
                    <input
                        type="text"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        placeholder="Enter season (e.g., Kharif, Rabi)"
                        className="w-full p-3 mt-2 rounded-lg border focus:outline-none"
                    />
                </div>

                <div>
                    <label className="text-lg font-semibold text-main">Area (in hectares)</label>
                    <input
                        type="number"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="Enter area in hectares"
                        className="w-full p-3 mt-2 rounded-lg border focus:outline-none"
                    />
                </div>
            </div>

            <div className="mt-10">
                <Button onClick={handlePredict} varient="primary">
                    {loading ? "Predicting..." : "Predict Yield"}
                </Button>
            </div>

            {prediction !== null && (
                <div className="mt-8 p-6 bg-green-100 border border-green-400 rounded-xl text-center shadow-md">
                    <h2 className="text-2xl font-bold text-green-700">
                        Estimated Production: {prediction} units
                    </h2>
                </div>
            )}

            {error && (
                <div className="mt-8 p-6 bg-red-100 border border-red-400 rounded-xl text-center shadow-md">
                    <h2 className="text-2xl font-bold text-red-700">
                        Error: {error}
                    </h2>
                </div>
            )}
        </div>
    );
}
