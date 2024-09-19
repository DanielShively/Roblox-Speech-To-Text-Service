const express = require('express');
const bodyParser = require('body-parser');
const speech = require('@google-cloud/speech');

const app = express();
app.use(bodyParser.json());

const client = new speech.SpeechClient();

app.get('/speech-to-text', async (req, res) => {
    const audioFile = req.query.audioFile; // Get the audio file URL (or stream) sent from Roblox

    const request = {
        audio: {
            content: audioFile, // This would be the base64-encoded audio file or a stream
        },
        config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        },
    };

    try {
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        res.json({ text: transcription });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing audio.');
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
