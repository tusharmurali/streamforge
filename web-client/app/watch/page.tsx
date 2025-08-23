export default async function Watch({ searchParams }: { searchParams: Promise<{ v?: string }> }) {
    const videoPrefix = "https://storage.googleapis.com/streamforge-processed-videos/";
    const { v: videoFileName } = await searchParams;

    return (
        <div>
            <h1 className="text-2xl font-semibold tracking-tight">Watch Page</h1>
            <video src={videoPrefix + videoFileName} controls></video>
        </div>
    );
}