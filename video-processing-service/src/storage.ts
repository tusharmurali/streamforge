import { Storage } from '@google-cloud/storage';
import { spawn } from 'child_process';
import fs from 'fs';

const storage = new Storage();

const rawVideoBucketName = 'streamforge-raw-videos';
const processedVideoBucketName = 'streamforge-processed-videos';

const rawVideoFilePath = './raw-videos';
const processedVideoFilePath = './processed-videos';

/**
 * Creates local directories inside the Docker container for the raw and processed videos.
 */
export function createDirectories() {
    ensureDirectoryExists(rawVideoFilePath);
    ensureDirectoryExists(processedVideoFilePath);
}

/**
 * Converts raw video to processed video.
 * @param rawVideoFileName - The name of the raw video.
 * @param processedVideoFileName - The name of the processed video.
 * @returns A promise that resolves when the video has been converted.
 */
export function convertVideo(rawVideoFileName: string, processedVideoFileName: string) {
    return new Promise<void>((resolve, reject) => {
        const ffmpeg = spawn('ffmpeg', [
            '-i', `${rawVideoFilePath}/${rawVideoFileName}`,
            '-vf', 'scale=-1:360',
            `${processedVideoFilePath}/${processedVideoFileName}`
        ]);

        let stderrLog = '';

        ffmpeg.stderr.on('data', (data) => {
            stderrLog += data.toString();
        });

        ffmpeg.on('close', (code) => {
            if (code === 0) {
                console.log('Processing finised successfully');
                resolve();
            } else {
                const errorMessage = stderrLog || `FFmpeg exited with code ${code}`;
                console.log('Internal server error: ' + errorMessage);
                reject(new Error(errorMessage));
            }
        });
    });
}

/**
 * Downloads a file from the raw video bucket into the raw video file path.
 * @param rawVideoFileName - The name of the file to download from bucket {@link rawVideoBucketName} 
 * into folder {@link rawVideoFilePath}.
 * @returns A promise that resolves when the file has been downloaded.
 */
export async function downloadRawVideoFromBucket(rawVideoFileName: string) {
    const destFileName = `${rawVideoFilePath}/${rawVideoFileName}`;
    await storage.bucket(rawVideoBucketName)
        .file(rawVideoFileName)
        .download({ destination: destFileName });
    
    console.log(
      `gs://${rawVideoBucketName}/${rawVideoFileName} downloaded to ${destFileName}.`
    );
}

/**
 * Uploads a file from the processed video file path to the processed video bucket.
 * @param processedVideoFileName - The name of the file to upload from folder {@link processedVideoFilePath} 
 * to bucket {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideoToBucket(processedVideoFileName: string) {
    const bucket = storage.bucket(processedVideoBucketName);
    await bucket.upload(`${processedVideoFilePath}/${processedVideoFileName}`, { 
        destination: processedVideoFileName
    });
    console.log(`${processedVideoFilePath}/${processedVideoFileName} uploaded to gs://${processedVideoBucketName}/${processedVideoFileName}`);
}

/**
 * Deletes a file from the local file system for cleanup.
 * @param filePath - The full path to the file that needs to be deleted.
 * @returns A promise that resolves when the file has been deleted.
 */
function deleteFileFromLocal(filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Error deleting file at ${filePath}: ${err}`);
                    reject(err);
                } else {
                    console.log(`File at ${filePath} has been deleted.`);
                    resolve();
                }
            })
        } else {
            console.log(`File at ${filePath} does not exist.`);
            resolve();
        }
    });
}

/**
 * Deletes a raw video file from the local file system for cleanup.
 * @param rawVideoFileName - The name of the raw video file to be deleted.
 * @returns A promise that resolves when the file has been deleted, or rejects if the file doesn't exist.
 */
export function deleteRawVideoFromLocal(rawVideoFileName: string) {
    return deleteFileFromLocal(`${rawVideoFilePath}/${rawVideoFileName}`);
}

/**
 * Deletes a processed video file from the local file system for cleanup.
 * @param processedVideoFileName - The name of the processed video file to be deleted.
 * @returns A promise that resolves when the file has been deleted, or rejects if the file doesn't exist.
 */
export function deleteProcessedVideoFromLocal(processedVideoFileName: string) {
    return deleteFileFromLocal(`${processedVideoFilePath}/${processedVideoFileName}`);
}

/**
 * Ensures that a directory exists, creating it if necessary.
 * @param dirPath - The path of the directory to check or create.
 */
function ensureDirectoryExists(dirPath: string) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created: ${dirPath}`);
    }
}