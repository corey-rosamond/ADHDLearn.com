# Phase 27: Sight Word Content

## Goal
Load sight word data and integrate Dolch pre-primer words into Word Catch game

## Context
This phase transitions Word Catch from using placeholder data to real educational content. We'll implement the Dolch pre-primer sight word list (40 words), create a data structure to store them, generate audio files for pronunciation, and update the ContentProvider to serve sight words. This is the first step in making Word Catch an effective educational tool for Aurora to learn sight words.

The Dolch word list is a foundational literacy resource created by Edward William Dolch. The pre-primer list contains the 40 most common words young children encounter when learning to read. These words often don't follow standard phonics rules, so they must be recognized by sight.

## Prerequisites
- Phase 1-26 completed
- Word Catch game functional with placeholder data
- ContentProvider class implemented
- Audio system working
- Asset loading pipeline functional

## Tasks

### 1. Create Sight Word Data File
- Create `/assets/data/sight-words.json`
- Structure data with word properties (text, difficulty, category)
- Include all 40 Dolch pre-primer words
- Validate JSON structure
- Add metadata (version, source, date)
- Document data schema

### 2. Generate Sight Word Audio Files
- **USER ACTION REQUIRED**: Generate audio files for all 40 words
- Use text-to-speech service (Google TTS, Azure TTS, or similar)
- Choose child-friendly voice (female, clear, moderate pace)
- Export as MP3 format (44.1kHz, 128kbps)
- Naming convention: `word-{word}.mp3` (e.g., `word-and.mp3`)
- Save to `/assets/audio/sight-words/`
- Test audio quality (clear, pleasant, appropriate volume)
- Normalize audio levels across all files

### 3. Update ContentProvider for Sight Words
- Add `getSightWord()` method
- Add `getSightWords(count)` method for multiple words
- Add `getRandomSightWord()` method
- Implement difficulty filtering
- Add category filtering (optional)
- Cache sight word data for performance
- Handle missing data gracefully
- Add error handling for audio loading

### 4. Integrate Sight Words into Word Catch
- Update WordCatchScene to use ContentProvider.getSightWords()
- Replace placeholder words with real sight words
- Ensure word selection is random but non-repeating
- Update word display (ensure text is readable)
- Connect audio files to word catches
- Test word pronunciation on catch
- Verify words are age-appropriate for display

### 5. Test Sight Word Integration
- Verify all 40 words load correctly
- Test random word selection
- Ensure no duplicate words in same session
- Test audio playback for each word
- Verify audio volume is consistent
- Test with missing audio file (error handling)
- Test with malformed JSON data
- Verify performance (no lag when loading words)

## Implementation Details

### Sight Word Data Structure (`sight-words.json`)
```json
{
  "version": "1.0.0",
  "source": "Dolch Pre-Primer List",
  "lastUpdated": "2025-10-12",
  "words": [
    {
      "id": 1,
      "text": "a",
      "difficulty": 1,
      "category": "article",
      "audioFile": "word-a.mp3"
    },
    {
      "id": 2,
      "text": "and",
      "difficulty": 1,
      "category": "conjunction",
      "audioFile": "word-and.mp3"
    },
    {
      "id": 3,
      "text": "away",
      "difficulty": 2,
      "category": "adverb",
      "audioFile": "word-away.mp3"
    }
    // ... 37 more words
  ]
}
```

### Complete Dolch Pre-Primer Word List (40 words)
The following words should be included in the JSON file:

**Articles & Pronouns (9 words):**
a, I, the, he, she, it, we, you, my

**Verbs (14 words):**
am, is, are, be, can, do, get, go, have, help, like, look, make, run

**Prepositions & Adverbs (8 words):**
at, for, in, on, to, up, down, away

**Adjectives & Determiners (5 words):**
big, little, one, two, three

**Conjunctions & Others (4 words):**
and, not, see, said

