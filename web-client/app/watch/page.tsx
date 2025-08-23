"use client";

import { useSearchParams } from "next/navigation";

export default function Watch() {
    const videoPrefix = "https://storage.googleapis.com/streamforge-processed-videos/";
    const videoFileName = useSearchParams().get("v");

    return (
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">Watch Page</h1>
            <video src={videoPrefix + videoFileName} controls></video>
        </div>
    );
}