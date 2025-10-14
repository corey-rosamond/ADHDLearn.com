/**
 * Audio Generation Script for Aurora's Letter Adventure
 *
 * Uses ElevenLabs API to generate all required audio files:
 * - Target letter instructions ("Find the letter A!" through "Find the letter Z!")
 * - Letter sounds ("A" through "Z")
 * - Success sound
 * - Pop sound
 * - Welcome message
 * - Encouragement messages (good job, keep trying, etc.)
 *
 * Total: 60 audio files
 *
 * Usage:
 *   ELEVEN_LABS_API_KEY=your_key_here node scripts/generate-audio.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const API_KEY = process.env.ELEVEN_LABS_API_KEY;
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Rachel voice (child-friendly, clear)
// You can change this to any ElevenLabs voice ID

if (!API_KEY) {
    console.error('ERROR: ELEVEN_LABS_API_KEY environment variable not set');
    console.error('Usage: ELEVEN_LABS_API_KEY=your_key_here node scripts/generate-audio.js');
    process.exit(1);
}

// Ensure directories exist
const audioDir = path.join(__dirname, '..', 'assets', 'audio');
const lettersDir = path.join(audioDir, 'letters');

if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}
if (!fs.existsSync(lettersDir)) {
    fs.mkdirSync(lettersDir, { recursive: true });
}

/**
 * Generate audio using ElevenLabs API
 */
