# ❤️‍🩹 AI Voice Agent — Laiba

A responsive Urdu/English AI chat and voice starter app, with the supplied profile photo and a custom heart logo.

## Features
- Mobile-first responsive interface
- Urdu, Roman Urdu and English text chat
- Browser speech-to-text where supported
- Spoken answers using the device's available speech voices
- Netlify Function keeps the OpenAI API key on the server
- Custom SVG logo and supplied profile image

## Requirements
- Node.js 20+
- Netlify account for hosted deployment
- An OpenAI API key (keep it private)

## Run locally
```bash
npm install
npx netlify dev
```
Open the local URL printed by Netlify CLI. Set `OPENAI_API_KEY` in a local `.env` file for testing:
```env
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```
Never commit `.env` or share your API key. Add `.env` to `.gitignore` before committing.

## Deploy to Netlify
1. Push this project to a private GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project** and select the repository.
3. Set the environment variable `OPENAI_API_KEY` in **Site configuration → Environment variables**. Optionally set `OPENAI_MODEL`.
4. Deploy. The app is served from `public/`; the chat backend runs as a Netlify Function.

## Voice notes
Speech recognition support varies by browser; Chrome-based browsers generally have better support. The app chooses a suitable installed voice when possible, but a female Urdu voice is not guaranteed on every phone. For consistent premium Urdu female speech, integrate a dedicated text-to-speech provider on the server.

## Important limitations
- An AI model cannot guarantee correct answers to every question or every historical/current fact. Verify important information.
- The app does not have live web search yet.
- Browser speech synthesis uses voices installed on the visitor's device.
- No WhatsApp number is embedded in this starter. Avoid publishing a personal phone number in a public website; use a dedicated business contact number with permission instead.


## Website + Android APK (Capacitor 8)

The project is configured for both Netlify Website hosting and an Android wrapper.
Capacitor 8 requires Node.js 22+ and Android Studio with an Android SDK installed.

### 1. Configure the API URL
Deploy the website to Netlify first. In `public/config.js`, set the public site URL:
```js
window.LAIBA_API_BASE_URL = "https://YOUR-SITE-NAME.netlify.app";
```
This is a public website URL, not a secret. Keep `OPENAI_API_KEY` only in Netlify environment variables.

### 2. Create Android project
Run these commands from the project root:
```bash
npm install
npx cap add android
npx cap sync android
npx cap open android
```
If `android/` already exists, skip `npx cap add android` and run `npx cap sync android`.

### 3. Build APK
In Android Studio:
- Wait for Gradle sync to finish.
- Connect an Android phone with USB debugging enabled, or start an emulator.
- Use **Build → Build Bundle(s) / APK(s) → Build APK(s)** for a test APK.
- Android Studio shows the output location when the build completes.

For a command-line debug build on macOS/Linux:
```bash
cd android
./gradlew assembleDebug
```
On Windows:
```bat
cd android
gradlew.bat assembleDebug
```
The debug APK is normally at `android/app/build/outputs/apk/debug/app-debug.apk`.

### 4. Updating the app
After changing files in `public/`, run:
```bash
npx cap sync android
```
Then rebuild from Android Studio.

### Notes
- The Android wrapper needs an internet connection for the hosted AI function. The API key stays on Netlify, never in the APK.
- Browser speech recognition and the available Urdu/female text-to-speech voices depend on Android WebView/device support. Test on the target phone; do not assume every device provides the same voice.
- The Android project is generated locally by `npx cap add android`; this ZIP does not contain a precompiled APK.


## Build APK using only an Android phone (GitHub Actions)

A workflow is included at `.github/workflows/android-apk.yml`.
1. Upload this project to a GitHub repository with the default branch named `main`.
2. Open the repository on GitHub in your phone browser. Go to **Actions** and enable workflows if GitHub asks.
3. Select **Build Laiba Android APK** → **Run workflow**.
4. Wait for the workflow to finish successfully.
5. Open the completed workflow run, scroll to **Artifacts**, and download `laiba-debug-apk`.
6. Extract the downloaded artifact ZIP and install `app-debug.apk` on your Android phone. Android may ask you to allow installs from the browser/file manager you used; only install the APK you built from your own repository.

The workflow builds a debug APK in GitHub's cloud runner. It does not create a Play Store release/signing key. For a public release, configure a private signing key securely in GitHub Actions secrets and build a signed release separately.

## Mobile-only publishing order
1. Upload the project to GitHub.
2. Import that GitHub repository into Netlify and deploy it.
3. Add `OPENAI_API_KEY` under Netlify Project configuration → Environment variables, then redeploy.
4. Copy the public Netlify site URL into `public/config.js` as `window.LAIBA_API_BASE_URL`, commit that change to GitHub, and wait for the site redeploy.
5. Run the GitHub Actions workflow to build the APK containing the correct API URL.
