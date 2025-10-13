# Phase 12.5: Responsive Design, Visual Overhaul & PWA - UML

## System Architecture

```mermaid
graph TB
    PWA[Progressive Web App]
    SW[Service Worker]
    Manifest[manifest.json]
    Game[Phaser Game]
    Responsive[ResponsiveUtils]

    PWA --> SW
    PWA --> Manifest
    PWA --> Game
    Game --> Responsive

    SW -->|Caches| Assets[Game Assets]
    SW -->|Enables| Offline[Offline Play]

    Responsive -->|Scales| UI[UI Elements]
    Responsive -->|Adapts| Layout[Screen Layout]

    style PWA fill:#00BCD4
    style SW fill:#4CAF50
    style Responsive fill:#FF4081
```

## Responsive Utilities Class Diagram

```mermaid
classDiagram
    class ResponsiveUtils {
        -Scene scene
        -Number width
        -Number height
        -Number centerX
        -Number centerY
        +constructor(scene)
        +getX(percent) Number
        +getY(percent) Number
        +scaleX(baseValue) Number
        +scaleY(baseValue) Number
        +getFontSize(baseSize) Number
    }

    class LetterPopScene {
        -ResponsiveUtils responsive
        +create()
        +createUI()
        +positionElements()
    }

    class MainMenuScene {
        -ResponsiveUtils responsive
        +create()
        +createButtons()
    }

    class ResultsScene {
        -ResponsiveUtils responsive
        +create()
        +displayResults()
    }

    LetterPopScene --> ResponsiveUtils
    MainMenuScene --> ResponsiveUtils
    ResultsScene --> ResponsiveUtils
```

## Screen Layout Architecture

```mermaid
graph LR
    Base[Base Resolution<br/>1920x1200]

    Base -->|FIT mode| TabS7[Tab S7 FE<br/>2560x1600]
    Base -->|FIT mode| Small[Small Tablet<br/>1024x768]
    Base -->|FIT mode| Desktop[Desktop<br/>1920x1080]

    TabS7 --> Render[Rendered Game]
    Small --> Render
    Desktop --> Render

    style Base fill:#00BCD4
    style TabS7 fill:#4CAF50
    style Render fill:#FF4081
```

## PWA Installation Flow

```mermaid
sequenceDiagram
    actor User as Aurora
    participant Browser
    participant SW as Service Worker
    participant Cache
    participant Server as GitHub Pages

    User->>Browser: Open game URL
    Browser->>Server: Request index.html
    Server->>Browser: Return index.html
    Browser->>SW: Register service worker
    SW->>Server: Fetch game files
    Server->>SW: Return files
    SW->>Cache: Store files
    SW->>Browser: Ready

    Browser->>User: Show "Add to Home Screen"
    User->>Browser: Click "Add"
    Browser->>User: Icon added to home screen

    User->>Browser: Launch from icon
    Browser->>SW: Check for updates
    alt Updates available
        SW->>Server: Fetch new files
        Server->>SW: Return updates
        SW->>Cache: Update cache
    else No updates
        SW->>Cache: Load from cache
    end
    Cache->>Browser: Display game
    Browser->>User: Game launches fullscreen
```

## Color Palette Architecture

```mermaid
graph TB
    Palette[Aurora's Rainbow Palette]

    Palette --> Primary[Primary Colors]
    Palette --> Secondary[Secondary Colors]
    Palette --> Neutral[Neutral Colors]

    Primary --> SkyBlue[Sky Blue<br/>#00BCD4]
    Primary --> SunYellow[Sunshine Yellow<br/>#FFEB3B]
    Primary --> BubblePink[Bubble Pink<br/>#FF4081]

    Secondary --> GrassGreen[Grass Green<br/>#00E676]
    Secondary --> OrangePop[Orange Pop<br/>#FF6B6B]
    Secondary --> PurpleMagic[Purple Magic<br/>#9C27B0]

    Neutral --> White[Pure White<br/>#FFFFFF]
    Neutral --> Black[Soft Black<br/>#212121]

    SkyBlue --> BG[Backgrounds]
    SunYellow --> Highlight[Highlights]
    BubblePink --> Accent[Accents]
    GrassGreen --> Success[Success States]
    OrangePop --> Buttons[Buttons]
    PurpleMagic --> Effects[Special Effects]

    style Palette fill:#9C27B0
    style Primary fill:#00BCD4
    style Secondary fill:#FF4081
    style Neutral fill:#F5F5F5
```

## UI Layer Structure

```mermaid
graph TB
    subgraph Z-Index Layers
        Layer2000[Particles/Effects<br/>z: 2000]
        Layer1000[Overlays/Modals<br/>z: 1000]
        Layer900[UI Chrome<br/>z: 900]
        Layer100[Game Elements<br/>z: 100]
        Layer0[Background<br/>z: 0]
    end

    Layer2000 -.renders over.-> Layer1000
    Layer1000 -.renders over.-> Layer900
    Layer900 -.renders over.-> Layer100
    Layer100 -.renders over.-> Layer0

    Layer0 --> Gradient[Gradients]
    Layer0 --> Clouds[Decorative Clouds]

    Layer100 --> Bubbles[Letter Bubbles]
    Layer100 --> Stars[Celebration Stars]

    Layer900 --> Score[Score Display]
    Layer900 --> Time[Time Display]
    Layer900 --> Progress[Progress Text]

    Layer1000 --> Modal[Future Modals]

    Layer2000 --> Particles[Particle Effects]

    style Layer2000 fill:#FF4081
    style Layer1000 fill:#9C27B0
    style Layer900 fill:#00BCD4
    style Layer100 fill:#00E676
    style Layer0 fill:#FFEB3B
```

