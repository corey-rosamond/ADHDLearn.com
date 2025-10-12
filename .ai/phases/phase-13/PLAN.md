# Phase 13: Content System - Letter Data

## Goal
Load letters from JSON and integrate dynamic content into Letter Pop game

## Context
This phase establishes the content management system for Aurora's Letter Adventure. Instead of hardcoding letter data, we'll:
1. Create a structured JSON file with all 26 letters
2. Build a ContentProvider service to manage content loading
3. Replace hardcoded letter data in Letter Pop with dynamic content
4. Prepare the foundation for audio integration in Phase 14

This is critical infrastructure that will:
- Make content updates easy (edit JSON, not code)
- Support internationalization in future phases
- Enable data-driven game design
- Separate content from logic

## Prerequisites
- Phase 1-12 completed
- Letter Pop game functional with placeholder letters
- Basic understanding of JSON data structures
- Phaser's file loading system operational

## Tasks

### 1. Create Letter Data JSON File
Create `/assets/data/letters.json` with structured data for all 26 letters

**File location:** `/assets/data/letters.json`

**Data structure:**
```json
{
  "letters": [
    {
      "id": "A",
      "letter": "A",
      "name": "Letter A",
      "audioPath": "assets/audio/letters/letter-a.mp3",
      "category": "vowel",
      "order": 1
    },
    {
      "id": "B",
      "letter": "B",
      "name": "Letter B",
      "audioPath": "assets/audio/letters/letter-b.mp3",
      "category": "consonant",
      "order": 2
    }
    // ... Continue for all 26 letters
  ]
}
```

**Required fields for each letter:**
- `id`: Unique identifier (uppercase letter)
- `letter`: The letter character to display
- `name`: Human-readable name
- `audioPath`: Path to audio file (prepared for Phase 14)
- `category`: "vowel" or "consonant"
- `order`: Position in alphabet (1-26)

### 2. Create ContentProvider Service
Create `/src/services/ContentProvider.js` as a singleton service

**Purpose:**
- Load and parse letters.json
- Provide methods to access letter data
- Handle errors gracefully
- Cache data for performance

**Core functionality:**
```javascript
class ContentProvider {
    static instance = null;

    constructor() {
        if (ContentProvider.instance) {
            return ContentProvider.instance;
        }
        ContentProvider.instance = this;
        this.letters = [];
        this.loaded = false;
    }

    static getInstance() {
        if (!ContentProvider.instance) {
            ContentProvider.instance = new ContentProvider();
        }
        return ContentProvider.instance;
    }

    loadData(scene) {
        // Load letters.json using Phaser's load.json
        // Store in this.letters array
        // Set this.loaded = true
    }

    getRandomLetter() {
        // Return random letter from this.letters
        // Ensure fair distribution
    }

    getLetterById(id) {
        // Return specific letter by ID
    }

    getAllLetters() {
        // Return complete letters array
    }

    getLettersByCategory(category) {
        // Return letters filtered by category (vowel/consonant)
    }
}
```

### 3. Integrate ContentProvider into Game
Modify existing scenes to use ContentProvider

**Steps:**
1. Import ContentProvider in LetterPopScene
2. Load letters.json in preload() method
3. Access ContentProvider singleton instance
4. Replace hardcoded letter data with getRandomLetter()

**Example integration:**
```javascript
// In LetterPopScene.js
import ContentProvider from '../services/ContentProvider.js';

class LetterPopScene extends Phaser.Scene {
    preload() {
        // Load letter data
        const contentProvider = ContentProvider.getInstance();
        this.load.json('letterData', 'assets/data/letters.json');
    }

    create() {
        // Initialize ContentProvider with loaded data
        const contentProvider = ContentProvider.getInstance();
        const letterData = this.cache.json.get('letterData');
        contentProvider.setData(letterData);

        // Spawn letter using dynamic content
        this.spawnLetter();
    }

    spawnLetter() {
        const contentProvider = ContentProvider.getInstance();
        const letterData = contentProvider.getRandomLetter();

        // Use letterData.letter for display
        // Use letterData.audioPath for future audio (Phase 14)
    }
}
```

### 4. Update Letter Pop to Use Dynamic Content
Replace all hardcoded letter references

**Changes needed:**
- Letter text display: Use `letterData.letter`
- Letter selection: Use `contentProvider.getRandomLetter()`
- Letter validation: Use `letterData.id` for comparison
- Future audio prep: Store `letterData.audioPath` in letter object

### 5. Test Content Loading
Verify all 26 letters load and display correctly

