# Ubuntu Machine Setup Guide

**Target:** Native Ubuntu machine (not WSL2)
**Project:** Aurora's Reading Adventure - Kotlin/libGDX Android Game
**Purpose:** Complete setup instructions from fresh checkout to running emulator

---

## Prerequisites

### System Requirements
- Ubuntu 20.04 LTS or newer (22.04+ recommended)
- 16GB RAM minimum (Android emulator is memory-intensive)
- 50GB free disk space
- CPU with virtualization support (Intel VT-x or AMD-V)

---

## Step 1: Install System Dependencies

### 1.1 Update Package Manager
```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Install Java Development Kit (JDK 17)
```bash
# Install OpenJDK 17 (required for Gradle 8.4)
sudo apt install -y openjdk-17-jdk

# Verify installation
java -version
# Should show: openjdk version "17.x.x"

# Set JAVA_HOME if needed
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
source ~/.bashrc
```

### 1.3 Install Build Tools
```bash
# Git (if not already installed)
sudo apt install -y git

# Unzip (required for Android SDK)
sudo apt install -y unzip zip

# Build essentials
sudo apt install -y build-essential
```

### 1.4 Install Android Emulator Dependencies
```bash
# KVM (hardware acceleration for emulator)
sudo apt install -y qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils

# Add your user to kvm group
sudo usermod -aG kvm $USER

# PulseAudio (for emulator audio)
sudo apt install -y libpulse0 pulseaudio

# Qt and XCB libraries (for emulator GUI)
sudo apt install -y \
  libxcb-cursor0 libxcb-xinerama0 libxcb-randr0 libxcb-render-util0 \
  libxcb-icccm4 libxcb-image0 libxcb-keysyms1 libxcb-shape0 \
  libxcb-xkb1 libxcb1 libxcb-glx0 libqt5gui5 libqt5core5a libqt5widgets5 \
  libxcb1-dev libx11-xcb-dev libglu1-mesa-dev libxrender-dev libxi-dev \
  libxkbcommon-dev libxkbcommon-x11-dev

# OpenGL libraries
sudo apt install -y libgl1-mesa-dev libglu1-mesa-dev
```

### 1.5 Verify KVM is Available
```bash
# Check if KVM is enabled
ls -la /dev/kvm
# Should show: crw-rw---- ... kvm

# If permissions are wrong, fix them
sudo chmod 666 /dev/kvm

# Verify your user is in kvm group
groups | grep kvm
```

**IMPORTANT:** Log out and log back in after adding yourself to the kvm group.

---

## Step 2: Install Android SDK

### 2.1 Download Android Command Line Tools
```bash
# Create SDK directory
mkdir -p ~/android/sdk
cd ~/android/sdk

# Download latest command line tools (update URL if needed)
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip

# Extract
unzip commandlinetools-linux-*_latest.zip

# Create proper directory structure
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true
```

### 2.2 Set Environment Variables
```bash
# Add to ~/.bashrc
echo 'export ANDROID_HOME=$HOME/android/sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.bashrc
source ~/.bashrc
```

### 2.3 Accept Android SDK Licenses
```bash
cd $ANDROID_HOME/cmdline-tools/latest/bin
yes | ./sdkmanager --licenses
```

### 2.4 Install Required SDK Packages
```bash
# Install platform tools (adb, fastboot)
./sdkmanager "platform-tools"

# Install build tools
./sdkmanager "build-tools;34.0.0"

# Install Android 13 platform (API 33 - target for this project)
./sdkmanager "platforms;android-33"

# Install emulator
./sdkmanager "emulator"

# Install system image for emulator (x86_64 for better performance)
./sdkmanager "system-images;android-33;google_apis;x86_64"

# Verify installations
./sdkmanager --list_installed
```

---

## Step 3: Clone Project Repository

### 3.1 Clone from GitHub
```bash
# Navigate to your development directory
cd ~  # or wherever you keep projects

# Clone the repository
git clone <YOUR_REPO_URL> "Alphabet & Sight Words Game"

