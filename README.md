# Quran Revision Tracker

A mushaf-styled app for tracking your Quran revision (muraja'ah). Plan revision
cycles, log how far you've reached in each surah, watch your daily pace, and
organize everything into folders.

Built with **Vite + React** and packaged as an **Android app** with **Capacitor**.
All your data is stored locally on your device — no account, no server, nothing
leaves your phone.

---

## Features

### Revision cycles
- **Create cycles** for whatever you're revising — the **full Quran** (all 114
  surahs) or a **custom selection** of surahs you pick yourself.
- **Track progress per surah** by recording the ayah you've reached. Each surah
  shows a progress bar and a complete/in-progress/not-started status.
- **Rename, duplicate, reset, or delete** any cycle. Duplicating a cycle keeps
  the same surah selection but starts fresh with zero progress.
- **Search** within a cycle by surah name (English or Arabic) or number.

### Folders
- **Group cycles into folders** (e.g. "Ramadan", "Memorization", "Weekly").
- Full **CRUD**: create, rename, and delete folders. Deleting a folder does
  **not** delete its cycles — they simply move back to "Ungrouped".
- **Duplicate a folder** along with all the cycles inside it. The copied cycles
  keep their names and surah selection but start with **zero progress** — handy
  for starting a new round from a fixed plan.
- Each folder shows a progress overview of the cycles it contains.

### Statistics & daily pace
- A **progress overview** at the bottom of the home, folder, and cycle screens
  shows a donut chart per cycle.
- Per cycle you can see: overall percentage, ayahs done vs. total, surahs
  completed, **average ayahs per day**, ayahs done **today**, and days elapsed
  since the cycle started (or was last reset).

### Native experience
- The **Android hardware/gesture back button** navigates back through screens
  and closes open panels — just like the in-app back button — instead of
  abruptly closing the app.
- Arabic surah names rendered in the **Amiri** mushaf font.

### Your data is safe
- All data lives in the device's local storage and **persists across app
  updates** — updating to a newer version never wipes your cycles or progress.
- The save format is backward-compatible, so older saved data keeps working
  after updates.

---

## Tech stack

| Area        | Tooling                                   |
|-------------|-------------------------------------------|
| UI          | React 18                                  |
| Build       | Vite                                      |
| Mobile shell| Capacitor (Android)                       |
| Back button | `@capacitor/app`                          |
| Storage     | Browser `localStorage` (in the WebView)   |

---

## Development

```bash
npm install        # install dependencies
npm run dev        # run the web app locally with hot reload
npm run build      # build the production web bundle into dist/
```

To work on the Android project after a web build:

```bash
npx cap sync android   # copy the web build + plugins into the native project
```

---

## Building the Android APK

APKs are built automatically by GitHub Actions (`.github/workflows/build-apk.yml`)
on every push and can also be triggered manually ("Run workflow").

- Builds are **signed with a stable release key** (kept in GitHub repository
  secrets), so each new APK installs as an **update over the previous one** —
  no uninstall required, and your data is preserved.
- The **version auto-increments** with every build (`versionCode` = workflow run
  number, `versionName` = `1.0.<run>`), which Android needs to recognize a newer
  build as an update.
- The signed APK is published as a workflow **artifact** named
  `app-release-apk-v1.0.<run>`.

### Signing secrets

The release signing key is provided to CI via these repository secrets:

| Secret                      | Purpose                              |
|-----------------------------|--------------------------------------|
| `ANDROID_KEYSTORE_BASE64`   | The release keystore, base64-encoded |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password                    |
| `ANDROID_KEY_ALIAS`         | Key alias                            |
| `ANDROID_KEY_PASSWORD`      | Key password                         |

If the secrets are absent, the build falls back to the debug key so CI still
succeeds (those APKs are not update-compatible with the signed ones).
