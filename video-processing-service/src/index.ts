import express from 'express';
import { spawn } from 'child_process';

const app = express();
app.use(express.json());

app.post('/process-video', (req, res) => {
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath || !outputFilePath) {
        res.status(400).send('Bad request: missing file path');
    }

    const ffmpeg = spawn('ffmpeg', [
        '-i', inputFilePath,
        '-vf', 'scale=-1:360',
        outputFilePath
    ]);

    let stderrLog = '';

    ffmpeg.stderr.on('data', (data) => {
        stderrLog += data.toString();
    });

    ffmpeg.on('close', (code) => {
        if (code === 0) {
            res.status(200).send('Processing finised successfully');
        } else {
            res.status(500).send('Internal server error: ' + (stderrLog || `FFmpeg exited with code ${code}`))
        }
    });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Video processing service listening at http://localhost:${port}`);
});