# Navigate into project
cd "Alphabet & Sight Words Game"
```

### 3.2 Verify Project Structure
```bash
# Check key files exist
ls -la

# Should see:
# - build.gradle.kts
# - settings.gradle.kts
# - gradle/wrapper/
# - core/
# - games/
# - android/
# - assets/
# - .ai/
```

---

## Step 4: Configure Project

### 4.1 Create local.properties
```bash
# Create local.properties file with Android SDK path
echo "sdk.dir=$HOME/android/sdk" > local.properties

# Verify it was created
cat local.properties
```

### 4.2 Verify Gradle Wrapper
```bash
# Make gradlew executable
chmod +x gradlew

# Test Gradle
./gradlew --version

# Should show:
# Gradle 8.4
# Kotlin 1.9.23
# JVM 17.x.x
```

---

## Step 5: Build the Project

### 5.1 Clean Build
```bash
# Run clean build
./gradlew clean

# Build debug APK (first build takes 2-5 minutes)
./gradlew assembleDebug
```

### 5.2 Verify APK was Created
```bash
# Check APK location
ls -lh android/build/outputs/apk/debug/

# Should see: android-debug.apk (~13MB)

# Copy to root for convenience
cp android/build/outputs/apk/debug/android-debug.apk ReadingAdventure.apk
```

---

## Step 6: Create Android Emulator

### 6.1 Create AVD (Android Virtual Device)
```bash
# Create tablet emulator matching Samsung Galaxy Tab S7 FE specs
$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager create avd \
  -n Galaxy_Tab_S7_FE \
  -k "system-images;android-33;google_apis;x86_64" \
  -d pixel_tablet \
  -f

# List available AVDs to verify
$ANDROID_HOME/emulator/emulator -list-avds
# Should show: Galaxy_Tab_S7_FE
```

### 6.2 Configure AVD (Optional - for better performance)
```bash
# Edit AVD config for better performance
nano ~/.android/avd/Galaxy_Tab_S7_FE.avd/config.ini

# Recommended settings:
# hw.ramSize=4096
# hw.gpu.enabled=yes
# hw.gpu.mode=auto
```

---

## Step 7: Launch Emulator and Test

### 7.1 Start Emulator
```bash
# Launch emulator in background
$ANDROID_HOME/emulator/emulator \
  -avd Galaxy_Tab_S7_FE \
  -gpu swiftshader_indirect \
  -no-snapshot-save &

# Wait 30-60 seconds for emulator to fully boot
```

### 7.2 Verify Emulator is Running
```bash
# Check connected devices
$ANDROID_HOME/platform-tools/adb devices

# Should show:
# emulator-5554   device
```

### 7.3 Install and Run APK
```bash
# Install APK to emulator
$ANDROID_HOME/platform-tools/adb install -r ReadingAdventure.apk

# Launch the app (manual - tap app icon on emulator)
# Or launch via command line:
$ANDROID_HOME/platform-tools/adb shell am start -n com.aurora.reading/com.aurora.reading.AndroidLauncher
```

---

## Step 8: Development Workflow

### Build Commands
```bash
# Clean build
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Build and install to connected device/emulator
./gradlew installDebug

# Run app on device/emulator
./gradlew android:run
```

### Emulator Management
```bash
# List AVDs
$ANDROID_HOME/emulator/emulator -list-avds

# Start emulator
$ANDROID_HOME/emulator/emulator -avd Galaxy_Tab_S7_FE -gpu swiftshader_indirect &

# Check connected devices
$ANDROID_HOME/platform-tools/adb devices

# Kill all emulators
pkill -9 qemu-system-x86

# Clear emulator data (factory reset)
$ANDROID_HOME/emulator/emulator -avd Galaxy_Tab_S7_FE -wipe-data
```

### ADB Commands
```bash
# Install APK (replace existing)
$ANDROID_HOME/platform-tools/adb install -r ReadingAdventure.apk

# Uninstall app
$ANDROID_HOME/platform-tools/adb uninstall com.aurora.reading

