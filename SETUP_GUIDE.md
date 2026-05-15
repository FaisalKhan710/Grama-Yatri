# 🚌 Grama-Yatri — Android Studio Setup Guide

Complete step-by-step instructions to build and run the APK.

---

## 📁 Final Project Structure

```
GramaYatri/
├── build.gradle                          ← Root Gradle config
├── settings.gradle                       ← Project settings
├── gradle.properties                     ← Gradle JVM/AndroidX flags
└── app/
    ├── build.gradle                      ← App dependencies & SDK versions
    ├── proguard-rules.pro
    └── src/
        └── main/
            ├── AndroidManifest.xml       ← App permissions & activity declaration
            ├── java/
            │   └── com/gramayatri/app/
            │       └── MainActivity.kt   ← Loads WebView with our HTML app
            ├── assets/
            │   ├── index.html            ← App UI
            │   ├── style.css             ← All styling
            │   └── app.js                ← All logic (ETA, ping, alerts)
            └── res/
                ├── layout/
                │   └── activity_main.xml ← Single WebView layout
                ├── values/
                │   ├── strings.xml
                │   ├── colors.xml
                │   └── themes.xml
                └── mipmap-*/
                    └── ic_launcher*.png  ← App icons (all densities)
```

---

## 🖥️ Step 1 — Install Android Studio

1. Go to: https://developer.android.com/studio
2. Click **Download Android Studio**
3. Run the installer (Windows: `.exe` / Mac: `.dmg` / Linux: `.tar.gz`)
4. During setup wizard:
   - Choose **Standard** installation
   - Let it download the Android SDK (this takes 5–10 min, ~2 GB)
5. Launch Android Studio when done

---

## 📂 Step 2 — Open the Project

**Do NOT create a new project. Open the existing one.**

1. On the Android Studio welcome screen, click **"Open"**
2. Navigate to and select the **`GramaYatri`** folder (the root folder)
3. Click **OK / Open**
4. Wait for Gradle sync to finish (bottom progress bar)
   - First sync downloads dependencies (~500 MB) — this is normal
   - You'll see "Gradle sync finished" in the status bar when done

> ⚠️ If you see **"Gradle JDK not found"**:
> Go to `File → Settings → Build → Gradle → Gradle JDK`
> Select the bundled JDK (usually labelled "jbr-17" or "Embedded JDK")

---

## 📱 Step 3A — Run on a Physical Android Phone (Recommended)

### Enable Developer Mode on your phone:
1. Go to **Settings → About Phone**
2. Tap **"Build Number"** 7 times rapidly
3. You'll see "You are now a developer!"

### Enable USB Debugging:
1. Go to **Settings → Developer Options**
2. Turn on **"USB Debugging"**

### Connect & run:
1. Connect phone to PC via USB cable
2. On your phone, tap **"Allow"** when asked to trust the computer
3. In Android Studio, look at the toolbar — your phone name should appear in the device dropdown (e.g., "Samsung Galaxy A52")
4. Click the green ▶️ **Run** button
5. App installs and launches on your phone automatically ✅

---

## 🖥️ Step 3B — Run on Emulator (No phone needed)

1. In Android Studio toolbar, click the device dropdown → **"Device Manager"**
2. Click **"Create Device"**
3. Choose **Pixel 6** → Next
4. Download **API 34 (Android 14)** system image if not already downloaded → Next → Finish
5. Click the green ▶️ **Run** button
6. Emulator launches and app opens automatically ✅

---

## 📦 Step 4 — Build the APK file

To get an installable `.apk` file you can share:

1. Top menu → **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for build (30–60 seconds)
3. A notification pops up in the bottom-right: **"Build successful"**
4. Click **"locate"** in that notification
5. Your APK is at:
   ```
   GramaYatri/app/build/outputs/apk/debug/app-debug.apk
   ```

### Install the APK on your phone:
- **Via USB**: Copy `app-debug.apk` to your phone → open it in Files app → tap Install
- **Via WhatsApp/Telegram**: Send the APK to yourself → download → tap to install
- **Via email**: Email the APK to yourself → download on phone → tap to install

> ⚠️ Before installing: Go to **Settings → Security → Install unknown apps**
> Find your browser/Files app and enable "Allow from this source"

---

## 🔧 Troubleshooting

| Problem | Fix |
|---|---|
| Gradle sync fails with "SDK not found" | `File → Settings → Android SDK` → check SDK is installed |
| "Device unauthorized" | On phone: tap "Always allow from this computer" in the USB dialog |
| App shows blank white screen | Check `assets/` folder has all 3 files: `index.html`, `style.css`, `app.js` |
| Build fails: "Kotlin not found" | `File → Settings → Plugins` → search Kotlin → Install → Restart |
| "minSdk > device SDK" | Your phone is too old (below Android 5.0). Use emulator with API 21+ |
| Emulator is slow | Enable **Hardware acceleration**: `File → Settings → Emulator` → enable HAXM |

---

## 🚀 Next Steps (for VTU submission)

Once the basic app is working, upgrade it with real Firebase:

### Add Firebase to build.gradle (app):
```gradle
implementation 'com.google.firebase:firebase-database-ktx:20.3.0'
implementation 'com.google.firebase:firebase-auth-ktx:22.3.0'
```

### Add to build.gradle (root):
```gradle
id 'com.google.gms.google-services' version '4.4.0' apply false
```

### Steps:
1. Go to https://console.firebase.google.com
2. Create project → Add Android app → package: `com.gramayatri.app`
3. Download `google-services.json` → place in `app/` folder
4. Replace the in-memory `busStop` variable in `app.js` with Firebase reads/writes

---

*MindMatrix VTU Internship Program — Project 04 | Grama-Yatri*
