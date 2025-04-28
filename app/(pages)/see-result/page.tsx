"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../ui/button/button";

interface AnalysisResult {
  [key: string]: any; // Flexible, accepts any keys from backend
}

export default function SeeResults() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const image = localStorage.getItem("uploadedImage");
    const result = localStorage.getItem("analysisResult");

    if (image) {
      setUploadedImage(image);
    }

    if (result) {
      setAnalysisResult(JSON.parse(result));
    }
  }, []);

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center pt-10 p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Analysis Results</h1>

      <div className="bg-tertiary rounded-lg p-8 w-full max-w-md flex flex-col items-center">
        {/* Display uploaded image */}
        {uploadedImage ? (
          <img
            src={uploadedImage}
            alt="Uploaded Result"
            className="w-60 h-60 object-cover rounded-md mb-6"
          />
        ) : (
          <p className="text-main mb-6">No image uploaded.</p>
        )}

        {/* Display analysis result */}
        {analysisResult ? (
          <div className="text-main w-full flex justify-center flex-col items-center">
            {Object.keys(analysisResult).map((key, idx) => (
              <div key={idx} className="mb-4">
                <h2 className="text-lg font-semibold capitalize">
                  {formatKey(key)}:{" "}
                  <span className="text-green-500">
                    {typeof analysisResult[key] === "string" ? analysisResult[key] : JSON.stringify(analysisResult[key])}
                  </span>
                </h2>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-main">No analysis data available.</p>
        )}

        {/* Go back button */}
        <Button onClick={handleGoBack} varient="secondary">
          Go Back
        </Button>
      </div>
    </div>
  );
}

// Helper function to make keys user friendly
function formatKey(key: string) {
  return key
    .replace(/_/g, " ")        // Replace underscores with spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize each word
}