## LetterPopScene Layout Diagram

```mermaid
graph TB
    Scene[LetterPopScene<br/>1920x1200]

    Scene --> TopRow[Top Row Y:40<br/>HUD Elements]
    Scene --> SecondRow[Second Row Y:120<br/>Back Button]
    Scene --> TitleArea[Title Area Y:220-300<br/>Game Title]
    Scene --> PlayArea[Play Area Y:350-1050<br/>Bubbles]
    Scene --> BottomArea[Bottom Area Y:1060-1200<br/>Reserved]

    TopRow --> ScoreLeft[Score: X<br/>X:60 Y:40]
    TopRow --> ProgressCenter[Letter X of 10<br/>X:960 Y:40]
    TopRow --> TimeRight[Time: X:XX<br/>X:1860 Y:40]

    SecondRow --> BackButton[◀ Menu<br/>X:60 Y:120<br/>180x80]

    TitleArea --> Title[Letter Pop!<br/>X:960 Y:240]
    TitleArea --> Subtitle[Pop bubbles...<br/>X:960 Y:290]

    PlayArea --> Bubble1[Bubble 1]
    PlayArea --> Bubble2[Bubble 2]
    PlayArea --> Bubble3[Bubble 3]

    BottomArea --> Future[Future: Hints]

    style Scene fill:#00BCD4
    style TopRow fill:#00E676
    style PlayArea fill:#FF4081
```

## Bubble Rendering Pipeline

```mermaid
flowchart LR
    Create[Create Bubble] --> ChooseColor[Choose Random<br/>Bright Color]
    ChooseColor --> Shadow[Draw Shadow<br/>Z: 0]
    Shadow --> Main[Draw Main Circle<br/>Z: 1]
    Main --> Highlight[Draw Glossy<br/>Highlight Z: 2]
    Highlight --> Border[Draw White<br/>Border Z: 3]
    Border --> Letter[Add Letter Text<br/>Z: 4]
    Letter --> Interactive[Make Interactive]
    Interactive --> Animation[Add Hover<br/>Animation]
    Animation --> Ready[Bubble Ready]

    style ChooseColor fill:#FF4081
    style Main fill:#00BCD4
    style Highlight fill:#FFEB3B
    style Border fill:#FFFFFF
    style Ready fill:#00E676
```

## Font Loading Sequence

```mermaid
sequenceDiagram
    participant Scene as PreloadScene
    participant DOM
    participant Google as Google Fonts
    participant FontAPI as document.fonts
    participant Game as Phaser Game

    Scene->>DOM: Create <link> element
    DOM->>Google: Request Fredoka One
    Google->>DOM: Return font CSS
    DOM->>FontAPI: fonts.load()

    FontAPI->>Scene: Font ready event
    Scene->>Game: Proceed to next scene

    Note over Game: All text uses<br/>Fredoka One font
```

## PWA Manifest Structure

```mermaid
graph LR
    Manifest[manifest.json]

    Manifest --> Meta[App Metadata]
    Manifest --> Display[Display Settings]
    Manifest --> Icons[Icon Definitions]
    Manifest --> Theme[Theme Colors]

    Meta --> Name[name:<br/>Aurora's Letter<br/>Adventure]
    Meta --> ShortName[short_name:<br/>Letter Pop]

    Display --> FullScreen[display:<br/>fullscreen]
    Display --> Landscape[orientation:<br/>landscape]

    Icons --> Icon192[192x192<br/>Home Screen]
    Icons --> Icon512[512x512<br/>Splash Screen]

    Theme --> BGColor[background_color:<br/>#00BCD4]
    Theme --> ThemeColor[theme_color:<br/>#00BCD4]

    style Manifest fill:#00BCD4
    style Display fill:#FF4081
    style Icons fill:#FFEB3B
```

## Service Worker Cache Strategy

```mermaid
flowchart TD
    Request[Browser Request] --> CacheCheck{In Cache?}

    CacheCheck -->|Yes| ReturnCache[Return from Cache]
    CacheCheck -->|No| FetchNetwork[Fetch from Network]

    FetchNetwork --> NetworkSuccess{Success?}
    NetworkSuccess -->|Yes| CacheNew[Cache Response]
    NetworkSuccess -->|No| ReturnError[Return Error]

    CacheNew --> ReturnResponse[Return Response]
    ReturnCache --> End[Display Content]
    ReturnResponse --> End
    ReturnError --> Fallback[Show Offline Page]

    style CacheCheck fill:#00BCD4
    style ReturnCache fill:#00E676
    style CacheNew fill:#FF4081
    style FetchNetwork fill:#FFEB3B
```

