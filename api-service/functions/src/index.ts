import * as functions from "firebase-functions/v1";
import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {Storage} from "@google-cloud/storage";
import {onCall, HttpsError} from "firebase-functions/https";

const app = initializeApp();
const firestore = getFirestore(app);
const storage = new Storage();
const rawVideoBucketName = "streamforge-raw-videos";

export const onUserCreated = functions
  .region("australia-southeast1")
  .auth.user()
  .onCreate((user) => {
    const {displayName, email, photoURL, uid} = user;
    const userInfo = {displayName, email, photoURL, uid};
    firestore.collection("users").doc(uid).set(userInfo);
    logger.info(`New user created: ${user.uid}, email: ${user.email}`);
  });

export const generateUploadURL = onCall({
  region: "australia-southeast1",
  maxInstances: 1,
}, async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );
  }

  const ext = request.data?.ext;
  if (!ext) {
    throw new HttpsError("invalid-argument", "Missing file extension.");
  }

  const fileName = `${request.auth.uid}_${Date.now()}${ext}`;

  const [url] = await storage
    .bucket(rawVideoBucketName)
    .file(fileName)
    .getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

  return {url, fileName};
});
