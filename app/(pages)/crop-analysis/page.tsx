"use client";
import Upload from "@/app/ui/upload/upload";
import { useRouter } from "next/navigation";

export default function Page2() {
  const router = useRouter();


  return (
    <div className="bg-main h-[91vh]">
      <div className="flex flex-col justify-center items-center pt-10">
        <div className="text-tertiary">
          <h1 className="font-bold text-7xl">Crop & Soil Analysis</h1>
          <br />
          <p className="font-semibold text-lg text-center">
            Upload Image of your crop or soil to receive insights and recommendations
          </p>
        </div>
      </div>

      <div className="m-10 flex justify-center items-center gap-10">
        <Upload
          text="Upload Crop Image"
          image="/plant.png"
          apiEndpoint="https://d0ac-49-36-178-47.ngrok-free.app/predict"
        />
        <Upload
          text="Upload Soil Image"
          image="/soil.png"
          apiEndpoint="https://6481-49-36-178-47.ngrok-free.app/predict"
        />
      </div>
    </div>
  );
}
