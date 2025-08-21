'use client';

import Image from "next/image";
import Link from "next/link";
import AuthButtons from "./AuthButtons";
import { onAuthStateChangedListener } from "../lib/firebase";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";

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
            <AuthButtons user={user} />
        </nav>
    )
}