**Testing checklist:**
- [ ] JSON file loads without errors
- [ ] ContentProvider initializes successfully
- [ ] getRandomLetter() returns valid letter data
- [ ] All 26 letters appear during gameplay (play multiple times)
- [ ] No duplicate letters appear consecutively (if using fair distribution)
- [ ] Console shows no errors related to content loading
- [ ] Letter display matches JSON data

## Implementation Details

### Complete letters.json Structure
```json
{
  "letters": [
    {"id": "A", "letter": "A", "name": "Letter A", "audioPath": "assets/audio/letters/letter-a.mp3", "category": "vowel", "order": 1},
    {"id": "B", "letter": "B", "name": "Letter B", "audioPath": "assets/audio/letters/letter-b.mp3", "category": "consonant", "order": 2},
    {"id": "C", "letter": "C", "name": "Letter C", "audioPath": "assets/audio/letters/letter-c.mp3", "category": "consonant", "order": 3},
    {"id": "D", "letter": "D", "name": "Letter D", "audioPath": "assets/audio/letters/letter-d.mp3", "category": "consonant", "order": 4},
    {"id": "E", "letter": "E", "name": "Letter E", "audioPath": "assets/audio/letters/letter-e.mp3", "category": "vowel", "order": 5},
    {"id": "F", "letter": "F", "name": "Letter F", "audioPath": "assets/audio/letters/letter-f.mp3", "category": "consonant", "order": 6},
    {"id": "G", "letter": "G", "name": "Letter G", "audioPath": "assets/audio/letters/letter-g.mp3", "category": "consonant", "order": 7},
    {"id": "H", "letter": "H", "name": "Letter H", "audioPath": "assets/audio/letters/letter-h.mp3", "category": "consonant", "order": 8},
    {"id": "I", "letter": "I", "name": "Letter I", "audioPath": "assets/audio/letters/letter-i.mp3", "category": "vowel", "order": 9},
    {"id": "J", "letter": "J", "name": "Letter J", "audioPath": "assets/audio/letters/letter-j.mp3", "category": "consonant", "order": 10},
    {"id": "K", "letter": "K", "name": "Letter K", "audioPath": "assets/audio/letters/letter-k.mp3", "category": "consonant", "order": 11},
    {"id": "L", "letter": "L", "name": "Letter L", "audioPath": "assets/audio/letters/letter-l.mp3", "category": "consonant", "order": 12},
    {"id": "M", "letter": "M", "name": "Letter M", "audioPath": "assets/audio/letters/letter-m.mp3", "category": "consonant", "order": 13},
    {"id": "N", "letter": "N", "name": "Letter N", "audioPath": "assets/audio/letters/letter-n.mp3", "category": "consonant", "order": 14},
    {"id": "O", "letter": "O", "name": "Letter O", "audioPath": "assets/audio/letters/letter-o.mp3", "category": "vowel", "order": 15},
    {"id": "P", "letter": "P", "name": "Letter P", "audioPath": "assets/audio/letters/letter-p.mp3", "category": "consonant", "order": 16},
    {"id": "Q", "letter": "Q", "name": "Letter Q", "audioPath": "assets/audio/letters/letter-q.mp3", "category": "consonant", "order": 17},
    {"id": "R", "letter": "R", "name": "Letter R", "audioPath": "assets/audio/letters/letter-r.mp3", "category": "consonant", "order": 18},
    {"id": "S", "letter": "S", "name": "Letter S", "audioPath": "assets/audio/letters/letter-s.mp3", "category": "consonant", "order": 19},
    {"id": "T", "letter": "T", "name": "Letter T", "audioPath": "assets/audio/letters/letter-t.mp3", "category": "consonant", "order": 20},
    {"id": "U", "letter": "U", "name": "Letter U", "audioPath": "assets/audio/letters/letter-u.mp3", "category": "vowel", "order": 21},
    {"id": "V", "letter": "V", "name": "Letter V", "audioPath": "assets/audio/letters/letter-v.mp3", "category": "consonant", "order": 22},
    {"id": "W", "letter": "W", "name": "Letter W", "audioPath": "assets/audio/letters/letter-w.mp3", "category": "consonant", "order": 23},
    {"id": "X", "letter": "X", "name": "Letter X", "audioPath": "assets/audio/letters/letter-x.mp3", "category": "consonant", "order": 24},
    {"id": "Y", "letter": "Y", "name": "Letter Y", "audioPath": "assets/audio/letters/letter-y.mp3", "category": "consonant", "order": 25},
    {"id": "Z", "letter": "Z", "name": "Letter Z", "audioPath": "assets/audio/letters/letter-z.mp3", "category": "consonant", "order": 26}
  ]
}
```

