"use client";

import Card from "../frontcards/frontcards";
import { useRouter } from "next/navigation";

export default function BottomFooter() {
    const router = useRouter();

    function navigato(path: string) {
        router.push(path);
    }

    return (
        <div className="bg-anothershade flex justify-around items-center p-10 flex-wrap">
            <Card
                description="Check the latest weather update for your farm"
                heading="Weather Forecast"
                image="/weather.png"
                onClick={() => navigato("/weather")}
            />
            <Card
                description="Learn about government schemes and subsides"
                heading="Government Schemes"
                image="/govt.png"
                onClick={() => navigato("/govt-schemes")}
            />
            <Card
                description="Know about the quality of your crops and soil"
                heading="Crop health Analysis"
                image="/tractor.png"
                onClick={() => navigato("/crop-analysis")}
            />
        </div>
    );
}
