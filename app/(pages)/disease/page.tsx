"use client";

import React, { useRef, useState } from "react";
import Button from "../../ui/button/button"; // Your custom Button component

export default function UploadSoilImage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ soil_type: string; recommended_crop: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalysisResult(null); // Clear previous result
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);

      const response = await fetch("https://d0ac-49-36-178-47.ngrok-free.app/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload and analyze the image.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 gap-6">
      {!analysisResult ? (
        <>
          <h1 className="text-4xl font-bold text-white mb-4">Upload Soil Image</h1>

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {/* Choose Image Button */}
          <Button varient="primary" onClick={handleButtonClick}>
            Choose Image
          </Button>

          {/* Show selected filename */}
          {selectedFile && <p className="text-main">{selectedFile.name}</p>}

          {/* Upload Button */}
          {selectedFile && (
            <Button onClick={handleUpload} varient="secondary">
              {loading ? "Uploading..." : "Upload & Analyze"}
            </Button>
          )}
        </>
      ) : (
        <div className="bg-green-200 p-6 rounded-lg shadow-lg flex flex-col items-center max-w-md w-full">
          <h2 className="text-3xl font-bold mb-4 text-green-900">Analysis Results</h2>

          {/* Uploaded Image */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Uploaded Soil"
              className="w-64 h-64 object-cover rounded-md mb-4"
            />
          )}

          {/* Soil Type */}
          <p className="text-lg font-semibold mt-2">
            Soil Type:{" "}
            <span className="text-blue-700">{analysisResult.soil_type || "Unknown"}</span>
          </p>

          {/* Recommended Crop */}
          <p className="text-lg font-semibold mt-2">
            Recommended Crop:{" "}
            <span className="text-green-700">{analysisResult.recommended_crop || "None"}</span>
          </p>

          {/* Go Back Button */}
          <Button varient="primary" onClick={handleGoBack}>
            Go Back
          </Button>
        </div>
      )}
    </div>
  );
}