### Complete ContentProvider.js Implementation
```javascript
/**
 * ContentProvider - Singleton service for managing game content
 * Loads and provides access to letter data from JSON
 */
class ContentProvider {
    static instance = null;

    constructor() {
        if (ContentProvider.instance) {
            return ContentProvider.instance;
        }
        ContentProvider.instance = this;
        this.letters = [];
        this.loaded = false;
        this.lastLetterIndex = -1; // Prevent consecutive duplicates
    }

    static getInstance() {
        if (!ContentProvider.instance) {
            ContentProvider.instance = new ContentProvider();
        }
        return ContentProvider.instance;
    }

    /**
     * Set letter data from loaded JSON
     * @param {Object} data - Parsed JSON data with letters array
     */
    setData(data) {
        if (data && data.letters && Array.isArray(data.letters)) {
            this.letters = data.letters;
            this.loaded = true;
            console.log(`ContentProvider: Loaded ${this.letters.length} letters`);
        } else {
            console.error('ContentProvider: Invalid data format');
            this.loaded = false;
        }
    }

    /**
     * Get a random letter from the collection
     * Prevents returning the same letter twice in a row
     * @returns {Object} Letter data object
     */
    getRandomLetter() {
        if (!this.loaded || this.letters.length === 0) {
            console.error('ContentProvider: No letters loaded');
            return { id: 'A', letter: 'A', name: 'Letter A', audioPath: '', category: 'vowel', order: 1 };
        }

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * this.letters.length);
        } while (randomIndex === this.lastLetterIndex && this.letters.length > 1);

        this.lastLetterIndex = randomIndex;
        return this.letters[randomIndex];
    }

    /**
     * Get letter by ID
     * @param {String} id - Letter ID (e.g., 'A', 'B', 'C')
     * @returns {Object|null} Letter data object or null if not found
     */
    getLetterById(id) {
        return this.letters.find(letter => letter.id === id) || null;
    }

    /**
     * Get all letters
     * @returns {Array} Array of all letter objects
     */
    getAllLetters() {
        return [...this.letters]; // Return copy to prevent external modification
    }

    /**
     * Get letters by category
     * @param {String} category - 'vowel' or 'consonant'
     * @returns {Array} Filtered array of letter objects
     */
    getLettersByCategory(category) {
        return this.letters.filter(letter => letter.category === category);
    }

    /**
     * Check if content is loaded
     * @returns {Boolean} True if letters are loaded
     */
    isLoaded() {
        return this.loaded;
    }

    /**
     * Get vowels count
     * @returns {Number} Number of vowels
     */
    getVowelCount() {
        return this.letters.filter(letter => letter.category === 'vowel').length;
    }

    /**
     * Get consonants count
     * @returns {Number} Number of consonants
     */
    getConsonantCount() {
        return this.letters.filter(letter => letter.category === 'consonant').length;
    }
}

// Export for ES6 modules
export default ContentProvider;
```

### Integration Example in LetterPopScene
```javascript
// Add to imports at top of file
import ContentProvider from '../services/ContentProvider.js';

class LetterPopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LetterPopScene' });
        this.contentProvider = null;
    }

    preload() {
        // Load letter data JSON
        this.load.json('letterData', 'assets/data/letters.json');

        // ... other preload code
    }

    create() {
        // Initialize ContentProvider
        this.contentProvider = ContentProvider.getInstance();
        const letterData = this.cache.json.get('letterData');
        this.contentProvider.setData(letterData);

        // Verify loading
        if (!this.contentProvider.isLoaded()) {
            console.error('Failed to load letter data!');
            return;
        }

        console.log(`Loaded ${this.contentProvider.getAllLetters().length} letters`);
        console.log(`Vowels: ${this.contentProvider.getVowelCount()}`);
        console.log(`Consonants: ${this.contentProvider.getConsonantCount()}`);

        // ... rest of create code
    }

    spawnLetter() {
        // Get random letter from ContentProvider
        const letterData = this.contentProvider.getRandomLetter();

        // Create letter bubble with dynamic data
        const x = Phaser.Math.Between(100, 700);
        const y = 550;

        // Create circle
        const bubble = this.add.circle(x, y, 40, 0x4488ff);
        bubble.setStrokeStyle(4, 0xffffff);

        // Create text using letter data
        const letterText = this.add.text(x, y, letterData.letter, {
            fontSize: '48px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Store letter data on bubble for later reference
        bubble.letterData = letterData;

        // Make interactive
        bubble.setInteractive();
        bubble.on('pointerdown', () => {
            console.log(`Clicked: ${letterData.name}`);
            // Future: Play audio using letterData.audioPath
            this.popLetter(bubble, letterText);
        });

        // ... animation code
    }
}
```

