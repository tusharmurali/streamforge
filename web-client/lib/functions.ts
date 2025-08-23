import { getApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import path from "path";

const functions = getFunctions(getApp(), "australia-southeast1");
const generateUploadURL = httpsCallable(functions, "generateUploadURL");

export async function uploadVideo(file: File) {
    const ext = path.extname(file.name);
    const response = await generateUploadURL({ ext });
    const { url, fileName } = response.data as {url: string, fileName: string};
    await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": file.type
        },
        body: file
    });
    return fileName;
}