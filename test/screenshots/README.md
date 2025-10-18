# GUI Testing Screenshots

This directory contains screenshots captured during GUI visual testing using the personality review protocol defined in `.ai/GUARDRAILS.md`.

## Organization

Screenshots are organized by scene/feature with version iterations:

```
test/screenshots/
├── main-menu/
│   ├── v1-initial.png
│   ├── v2-iteration.png
│   └── feedback-notes.md
├── bubble-pop/
│   └── ...
└── settings/
    └── ...
```

## Capturing Screenshots

```bash
# Take screenshot on emulator
/home/corey/android-sdk/platform-tools/adb shell screencap -p /sdcard/screenshot.png

# Pull to local directory
/home/corey/android-sdk/platform-tools/adb pull /sdcard/screenshot.png test/screenshots/[scene-name]/v[X]-[description].png
```

## Review Process

Each screenshot must be reviewed by 5 diverse personalities following the protocol in GUARDRAILS.md.

See `.ai/GUARDRAILS.md` section "GUI Visual Testing Protocol" for complete workflow.
