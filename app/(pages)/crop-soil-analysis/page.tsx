"use client";

import React, { useRef, useState } from "react";
import Button from "../../ui/button/button";
import { useRouter } from "next/navigation";

export default function UploadSoilImage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // <-- Using router to redirect

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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

      const response = await fetch("https://6481-49-36-178-47.ngrok-free.app/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Save image and analysis result to localStorage
      localStorage.setItem("uploadedImage", URL.createObjectURL(selectedFile));
      localStorage.setItem("analysisResult", JSON.stringify(data));

      // Redirect to SeeResults page
      router.push("/see-result");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload and analyze the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 gap-6">
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
    </div>
  );
}
