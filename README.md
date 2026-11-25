# വിശുദ്ധ ഖുർആൻ – Malayalam Quran Web App

A simple, free Quran reader with a Malayalam interface. Read the Arabic text with a translation, listen to recitation, and install it on your phone like an app.

**Live site:** https://naeemnavas.github.io/quran-malayalam/

## Features

- All 114 surahs with search (by name or number)
- Arabic text with translation under every ayah
- Translations you can switch between:
  - Malayalam: Cheriyamundam Abdul Hameed & Kunhi Mohammed Parappoor
  - Malayalam: Karakunnu & Elayavoor
  - English: Saheeh International
  - English: Yusuf Ali
- Audio recitation for each ayah (Mishary Alafasy)
- Adjustable text size, light and dark mode
- Remembers your last-read surah and chosen translation
- Installable on phones (PWA) and works offline for surahs you have already opened

## How to use it

### Read online
Open the live site above in any browser.

### Install on your phone
- **Android (Chrome):** open the site, tap the **ഇൻസ്റ്റാൾ ചെയ്യുക** button, or menu → *Install app*.
- **iPhone (Safari):** open the site, tap **Share** → **Add to Home Screen**.

After installing, it opens fullscreen like a normal app.

### Using the app
- Tap a surah to read it. Use the **പരിഭാഷ** dropdown to change the translation.
- Tap **▶ കേൾക്കുക** on an ayah to hear it.
- **അ+ / അ−** change the text size. 🌓 switches light/dark mode.
- Use **← മുമ്പത്തെ / അടുത്തത് →** at the bottom to move between surahs.

## Download and run it yourself

There is no build step. It is plain HTML, CSS and JavaScript.

1. Download the code: click **Code → Download ZIP** on GitHub, or run
   ```
   git clone https://github.com/naeemnavas/quran-malayalam.git
   ```
2. Open `index.html` to try it. For the install and offline features, serve the folder over a local web server, because service workers do not work from `file://`:
   ```
   cd quran-malayalam
   python -m http.server 8000
   ```
   Then open http://localhost:8000
3. An internet connection is needed the first time you open each surah, because the text comes from an online API.

## Host your own copy (GitHub Pages)

1. Fork or upload these files to your own GitHub repository.
2. Go to **Settings → Pages**.
3. Under *Build and deployment*, choose **Deploy from a branch**, select branch `main` and folder `/ (root)`, then save.
4. After a minute or two your site is live at `https://<your-username>.github.io/<repo-name>/`.

All file paths are relative, so it works from a sub-folder URL like this without changes.

## Project files

| File | Purpose |
|------|---------|
| `index.html` | Page shell and PWA meta tags |
| `style.css` | Styling, dark mode, mobile layout |
| `app.js` | Surah list, surah view, translation selector, audio, install button |
| `sw.js` | Service worker (offline caching) |
| `manifest.webmanifest` | PWA manifest (name, colors, icons) |
| `icon-*.png` | App icons |
| `make_icons.py` | Optional script that regenerates the icons (`python make_icons.py`) |

## Adding another translation

Open `app.js` and add an entry to the `TRANSLATIONS` list near the top, using an edition identifier from the API, for example:

```js
{ id: 'en.pickthall', label: 'English – Pickthall' },
```

You can see all available editions at https://api.alquran.cloud/v1/edition?format=text&type=translation

## Data sources and credits

- Quran text, translations and audio are served by the free [AlQuran.cloud API](https://alquran.cloud/api).
- Fonts: [Amiri](https://fonts.google.com/specimen/Amiri) (Arabic) and [Noto Sans Malayalam](https://fonts.google.com/noto/specimen/Noto+Sans+Malayalam), via Google Fonts.
- The translations belong to their respective authors and publishers. This project only displays them through the API and does not modify them.

## Note

Please report any mistakes in the text or translation to the API source, and verify important religious matters with a qualified scholar.