## Responsive Scaling Flow

```mermaid
flowchart LR
    Start[Game Starts] --> GetScreen[Get Screen<br/>Dimensions]
    GetScreen --> CalcRatio[Calculate<br/>Aspect Ratio]
    CalcRatio --> Choose{Choose<br/>Scale Mode}

    Choose -->|16:10 or wider| FIT[FIT Mode<br/>Maintain Aspect]
    Choose -->|Narrower| RESIZE[RESIZE Mode<br/>Adapt Layout]

    FIT --> Center[Center Game<br/>Add Letterbox]
    RESIZE --> Adjust[Adjust Layout<br/>Elements]

    Center --> Ready[Game Ready]
    Adjust --> Ready

    Ready --> Monitor{Screen<br/>Resize?}
    Monitor -->|Yes| GetScreen
    Monitor -->|No| Continue[Continue Playing]

    style Start fill:#00BCD4
    style FIT fill:#00E676
    style Ready fill:#FF4081
```

## Button Creation Architecture

```mermaid
classDiagram
    class Button {
        -Graphics background
        -Text label
        -Number width
        -Number height
        -Number color
        +create()
        +addHoverEffect()
        +addClickEffect()
        +setCallback(fn)
    }

    class ButtonStyle {
        <<interface>>
        +backgroundColor
        +borderColor
        +borderWidth
        +borderRadius
        +fontSize
        +fontFamily
    }

    class HoverAnimation {
        +scaleUp()
        +scaleDown()
        +duration
        +ease
    }

    class ClickAnimation {
        +scaleDown()
        +scaleUp()
        +playSound()
        +executeCallback()
    }

    Button --> ButtonStyle
    Button --> HoverAnimation
    Button --> ClickAnimation

    ButtonStyle : backgroundColor = 0xFF6B6B
    ButtonStyle : borderColor = 0xFFFFFF
    ButtonStyle : borderWidth = 6
    ButtonStyle : borderRadius = 20
    ButtonStyle : fontSize = 48px
    ButtonStyle : fontFamily = Fredoka One
```

## Color Application Matrix

```mermaid
graph TB
    subgraph Scenes
        Main[MainMenuScene]
        Letter[LetterPopScene]
        Results[ResultsScene]
    end

    subgraph Colors
        SkyBlue[Sky Blue]
        SunYellow[Sun Yellow]
        BubblePink[Bubble Pink]
        GrassGreen[Grass Green]
        OrangePop[Orange Pop]
        PurpleMagic[Purple Magic]
    end

    Main --> SkyBlue
    Main --> PurpleMagic
    Main --> BubblePink

    Letter --> SkyBlue
    Letter --> ALL[All Colors<br/>for Bubbles]

    Results --> SkyBlue
    Results --> SunYellow
    Results --> GrassGreen

    style Main fill:#00BCD4
    style Letter fill:#FF4081
    style Results fill:#00E676
```

## Deployment Architecture

```mermaid
graph LR
    Developer[Developer<br/>Local Machine]
    Git[Git Repository]
    GitHub[GitHub]
    Pages[GitHub Pages]
    CDN[GitHub CDN]
    User[Aurora's Tablet]

    Developer -->|git push| Git
    Git -->|sync| GitHub
    GitHub -->|auto-deploy| Pages
    Pages -->|serve via| CDN
    CDN -->|HTTPS| User

    User -->|PWA Install| HomeScreen[Home Screen Icon]
    HomeScreen -->|Launch| FullScreen[Fullscreen Game]

    style Developer fill:#00BCD4
    style Pages fill:#4CAF50
    style User fill:#FF4081
    style FullScreen fill:#FFEB3B
```

## Notes

### Why This Architecture?

**ResponsiveUtils Singleton Pattern:**
- Instantiated once per scene
- Provides consistent scaling across all elements
- Prevents hardcoded pixel values
- Easy to maintain and update

**Z-Index Layering:**
- Clear visual hierarchy
- Prevents rendering conflicts
- Particles always on top
- UI always visible

**Color Palette Encapsulation:**
- Defined once, used everywhere
- Easy to adjust entire theme
- Consistent brand identity
- ADHD-friendly high contrast

**PWA Service Worker:**
- Offline-first strategy
- Auto-updates on app launch
- Caches critical assets
- Fast subsequent loads

**Phaser FIT Scale Mode:**
- Maintains aspect ratio
- Works on all screen sizes
- Prevents distortion
- Centers game automatically

### Performance Considerations

**Gradient Rendering:**
- Pre-rendered at scene creation
- Not re-drawn every frame
- Static graphics objects
- Minimal CPU impact

**Font Loading:**
- Loaded once at startup
- Cached by browser
- Fallback chain for reliability
- Document.fonts API for tracking

**Service Worker Caching:**
- Reduces network requests
- Faster load times
- Offline capability
- Automatic updates

**Touch Event Optimization:**
- Large hit areas reduce missed taps
- Immediate visual feedback
- No hover delays on touch
- Optimized for tablets