## Acceptance Criteria
- [ ] /assets/data/letters.json file exists with all 26 letters
- [ ] Each letter has all required fields (id, letter, name, audioPath, category, order)
- [ ] JSON file is valid (no syntax errors)
- [ ] /src/services/ContentProvider.js exists and implements singleton pattern
- [ ] ContentProvider.getInstance() returns same instance every time
- [ ] ContentProvider.setData() properly initializes letter data
- [ ] ContentProvider.getRandomLetter() returns valid letter objects
- [ ] ContentProvider.getLetterById() can retrieve specific letters
- [ ] ContentProvider.getAllLetters() returns all 26 letters
- [ ] ContentProvider.getLettersByCategory() filters correctly
- [ ] LetterPopScene successfully loads letters.json
- [ ] LetterPopScene uses ContentProvider for letter selection
- [ ] All 26 letters can appear during gameplay
- [ ] No consecutive duplicate letters appear
- [ ] Letter display uses data from JSON (not hardcoded)
- [ ] Console shows successful loading message
- [ ] No errors in browser console
- [ ] Game plays normally with dynamic content

## Testing Steps
1. Create letters.json with all 26 letters
2. Verify JSON is valid (use JSON validator)
3. Create ContentProvider.js with singleton implementation
4. Add ContentProvider to LetterPopScene imports
5. Load letters.json in preload()
6. Initialize ContentProvider in create()
7. Replace hardcoded letters with getRandomLetter()
8. Test game in browser
9. Verify ContentProvider loading message in console
10. Play game multiple times
11. Track which letters appear (aim to see all 26)
12. Verify no consecutive duplicates
13. Check console for any errors
14. Test getLetterById() with specific IDs
15. Test getLettersByCategory('vowel') and ('consonant')
16. Verify getAllLetters() returns 26 letters
17. Test edge case: reload page multiple times
18. Verify data persistence across game sessions

## Estimated Time
1 hour

## Dependencies
- Phaser 3 game instance configured
- LetterPopScene implemented and functional
- /assets/data directory exists
- /src/services directory created
- Basic understanding of ES6 modules

## Risks
- **JSON syntax errors**: Validate JSON before testing (use jsonlint.com)
- **File path errors**: Verify relative paths from index.html location
- **Module import issues**: Ensure ContentProvider exports correctly
- **Singleton not working**: Verify getInstance() always returns same instance
- **Random selection bias**: Test getRandomLetter() distribution over many calls
- **Data not loading**: Check browser network tab for 404 errors

## Data Structure Benefits
**Separation of Content and Code:**
- Designers can edit letters.json without touching code
- Easy to add new properties (e.g., difficulty level, animations)
- Supports A/B testing different letter sets

**Extensibility:**
- Can add lowercase letters later
- Can add letter combinations (digraphs)
- Can add multiple audio files per letter
- Can add visual assets (images, animations)

**Internationalization Ready:**
- Easy to create letters-es.json for Spanish
- Can switch languages without code changes
- Supports Unicode characters for any alphabet

**Data Validation:**
- JSON schema validation possible
- Editor plugins can validate structure
- Reduces runtime errors

## Notes
- Keep JSON file human-readable (formatted with indentation)
- Use consistent naming conventions for audio paths
- ContentProvider is singleton - only one instance exists
- Letter data is immutable once loaded (don't modify returned objects)
- Future phases will add audio loading using audioPath field
- Consider adding data validation in ContentProvider.setData()
- Could add unit tests for ContentProvider methods
- Fair distribution algorithm prevents boring repeated letters

## Completion Checklist
- [ ] letters.json created with all 26 letters
- [ ] letters.json validates successfully
- [ ] ContentProvider.js implemented with singleton pattern
- [ ] All ContentProvider methods implemented and tested
- [ ] LetterPopScene loads letters.json
- [ ] LetterPopScene uses ContentProvider for letter selection
- [ ] All 26 letters accessible during gameplay
- [ ] No consecutive duplicate letters
- [ ] Console shows no errors
- [ ] Testing completed with all letters appearing
- [ ] Code is clean and well-commented
- [ ] Ready to proceed to Phase 14 (audio integration)
