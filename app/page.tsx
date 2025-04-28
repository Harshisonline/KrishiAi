'use client';

import Button from "./ui/button/button";
import { useRouter } from "next/navigation";
import BottomFooter from "./ui/bottomfooter/bottomfooter";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div className="bg-main flex justify-evenly items-center max-h-[400px]">
        <div>
          <div className="text-5xl font-bold text-tertiary">
            Empowering Farmers
            <br />
            with AI
          </div>
          <div className="mt-5 text-tertiary font-semithin">
            Revolutionising Agriculture through advanced technology
          </div>
          <div className="mt-10 ml-10">
            <Button varient="primary" onClick={() => router.push("/yeild-prediction")}>
              Know Your Yield
            </Button>
          </div>
        </div>
        <div className="h-[400px]">
          <img
            src="/farmer.png"
            alt="My Image"
            className="w-full h-full"
          />
        </div>
      </div>
      <BottomFooter />
    </div>
  );
}
