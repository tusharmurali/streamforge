"use client";

import Image from "next/image";
import Link from "next/link";
import AuthButtons from "./AuthButtons";
import { onAuthStateChangedListener } from "../lib/firebase";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import VideoUpload from "./VideoUpload";

export default function Navbar() {
    // State to store the current user data
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => {
            setUser(user);
        });

        // Cleanup listener on unmount or effect re-run
        return () => unsubscribe();
    });
    return (
        <nav className="flex justify-between items-center px-4 py-2">
            <Link href="/">
                <Image 
                    className="cursor-pointer"
                    src="/streamforge.svg" 
                    alt="StreamForge logo" 
                    height={40}
                    width={206}
                />
            </Link>
            { user && <VideoUpload /> }
            <div className="flex items-center gap-4">
                <Link
                    href="https://github.com/tusharmurali/streamforge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-600 hover:text-black"
                >
                    <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577v-2.165c-3.338.725-4.033-1.61-4.033-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.304.762-1.604-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.467-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.234 1.91 1.234 3.22 0 4.61-2.807 5.625-5.48 5.922.43.372.823 1.102.823 2.222v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    <span className="hidden sm:inline">GitHub</span>
                </Link>
                <AuthButtons user={user} />
            </div>
        </nav>
    )
}