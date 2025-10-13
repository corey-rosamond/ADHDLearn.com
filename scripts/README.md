# Audio Generation Scripts

This directory contains build-time scripts for generating audio assets.

## generate-audio.js

Generates all required audio files using the ElevenLabs Text-to-Speech API.

### Prerequisites

1. **ElevenLabs API Key**
   - Sign up at [ElevenLabs](https://elevenlabs.io/)
   - Get your API key from your account settings
   - Free tier: 10,000 characters/month (sufficient for this project)
   - **IMPORTANT:** API key is stored in `.env` file (never committed to git)

2. **Node.js**
   - Already installed (used for development)

### Setup

1. **Configure API Key** (first time only)

   Your API key is already configured in the `.env` file at the project root:
   ```
   ELEVEN_LABS_API_KEY=your_key_here
   ```

   This file is automatically excluded from git commits via `.gitignore`.

### Usage

```bash
# Option 1: Load .env and run (recommended)
export $(cat .env | xargs) && node scripts/generate-audio.js

# Option 2: Set directly (for testing)
ELEVEN_LABS_API_KEY=your_api_key_here node scripts/generate-audio.js
```

### What It Generates

The script generates **54 audio files**:

1. **Target Letter Instructions (26 files)**
   - `assets/audio/find_letter_A.mp3` through `find_letter_Z.mp3`
   - Each says: "Find the letter [X]!"
   - Used when game tells player which letter to click

2. **Individual Letter Sounds (26 files)**
   - `assets/audio/letters/A.mp3` through `Z.mp3`
   - Each says the letter name ("A", "B", "C", etc.)
   - Played when player clicks a bubble

3. **Success Sound (1 file)**
   - `assets/audio/success.mp3`
   - Says "Great job!"
   - Played when player clicks the correct bubble

4. **Pop Sound (1 file)**
   - `assets/audio/pop.mp3`
   - Says "Pop!"
   - Quick sound effect for bubble popping

### Voice Configuration

Default voice: `EXAVITQu4vr4xnSDxMaL` (Rachel - clear, child-friendly)

To use a different voice:
1. Browse voices at [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)
2. Copy the Voice ID
3. Edit `scripts/generate-audio.js` line 20:
   ```javascript
   const VOICE_ID = 'your_voice_id_here';
   ```

### Rate Limiting

- Script includes 500ms delay between API calls
- Total generation time: ~30-45 seconds
- Free tier limits: 10,000 characters/month

### Character Count

Approximate character usage:
- Find letter instructions: ~26 × 20 = 520 chars
- Individual letters: ~26 × 1 = 26 chars
- Success sound: ~10 chars
- Pop sound: ~4 chars
- **Total: ~560 characters** (well within free tier)

### Troubleshooting

**Error: "ELEVEN_LABS_API_KEY environment variable not set"**
- Solution: Make sure you're loading the .env file: `export $(cat .env | xargs)`
- Or check that `.env` file exists in the project root with your API key

**Error: "API error: 401"**
- Solution: Check your API key is correct in the `.env` file
- Verify you have the correct key from your ElevenLabs account settings

**Error: "API error: 429"**
- Solution: Rate limit exceeded. Wait a few minutes and try again

**Error: "ENOENT: no such file or directory"**
- Solution: Script will create directories automatically. Ensure you have write permissions.

### Re-generating Audio

If you need to regenerate audio (e.g., changing voice):
1. Delete the existing audio files (optional)
2. Run the script again
3. Existing files will be overwritten

### Alternative: Manual Generation

If you prefer to generate audio manually:
1. Go to [ElevenLabs Speech Synthesis](https://elevenlabs.io/speech-synthesis)
2. Generate each file individually
3. Save to the appropriate directories:
   - `assets/audio/find_letter_*.mp3`
   - `assets/audio/letters/*.mp3`
   - `assets/audio/success.mp3`
   - `assets/audio/pop.mp3`

## Future Scripts

Additional scripts that may be added:
- `generate-test-sounds.js` - Generate placeholder sounds for testing
- `validate-audio.js` - Check all audio files exist and are valid
- `optimize-audio.js` - Compress audio files for web delivery
