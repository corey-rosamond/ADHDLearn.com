# Asset Library Reference

## External Asset Library Location

**Path:** `/home/corey/Documents/Game Assets`

This directory contains downloaded asset packs from CraftPix.net that are available for use in the project.

## Available Asset Packs

### 1. Animated Text Game Assets Pack

**Location:** `craftpix-452315-animated-text-game-assets-pack/`
**Contents:**

- Animated game text effects (PNG sequences)
- Text categories: CountDown, Finish, GameOver, GetReady, LetsGo, LoadGame, StageCleared, StageFailed, Victory, YouLose
- Each text has multiple animation frames
- **Use for:** Game state messages, countdown timers, victory/defeat screens

### 2. Game Title Pack 1

**Location:** `craftpix-781661-game-title-pack-1/`
**Contents:**

- Adobe Illustrator files for game title graphics
- Backgrounds, components, graphic style titles
- **Use for:** Custom title text creation

### 3. Love Hearts 2D Game Items

**Location:** `craftpix-778910-love-hearts-2d-game-items/`
**Contents:**

- 40 heart icons (20 shiny, 20 simple)
- Various colors and styles with glossy effects
- PNG format, ready to use
- **Use for:** Lives, favorites, rewards, decoration

### 4. Free Buttons 2D Game Objects

**Location:** `craftpix-779104-free-buttons-2d-game-objects/`
**Contents:**

- Free button assets
- Shiny and simple styles
- **Use for:** UI buttons and interactive elements

### 5. Cartoon UI Elements Mini Kit

**Location:** `craftpix-net-828046-cartoon-ui-elements-mini-kit(1)/`
**Contents:**

- 70+ cartoon-style UI elements
- Icons for weapons, items, game objects
- PNG format
- **Use for:** Game icons, decorative elements

### 6. Onet Game Kit Asset Pack

**Location:** `craftpix-net-924239-onet-game-kit-asset-pack/`
**Contents:**

- Complete game UI kit (buttons, bars, boxes, backgrounds)
- 30 game object icons (Onet01.png through Onet30.png)
- UI elements: buttons (blue, green, brown), settings, pause, home, etc.
- Bars: loading bar, clock bar, score box, high score box
- Icons: crown, time, hints, roll, ads
- **Use for:** Complete UI overhaul, game object sprites

## Usage Guidelines

### Copying Assets to Project

When using assets from the library:

1. **Copy to appropriate project directory:**
   - UI elements → `assets/ui/`
   - Game sprites → `assets/sprites/`
   - Backgrounds → `assets/images/`

2. **Register in Assets.kt:**

   ```kotlin
   // Add constant
   const val ASSET_NAME = "path/to/asset.png"

   // Load in loadAssets()
   manager.load(ASSET_NAME, Texture::class.java)
   ```

3. **Document asset source:**
   - Add comment in code indicating source pack
   - Track licenses in project documentation

### Asset Licenses

All assets from CraftPix.net have their own license files in their respective directories. Review license terms before use, especially for:

- Commercial use restrictions
- Attribution requirements
- Redistribution limitations

## When to Use External Assets vs Procedural Generation

**Use External Assets when:**

- Complex artwork (characters, detailed icons, elaborate UI)
- Specific artistic style needed
- Time constraints for artwork creation

**Use Procedural Generation when:**

- Simple geometric shapes (stars, circles, basic shapes)
- Dynamic/animated effects
- Smaller file size needed
- Consistent with existing procedural code (stars, gradients, etc.)

## Last Updated

2025-10-17 - Initial documentation of asset library
