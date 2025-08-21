import { Fragment } from "react";
import { signInWithGoogle, signOutUser } from "../lib/firebase";
import { User } from "firebase/auth";

interface Props {
    user: User | null;
}

export default function AuthButtons({ user }: Props) {
    return (
        <Fragment>
            {user ? (
                <button className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 cursor-pointer" onClick={signOutUser}>
                    Sign Out
                </button>
            ) : (
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 cursor-pointer" onClick={signInWithGoogle}>
                    Sign In
                </button>
            )}
        </Fragment>
    )
}