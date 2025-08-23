// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    onAuthStateChanged,
    User
} from "firebase/auth";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6I0WiNPomoe9AcVw27a_1bwibrLxH9bc",
  authDomain: "tusharmurali-streamforge.firebaseapp.com",
  projectId: "tusharmurali-streamforge",
  storageBucket: "tusharmurali-streamforge.firebasestorage.app",
  messagingSenderId: "262802352800",
  appId: "1:262802352800:web:7808b7a6b29e3af1f2b7c5",
  measurementId: "G-2Z61S73RPH"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const functions = getFunctions(app, "australia-southeast1");
if (typeof window !== "undefined") getAnalytics(app);

/**
 * Initiates a Google sign-in flow using a popup window.
 * @returns A promise that resolves with the user's sign-in credentials.
 */
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the current user out of the Firebase authentication session.
 * @returns A promise that resolves when the sign-out is complete.
 */
export function signOutUser() {
    return auth.signOut();
}

/**
 * Subscribes to Firebase authentication state changes.
 * @param callback - Function called with the current user or null on auth state changes.
 * @returns A function to unsubscribe from the auth state listener.
 */
export function onAuthStateChangedListener(
  callback: (user: User | null) => void
) {
  return onAuthStateChanged(auth, callback);
}

export { app, auth, functions };