function generateAudio(text, outputPath) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            text: text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
            }
        });

        const options = {
            hostname: 'api.elevenlabs.io',
            port: 443,
            path: `/v1/text-to-speech/${VOICE_ID}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': API_KEY,
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            if (res.statusCode !== 200) {
                let errorData = '';
                res.on('data', (chunk) => {
                    errorData += chunk;
                });
                res.on('end', () => {
                    reject(new Error(`API error: ${res.statusCode} - ${errorData}`));
                });
                return;
            }

            const fileStream = fs.createWriteStream(outputPath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });

            fileStream.on('error', (err) => {
                reject(err);
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.write(data);
        req.end();
    });
}

/**
 * Delay between API calls to avoid rate limiting
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main generation function
 */
async function generateAllAudio() {
    console.log('🎵 Generating audio files for Aurora\'s Letter Adventure...\n');

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let successCount = 0;
    let failCount = 0;

    // 1. Generate "Find the letter X!" instructions
    console.log('📢 Generating target letter instructions...');
    for (const letter of letters) {
        const text = `Find the letter ${letter}!`;
        const filename = `find_letter_${letter}.mp3`;
        const filepath = path.join(audioDir, filename);

        // Skip if file already exists
        if (fs.existsSync(filepath)) {
            console.log(`  ⏭️  Skipped: ${filename} (already exists)`);
            successCount++;
            continue;
        }

        try {
            console.log(`  Generating: ${filename}`);
            await generateAudio(text, filepath);
            console.log(`  ✅ Saved: ${filename}`);
            successCount++;
            await delay(500); // 500ms delay between calls
        } catch (error) {
            console.error(`  ❌ Failed: ${filename} - ${error.message}`);
            failCount++;
        }
    }

    console.log('');

    // 2. Generate individual letter names ("A", "B", "C", etc.)
    // Use just the capital letter - TTS should recognize and pronounce the letter name
    console.log('🔤 Generating individual letter names...');
    for (const letter of letters) {
        const text = letter; // Just the capital letter (e.g., "P")
        const filename = `${letter}.mp3`;
        const filepath = path.join(lettersDir, filename);

        // Skip if file already exists
        if (fs.existsSync(filepath)) {
            console.log(`  ⏭️  Skipped: letters/${filename} (already exists)`);
            successCount++;
            continue;
        }

        try {
            console.log(`  Generating: letters/${filename}`);
            await generateAudio(text, filepath);
            console.log(`  ✅ Saved: letters/${filename}`);
            successCount++;
            await delay(500);
        } catch (error) {
            console.error(`  ❌ Failed: letters/${filename} - ${error.message}`);
            failCount++;
        }
    }

    console.log('');

    // 3. Generate success sound
    console.log('🎉 Generating success sound...');
    const successPath = path.join(audioDir, 'success.mp3');
    if (fs.existsSync(successPath)) {
        console.log(`  ⏭️  Skipped: success.mp3 (already exists)`);
        successCount++;
    } else {
        try {
            const successText = 'Great job!';
            console.log(`  Generating: success.mp3`);
            await generateAudio(successText, successPath);
            console.log(`  ✅ Saved: success.mp3`);
            successCount++;
        } catch (error) {
            console.error(`  ❌ Failed: success.mp3 - ${error.message}`);
            failCount++;
        }
    }

    console.log('');

    // 4. Generate pop sound (short "pop" sound)
    // NOTE: Consider replacing with a free sound effect from freesound.org or similar
    console.log('💥 Generating pop sound...');
    const popPath = path.join(audioDir, 'pop.mp3');
    if (fs.existsSync(popPath)) {
        console.log(`  ⏭️  Skipped: pop.mp3 (already exists)`);
        successCount++;
    } else {
        try {
            const popText = 'Pop!';
            console.log(`  Generating: pop.mp3`);
            await generateAudio(popText, popPath);
            console.log(`  ✅ Saved: pop.mp3`);
            successCount++;
        } catch (error) {
            console.error(`  ❌ Failed: pop.mp3 - ${error.message}`);
            failCount++;
        }
    }

    console.log('');

    // 5. Generate welcome message
    console.log('👋 Generating welcome message...');
    const welcomePath = path.join(audioDir, 'welcome.mp3');
    if (fs.existsSync(welcomePath)) {
        console.log(`  ⏭️  Skipped: welcome.mp3 (already exists)`);
        successCount++;
    } else {
        try {
            const welcomeText = "Welcome to Aurora's Reading Adventure!";
            console.log(`  Generating: welcome.mp3`);
            await generateAudio(welcomeText, welcomePath);
            console.log(`  ✅ Saved: welcome.mp3`);
            successCount++;
            await delay(500);
        } catch (error) {
            console.error(`  ❌ Failed: welcome.mp3 - ${error.message}`);
            failCount++;
        }
    }

    console.log('');

    // 6. Generate encouragement messages
    console.log('🌟 Generating encouragement messages...');
    const encouragements = [
        { text: 'Good job!', filename: 'good-job.mp3' },
        { text: "You'll get it next time!", filename: 'next-time.mp3' },
        { text: 'Keep trying!', filename: 'keep-trying.mp3' },
        { text: 'Nice try!', filename: 'nice-try.mp3' },
        { text: 'Almost there!', filename: 'almost.mp3' }
    ];

    for (const encouragement of encouragements) {
        const filepath = path.join(audioDir, encouragement.filename);

        // Skip if file already exists
        if (fs.existsSync(filepath)) {
            console.log(`  ⏭️  Skipped: ${encouragement.filename} (already exists)`);
            successCount++;
            continue;
        }

        try {
            console.log(`  Generating: ${encouragement.filename}`);
            await generateAudio(encouragement.text, filepath);
            console.log(`  ✅ Saved: ${encouragement.filename}`);
            successCount++;
            await delay(500);
        } catch (error) {
            console.error(`  ❌ Failed: ${encouragement.filename} - ${error.message}`);
            failCount++;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Generation Summary:');
    console.log(`  ✅ Successful: ${successCount}`);
    console.log(`  ❌ Failed: ${failCount}`);
    console.log(`  📁 Total files: ${successCount + failCount}`);
    console.log('='.repeat(50));

    if (failCount === 0) {
        console.log('\n✨ All audio files generated successfully!');
    } else {
        console.log(`\n⚠️  ${failCount} files failed to generate. Check errors above.`);
        process.exit(1);
    }
}

// Run the generator
generateAllAudio().catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});
