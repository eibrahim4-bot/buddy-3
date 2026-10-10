# Focus Friend

A Chrome extension that turns studying into a game. Pick a session length and a cute animal buddy keeps you company in Chrome's side panel. Wander onto a distracting site and your buddy gets nervous and loses health. Finish the timer to earn points, then spend them on accessories, colors, and new animals.

**Demo flow:** start a session, open TikTok, watch the buddy panic, go back to your notes, finish the timer, earn points.

## Install (developer mode)

1. Download or clone this repo.
2. Open `chrome://extensions` and turn on **Developer mode** (top right).
3. Click **Load unpacked** and select this folder (the one containing `manifest.json`).
4. Click the Focus Friend icon in the toolbar. The side panel opens and stays open while you switch tabs.

Requires Chrome 116 or newer (side panel support). After editing code, click the refresh icon on the extension's card.

### Demo mode

Real sessions are at least 15 minutes, which is slow for a live demo. In **Settings**, turn on **Demo mode**: session time runs 30x faster and 1-minute sessions are allowed. The 10-second warning grace period stays in real time.

## How it works

| Rule | Detail |
|---|---|
| Session length | 15 minutes minimum, health resets to 100 every session |
| Site categories | Productive, distracting, or neutral. Unlisted sites (including YouTube and Reddit by default) are neutral and do nothing. Edit the lists in Settings, or override one site for the current session from the Focus screen |
| Warning | Entering a distracting site shows "Your buddy is getting distracted!" and starts a 10-second grace period. Health only drops after that, and stops as soon as you leave |
| Health | `health = 100 - (distracted time / allowed distraction time) x 100`, where allowed distraction time is 20% of the session (25 min session: 5 min, 60 min: 12 min, 120 min: 24 min) |
| Moods | 76-100 happy, 51-75 okay, 26-50 sad, 1-25 panicking, 0 fainted (paused = sleeping) |
| Points | `base = productive minutes`, `bonus = round(base x final health / 200)`, `total = base + bonus`. Only productive and neutral time counts. Points are awarded only when the timer finishes |
| Points are never lost | A failed session earns nothing, but nothing is taken away. Purchases are permanent |
| Fainting | The session pauses. Spend 20 points to rescue the buddy (restores 30 health, once per session) or end the session |
| Treat | 10 points, restores 20 health during a session |
| Daily streak | Secured the moment you reach 15 productive minutes in a calendar day, even across several or failed sessions. Missing a whole day ends it |
| Pausing | Allowed. Paused time never counts toward points or the streak |
| Closing Chrome | Pauses the session. Reopening the panel keeps the timer |
| Emergency exit | "End session" earns no points, and minutes already focused still count toward the streak |
| Notifications | Only three: entered a distracting site, five minutes left, session finished or buddy fainted (plus one gentle nudge if you have been away for 3+ days). Sound is off by default |
| Privacy | Only totals and settings are stored (`chrome.storage.local`). Browsing history is never saved |

### Shop

| Item | Cost |
|---|---|
| Treat (restore 20 health) | 10 |
| Bow or glasses | 50 |
| Top hat | 75 |
| Special color (mint, lavender, pink) | 100 |
| New animal (29 to unlock, golden retriever is free) | 200 |

## Project layout

```
manifest.json     Manifest V3, permissions, side panel
background.js     Service worker: the single source of truth for state, tab watching, notifications
shared.js         Game rules and pure logic (health, points, streak, site classification)
art.js            All 30 SVG animals, 6 moods each, plus accessories (no image files)
sidepanel.html    Side panel page
sidepanel.css     Styling
sidepanel.js      UI: sends actions to the worker, renders the state it saves
tests/logic.test.js   Run with: node tests/logic.test.js
icons/            Extension icons
```

How the pieces talk: the side panel sends small messages (`start`, `pause`, `treat`, ...) to `background.js`. The worker loads the state, moves the clock forward from stored timestamps (so it survives the service worker sleeping), applies the action, saves, and fires any notifications. The side panel re-renders whenever storage changes.

## Customizing

* **Game balance:** all numbers (grace period, 20% allowance, costs, rescue, streak minutes) are constants at the top of `shared.js`.
* **Site lists:** defaults are `DEFAULT_PRODUCTIVE` and `DEFAULT_DISTRACTING` in `shared.js`.
* **New animals:** draw one with `mam({...})` (any four-legged animal) or a custom function in `art.js`, add it to `ANIMALS`, and add its id to `ANIMAL_IDS` in `shared.js`. The test checks they match.
* **Accessories and colors:** `ITEMS` in `shared.js`, drawn in `accessory()` in `art.js`.

## Known limits

* Chrome extensions can see which website you are on, but not other desktop apps, so app tracking is out of scope.
* The extension cannot run on Chrome's internal pages (`chrome://...`); those count as neutral.
* While the side panel is closed, time is checked every 30 seconds (Chrome's alarm limit), so the "session finished" message can arrive up to 30 seconds late. While it is open, it updates every second.

## Roadmap ideas

Streak freezes (50 points) and revives (100 points), a floating buddy on web pages, study groups and leaderboards, weekly stats, more accessories per animal.

## License

MIT


## Floating on-page buddy + custom session lengths

The same SVG animal artwork from `art.js` now appears as a draggable character on normal HTTP/HTTPS webpages. Drag the buddy to move it; use the small × button to hide it on that page. It has no surrounding circle/card outline, and its expression and health bar follow the current session. Chrome extensions cannot draw over the entire desktop or over protected Chrome pages such as `chrome://settings`; this buddy appears on regular webpages.

The Focus screen accepts any whole-number duration from 1 to 600 minutes; the preset timer buttons have been removed.


## Playful animation

The on-page buddy now gently bobs and sways while idle. Clicking/tapping it makes it hop and show a cheerful message with sparkles; dragging still moves it around the webpage. The motion changes when the study session is paused or the buddy faints.
