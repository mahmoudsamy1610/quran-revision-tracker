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

## 5. Fix hamburger button position (overlaps back button)
- The hamburger menu button (top-left, fixed) overlaps with the in-app "← Back" button on screens that have one.
- Move the hamburger button a bit higher so the two no longer overlap.

## 6. Allow editing a cycle
- Add the ability to edit an existing cycle (beyond rename) — e.g. change its surah selection / settings after creation.

## 7. Add a third cycle-creation option: page of surah
- Cycle creation currently supports "full Quran" and "custom selection of surahs".
- Add a third option to create a cycle scoped to a page (of a surah).

## 8. Reorder cycles and folders by drag and drop
- Let users reorder cycles and folders on the home screen via drag and drop.
- Persist the chosen order alongside the rest of the saved data.
