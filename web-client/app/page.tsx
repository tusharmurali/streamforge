import { getVideos } from "../lib/functions";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 60;

export default async function Home() {
  const videos = await getVideos();
  console.log(videos);
  return (
    <main className="flex flex-row gap-[32px] row-start-2 items-center sm:items-start">
      {
        videos.map((video) => (
          <Link key={video.id} href={`/watch?v=${video.fileName}`}>
            <Image src="/thumbnail-placeholder.jpg" alt="Video thumbnail" width={320} height={180} className="m-2" />
          </Link>
        ))
      }
    </main>
  );
}
