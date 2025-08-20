import express from 'express';
import { 
    convertVideo, 
    createDirectories, 
    deleteProcessedVideoFromLocal, 
    deleteRawVideoFromLocal, 
    downloadRawVideoFromBucket, 
    uploadProcessedVideoToBucket 
} from './storage';

createDirectories();

const app = express();
app.use(express.json());

// Cloud Pub/Sub-triggered endpoint
app.post('/process-video', async (req, res) => {
    if (!req.body) {
        const msg = 'no Pub/Sub message received';
        console.error(`error: ${msg}`);
        res.status(400).send(`Bad Request: ${msg}`);
        return;
    }
    if (!req.body.message) {
        const msg = 'invalid Pub/Sub message format';
        console.error(`error: ${msg}`);
        res.status(400).send(`Bad Request: ${msg}`);
        return;
    }

    const pubSubMessage = req.body.message;
    if (!pubSubMessage.data) {
        const msg = 'missing "data" property in Pub/Sub message';
        console.error(`error: ${msg}`);
        res.status(400).send(`Bad Request: ${msg}`);
        return;
    }

    let parsedData;
    try {
        parsedData = JSON.parse(Buffer.from(pubSubMessage.data, 'base64').toString());
    } catch (error) {
        const msg = 'invalid JSON format in "data" property';
        console.error(`error: ${msg}`, error);
        res.status(400).send(`Bad Request: ${msg}`);
        return;
    }

    const rawVideoFileName = parsedData.name;
    if (!rawVideoFileName) {
        const msg = 'missing "name" property in parsed data';
        console.error(`error: ${msg}`);
        res.status(400).send(`Bad Request: ${msg}`);
        return;
    }
    
    const processedVideoFileName = `processed-${rawVideoFileName}`;
    try {
        await downloadRawVideoFromBucket(rawVideoFileName);
        await convertVideo(rawVideoFileName, processedVideoFileName);
        await uploadProcessedVideoToBucket(processedVideoFileName);
    } catch (error) {
        const msg = 'Error processing video';
        console.error(`error: ${msg}`, error);
        res.status(500).send(`Internal Server Error: ${msg}`);
        return;
    } finally {
        await Promise.allSettled([
            deleteRawVideoFromLocal(rawVideoFileName), 
            deleteProcessedVideoFromLocal(processedVideoFileName)
        ]);
    }

    res.status(200).send('Video processed successfully');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});