### ContentProvider Sight Word Methods
```javascript
class ContentProvider {
    constructor(scene) {
        this.scene = scene;
        this.sightWordsData = null;
        this.usedWords = [];
    }

    async loadSightWords() {
        try {
            const response = await fetch('assets/data/sight-words.json');
            this.sightWordsData = await response.json();
            console.log(`Loaded ${this.sightWordsData.words.length} sight words`);
        } catch (error) {
            console.error('Failed to load sight words:', error);
            // Fallback to minimal word list
            this.sightWordsData = this.getFallbackWords();
        }
    }

    getRandomSightWord() {
        if (!this.sightWordsData || !this.sightWordsData.words) {
            console.warn('Sight words not loaded');
            return null;
        }

        // Get available words (not recently used)
        const availableWords = this.sightWordsData.words.filter(
            word => !this.usedWords.includes(word.id)
        );

        // Reset if all words used
        if (availableWords.length === 0) {
            this.usedWords = [];
            return this.getRandomSightWord();
        }

        // Select random word
        const randomIndex = Phaser.Math.Between(0, availableWords.length - 1);
        const selectedWord = availableWords[randomIndex];

        // Mark as used
        this.usedWords.push(selectedWord.id);

        // Keep only last 10 used words to allow repetition after delay
        if (this.usedWords.length > 10) {
            this.usedWords.shift();
        }

        return selectedWord;
    }

    getSightWords(count) {
        const words = [];
        for (let i = 0; i < count; i++) {
            const word = this.getRandomSightWord();
            if (word) {
                words.push(word);
            }
        }
        return words;
    }

    getSightWordsByDifficulty(difficulty) {
        if (!this.sightWordsData) return [];
        return this.sightWordsData.words.filter(
            word => word.difficulty === difficulty
        );
    }

    getFallbackWords() {
        // Emergency fallback if JSON fails to load
        return {
            version: "1.0.0",
            source: "Fallback",
            words: [
                { id: 1, text: "a", difficulty: 1, audioFile: "word-a.mp3" },
                { id: 2, text: "I", difficulty: 1, audioFile: "word-i.mp3" },
                { id: 3, text: "the", difficulty: 1, audioFile: "word-the.mp3" },
                { id: 4, text: "and", difficulty: 1, audioFile: "word-and.mp3" },
                { id: 5, text: "see", difficulty: 1, audioFile: "word-see.mp3" }
            ]
        };
    }
}
```

### Word Catch Integration Example
```javascript
class WordCatchScene extends Phaser.Scene {
    create() {
        // Initialize content provider
        this.contentProvider = new ContentProvider(this);
        await this.contentProvider.loadSightWords();

        // Spawn words periodically
        this.spawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnWord,
            callbackScope: this,
            loop: true
        });
    }

    spawnWord() {
        const wordData = this.contentProvider.getRandomSightWord();

        if (!wordData) {
            console.warn('No word data available');
            return;
        }

        // Create falling word with sight word data
        const x = Phaser.Math.Between(100, 700);
        const word = this.createFallingWord(wordData.text, x, -50);
        word.wordData = wordData; // Store full data for later use
    }

    catchWord(word) {
        // Play pronunciation audio
        const audioKey = `sightword_${word.wordData.id}`;
        if (this.sound.get(audioKey)) {
            this.sound.play(audioKey);
        }

        // Show feedback
        this.showWordFeedback(word.wordData.text);

        // Award points, update score, etc.
        this.addScore(10);
    }
}
```

### Audio File Naming Convention
All audio files should follow this pattern:
- `word-a.mp3`
- `word-and.mp3`
- `word-away.mp3`
- `word-big.mp3`
- etc.

Stored in: `/assets/audio/sight-words/`

### Audio Preloading in Boot/Preload Scene
```javascript
class PreloadScene extends Phaser.Scene {
    preload() {
        // Load sight words JSON
        this.load.json('sightWordsData', 'assets/data/sight-words.json');

        // Load sight word audio files
        const words = [
            'a', 'and', 'away', 'big', 'blue', 'can', 'come', 'down',
            'find', 'for', 'funny', 'go', 'help', 'here', 'i', 'in',
            'is', 'it', 'jump', 'little', 'look', 'make', 'me', 'my',
            'not', 'one', 'play', 'red', 'run', 'said', 'see', 'the',
            'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you'
        ];

        words.forEach((word, index) => {
            this.load.audio(
                `sightword_${index + 1}`,
                `assets/audio/sight-words/word-${word}.mp3`
            );
        });

        // Show loading progress
        this.load.on('progress', (value) => {
            console.log(`Loading: ${Math.floor(value * 100)}%`);
        });
    }
}
```

## Acceptance Criteria
- [ ] `/assets/data/sight-words.json` created with all 40 Dolch pre-primer words
- [ ] JSON structure is valid and includes all required fields
- [ ] All 40 sight word audio files generated and saved to `/assets/audio/sight-words/`
- [ ] Audio files are consistent quality (clear, pleasant, normalized volume)
- [ ] ContentProvider has `getRandomSightWord()` method implemented
- [ ] ContentProvider has `getSightWords(count)` method implemented
- [ ] ContentProvider prevents immediate word repetition (tracks last 10 used)
- [ ] Word Catch scene uses real sight words from ContentProvider
- [ ] Words display correctly in game (readable, appropriate size)
- [ ] Audio plays when word is caught
- [ ] All 40 words tested and verified working
- [ ] No console errors when loading words
- [ ] Error handling works (graceful fallback if JSON/audio missing)
- [ ] Performance is smooth (no lag when spawning words)

## Testing Steps

### Data File Validation
1. Open `sight-words.json` in editor
2. Validate JSON syntax (use JSONLint or VS Code)
3. Verify all 40 words present
4. Check all required fields exist
5. Verify audio file paths are correct

### Audio File Testing
1. Navigate to `/assets/audio/sight-words/`
2. Count audio files (should be 40)
3. Play each audio file
4. Verify pronunciation is clear and correct
5. Check volume levels are consistent
6. Ensure no audio artifacts or clipping

