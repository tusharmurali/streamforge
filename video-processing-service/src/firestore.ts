import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore"

initializeApp();
const firestore = getFirestore();
const videoCollectionName = "videos";
export type VideoStatus = "processing" | "processed";
export interface Video {
    id?: string;
    uid?: string;
    fileName?: string;
    status?: VideoStatus;
    title?: string;
    description?: string;
}

async function getVideo(videoId: string) {
    const snapshot = await firestore.collection(videoCollectionName).doc(videoId).get();
    return (snapshot.data() as Video) ?? null;
}

export async function isNewVideo(videoId: string) {
    const video = await getVideo(videoId);
    return video?.status === undefined;
}

export function setVideo(videoId: string, video: Video) {
    return firestore.collection(videoCollectionName).doc(videoId).set(video, { merge: true });
}