# View live logs
$ANDROID_HOME/platform-tools/adb logcat

# View logs filtered to app
$ANDROID_HOME/platform-tools/adb logcat | grep "aurora"

# Take screenshot
$ANDROID_HOME/platform-tools/adb shell screencap -p /sdcard/screenshot.png
$ANDROID_HOME/platform-tools/adb pull /sdcard/screenshot.png .
```

---

## Troubleshooting

### Issue: "JAVA_HOME not set"
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
```

### Issue: "KVM permission denied"
```bash
sudo chmod 666 /dev/kvm
# Or add user to kvm group and reboot:
sudo usermod -aG kvm $USER
# Then log out and log back in
```

### Issue: Emulator won't start
```bash
# Try with verbose logging
$ANDROID_HOME/emulator/emulator -avd Galaxy_Tab_S7_FE -verbose -gpu swiftshader_indirect

# Check KVM is working
ls -la /dev/kvm
groups | grep kvm

# Verify system image is installed
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --list_installed | grep system-images
```

### Issue: "Unable to locate adb"
```bash
# Add to PATH
export PATH=$PATH:$HOME/android/sdk/platform-tools
echo 'export PATH=$PATH:$HOME/android/sdk/platform-tools' >> ~/.bashrc
source ~/.bashrc
```

### Issue: Gradle build fails
```bash
# Check Java version
java -version  # Must be 17.x.x

# Check Gradle can find JDK
./gradlew --version

# Clean and rebuild
./gradlew clean
./gradlew assembleDebug --stacktrace
```

### Issue: Emulator is slow
```bash
# Ensure KVM is enabled (hardware acceleration)
egrep -c '(vmx|svm)' /proc/cpuinfo
# Should return > 0

# Use software rendering if hardware acceleration fails
$ANDROID_HOME/emulator/emulator -avd Galaxy_Tab_S7_FE -gpu swiftshader_indirect

# Reduce emulator RAM if system is constrained
nano ~/.android/avd/Galaxy_Tab_S7_FE.avd/config.ini
# Set: hw.ramSize=2048
```

---

## Quick Start Commands (After Setup)

```bash
# Navigate to project
cd ~/"Alphabet & Sight Words Game"

# Build APK
./gradlew assembleDebug
cp android/build/outputs/apk/debug/android-debug.apk ReadingAdventure.apk

# Start emulator
$ANDROID_HOME/emulator/emulator -avd Galaxy_Tab_S7_FE -gpu swiftshader_indirect -no-snapshot-save &

# Wait 30 seconds, then install
$ANDROID_HOME/platform-tools/adb install -r ReadingAdventure.apk
```

---

## Project Documentation

After setup, read these files to understand the project:

1. **`.ai/START.md`** - Development entry point
2. **`.ai/MEMORY.md`** - Latest session notes and architecture
3. **`.ai/PERSONA.md`** - Developer methodology
4. **`.ai/GUARDRAILS.md`** - Code quality standards

---

## Environment Summary

When fully configured, your environment will have:

- **JDK 17** at `/usr/lib/jvm/java-17-openjdk-amd64`
- **Android SDK** at `~/android/sdk`
- **Gradle 8.4** (via wrapper in project)
- **Kotlin 1.9.23** (via Gradle)
- **libGDX 1.12.1** (via Gradle dependencies)
- **AVD** named `Galaxy_Tab_S7_FE` (Android 13, API 33)

---

## Notes

- **First build takes 2-5 minutes** as Gradle downloads dependencies
- **Emulator takes 30-60 seconds** to fully boot
- **KVM must be enabled** for acceptable emulator performance
- **Native Ubuntu is faster** than WSL2 for Android development
- **APK size is ~13MB** for debug builds

---

## Next Steps After Setup

1. Read `.ai/MEMORY.md` to see current phase (2.7.4 - Component Translation)
2. Test the 4 UI components in the emulator
3. Continue to Phase 2.7.5 (Main Menu Scene)

---

**Questions?** Check `.ai/MEMORY.md` for troubleshooting from previous sessions.