### ContentProvider Testing
1. Launch game and open console
2. Verify sight words load message
3. Call `getRandomSightWord()` multiple times
4. Verify different words returned
5. Verify no immediate repeats
6. Test `getSightWords(10)` returns 10 unique words
7. Test error handling (rename JSON file temporarily)

### Word Catch Integration Testing
1. Play Word Catch game
2. Observe falling words (should be real sight words)
3. Catch multiple words
4. Verify audio plays on catch
5. Check for word variety (not same word repeatedly)
6. Play for 5+ minutes to see word rotation
7. Verify no console errors
8. Check performance (smooth 60fps)

### Edge Case Testing
1. Test with missing JSON file
2. Test with malformed JSON
3. Test with missing audio file
4. Test with 0 words in JSON
5. Test requesting more words than available
6. Test rapid word spawning
7. Verify memory doesn't leak over extended play

## Estimated Time
1 hour
- JSON creation: 15 minutes
- Audio generation (user task): 20 minutes
- ContentProvider updates: 15 minutes
- Integration and testing: 10 minutes

## Dependencies
- Phase 26 completed (Word Catch core game)
- ContentProvider class exists
- Asset loading system functional
- Audio system operational
- Text-to-speech service access (for audio generation)

## Risks
- **Audio generation time**: Creating 40 audio files might take longer than expected
  - Mitigation: Batch processing with TTS service, use scripting to automate
- **Audio quality inconsistency**: Different words might have different volume/quality
  - Mitigation: Normalize audio in post-processing, use same TTS voice settings
- **JSON syntax errors**: Manual JSON creation prone to errors
  - Mitigation: Use JSON validator, copy/paste template for consistency
- **Performance with 40 audio files**: Loading many audio files might impact performance
  - Mitigation: Load on-demand instead of preloading all, use compressed audio format
- **TTS voice not child-friendly**: Voice might be robotic or unpleasant
  - Mitigation: Test multiple TTS services, choose highest quality voice, consider professional recording if budget allows

## User Action Required

### Audio File Generation Steps
This is a **manual task** that must be completed by the user:

1. **Choose TTS Service**: Select one of these options:
   - Google Cloud Text-to-Speech (recommended, high quality)
   - Microsoft Azure TTS
   - Amazon Polly
   - Web-based: https://ttsmp3.com/ (free, quick)

2. **Select Voice Settings**:
   - Language: English (US)
   - Voice: Female, child-friendly (e.g., "en-US-Wavenet-F" for Google)
   - Speed: Normal or slightly slow (0.9x)
   - Pitch: Normal or slightly higher

3. **Generate Each Word**:
   - Input word text
   - Generate audio
   - Download as MP3
   - Rename to `word-{word}.mp3`
   - Save to `/assets/audio/sight-words/`

4. **Batch Processing** (if service supports):
   - Create script to iterate through word list
   - Generate all 40 files automatically
   - Saves significant time

5. **Normalize Audio Levels**:
   - Use Audacity or similar tool
   - Select all 40 files
   - Apply "Normalize" effect to -1.0 dB
   - Export all files

6. **Verify Completeness**:
   - Check folder has exactly 40 MP3 files
   - Spot-check 5-10 files for quality
   - Test one file in game

## Notes
- **Dolch word list is public domain**: No copyright concerns
- **Keep it simple**: Focus on getting data structure right, polish later
- **Audio quality matters**: Aurora will hear these words repeatedly
- **Consider future expansion**: Structure allows adding more word lists later (primer, first grade, etc.)
- **Non-repeating is important**: Seeing same word immediately is boring/frustrating
- **Volume normalization is critical**: Inconsistent volumes are jarring for kids
- **Plan for offline**: Cache words locally, don't rely on network

## Future Enhancements (Not in this phase)
- Multiple word lists (primer, 1st grade, 2nd grade, etc.)
- Progress tracking (which words Aurora has mastered)
- Difficulty adjustment based on performance
- Word categories/themes (colors, numbers, actions, etc.)
- Custom word lists (parent-created)
- Spaced repetition algorithm for optimal learning

## Completion Checklist
- [ ] `/assets/data/sight-words.json` created and validated
- [ ] All 40 Dolch pre-primer words included in JSON
- [ ] All 40 audio files generated and saved
- [ ] Audio files tested and normalized
- [ ] ContentProvider `getRandomSightWord()` implemented
- [ ] ContentProvider `getSightWords(count)` implemented
- [ ] ContentProvider prevents immediate repetition
- [ ] Word Catch uses ContentProvider for word selection
- [ ] Audio plays correctly when words are caught
- [ ] All words tested in game
- [ ] Error handling tested (missing files, malformed JSON)
- [ ] Performance verified (smooth gameplay)
- [ ] No console errors
- [ ] Documentation updated
- [ ] Ready to proceed to Phase 28 (Word Catch Polish)
