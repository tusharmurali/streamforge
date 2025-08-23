import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import path from "path";

const generateUploadURL = httpsCallable(functions, "generateUploadURL");
const getVideosFromFirebase = httpsCallable(functions, "getVideos");
type VideoStatus = "processing" | "processed";
interface Video {
    id?: string;
    uid?: string;
    fileName?: string;
    status?: VideoStatus;
    title?: string;
    description?: string;
}

export async function uploadVideo(file: File) {
    const ext = path.extname(file.name);
    const response = await generateUploadURL({ ext });
    const { url, fileName } = response.data as {url: string, fileName: string};
    await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file
    });
    return fileName;
}

export async function getVideos() {
    const { data } = await getVideosFromFirebase();
    return data as Video[];
}