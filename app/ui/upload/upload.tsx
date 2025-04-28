"use client";

import React, { useRef, useState } from "react";
import Button from "../button/button";
import { useRouter } from "next/navigation";

export default function Upload({
  text,
  image,
  apiEndpoint, // <-- New prop for API endpoint
}: {
  text: string;
  image: string;
  apiEndpoint: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      setFileUploaded(true);

      // Save preview image temporarily
      localStorage.setItem("uploadedImage", fileUrl);

      // Send the file to backend
      const formData = new FormData();
      formData.append("file", file);

      try {
        setLoading(true);
        const response = await fetch(apiEndpoint, {  // <-- Dynamic API
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        console.log("Result from server:", result);

        // Save result temporarily
        localStorage.setItem("analysisResult", JSON.stringify(result));
      } catch (error) {
        console.error("Error uploading file", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSeeResults = () => {
    router.push("/see-result");
  };

  return (
    <div className="bg-tertiary text-main w-120 h-80 rounded-md flex flex-col justify-center items-center">
      {previewUrl ? (
        <img className="w-60 h-60 object-cover" src={previewUrl} alt="Uploaded" />
      ) : (
        <img className="w-60 h-60" src={image} alt="upload-preview" />
      )}

      <Button onClick={handleButtonClick} varient="secondary">
        {text}
      </Button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {fileUploaded && !loading && (
        <Button onClick={handleSeeResults} varient="primary">
          See Results
        </Button>
      )}

      {loading && <p className="mt-4 text-white">Processing...</p>}
    </div>
  );
}
