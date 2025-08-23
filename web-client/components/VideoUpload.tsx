"use client";

import { Fragment, useState } from "react";
import { uploadVideo } from "../lib/functions";

export default function VideoUpload() {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const filename = await uploadVideo(file);
            console.log("✅ Upload complete:", filename);
            alert("✅ Upload complete!");
        } catch (error) {
            console.error("❌ Upload failed:", error);
            alert("❌ Upload failed.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <Fragment>
            <input id="upload" type="file" accept="video/*" className="hidden" onChange={handleFileChange}/>
            <label htmlFor="upload" className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-300 text-black hover:bg-gray-200 transition">
                { uploading ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                  )
                }
            </label>
        </Fragment>
    )
}