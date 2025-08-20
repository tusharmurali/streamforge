import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link href="/">
                <Image 
                    className={styles.logo}
                    src="/streamforge.svg" 
                    alt="StreamForge logo" 
                    height={40}
                    width={206}
                />
            </Link>
        </nav>
    )
}