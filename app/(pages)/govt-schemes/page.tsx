"use client";

import React, { useEffect, useState } from "react";

interface Scheme {
  date: string;
  link: string;
  title: string;
}

export default function SchemesPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch("https://mission-ebook-jane-junction.trycloudflare.com/api/schemes");
        const text = await response.text();
        console.log("RAW RESPONSE:", text);

        const firstBracketIndex = text.indexOf("[");
        const lastBracketIndex = text.lastIndexOf("]") + 1;

        if (firstBracketIndex === -1 || lastBracketIndex === -1) {
          throw new Error("Valid JSON array not found in response");
        }

        const jsonString = text.substring(firstBracketIndex, lastBracketIndex);
        const data: Scheme[] = JSON.parse(jsonString);

        setSchemes(data);
      } catch (error) {
        console.error("Error fetching schemes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schemes.map((scheme, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:scale-105 transition-transform">
          <h2 className="text-xl font-bold mb-2">{scheme.title}</h2>
          <p className="text-gray-600 mb-1">Date: {scheme.date}</p>
          {scheme.link && (
            <a href={scheme.link} target="_blank" className="text-blue-500 underline">
              View More
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
