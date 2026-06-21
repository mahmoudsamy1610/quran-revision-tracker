# Backlog

Future features/fixes to implement later. Not yet started.

## 1. Folders to group cycles
- Add a "folder" concept that can contain multiple revision cycles.
- Folders support full CRUD: create, rename, delete, and (re)assign cycles to a folder.
- Home screen should let users browse cycles by folder (or ungrouped).

## 2. Move statistics to the bottom of the page
- Currently the stats/progress overview card is at the top of the cycle detail view and home view.
- Move it to the bottom of the page instead.

## 3. Support native mobile back button
- Currently only the in-app "← Back" button navigates back (e.g. out of cycle detail, out of the surah picker).
- Need to also handle the Android hardware/gesture back button so it navigates back through the app's views instead of closing the app.
- Likely needs Capacitor's App plugin (`backButton` event) wired to the same navigation state used by the in-app back buttons.

## 4. Don't lose data on app updates
- Ensure that updating the app (new APK install/update) does not wipe or lose previously saved localStorage data (cycles, progress, logs).
- Investigate whether this is already safe (localStorage in the Capacitor WebView should persist across app updates as long as the package/applicationId and storage key don't change) or if there's a real risk to mitigate.
