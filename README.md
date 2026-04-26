# Meal Planner App

A personal meal planner for Gyaan & Mehak, hosted on GitHub Pages.

## Files

| File | Edit this when you want to change... |
|---|---|
| `index.html` | Page structure only. Usually you will not edit this. |
| `style.css` | Colours, spacing, cards, buttons, layout, mobile design. |
| `data.js` | Meals, shopping list, Gyaan/Mehak targets, calories/protein numbers. |
| `script.js` | App behaviour: tabs, selected meals, localStorage, shopping checklist, reset buttons. |

## Most common edits

### Change a meal

Open `data.js`, find the week/day/meal, and update the meal name, protein, or calories.

Example:

```js
o('2 Eggs + Toast',18,300)
```

Means:

```text
Meal name: 2 Eggs + Toast
Protein: 18g
Calories: 300 kcal
```

### Change protein or calorie targets

Open `data.js` and update the `PERSONS` section.

```js
proMin:100, proMax:120, calMin:1200, calMax:1300
```

### Change shopping list

Open `data.js` and update the `SHOP` section.

### Change colours or design

Open `style.css` and edit the values at the top under `:root`.

## Uploading to GitHub

Upload these files to the root of your GitHub repository:

```text
index.html
style.css
data.js
script.js
README.md
```

Do not put them inside a folder unless GitHub Pages is configured to use that folder.

## Important

`index.html` must stay named exactly `index.html` for GitHub Pages to open it automatically.

## Current features

- Today view
- Week view
- Shopping view
- Gyaan/Mehak profile switch
- Meal option selection
- Local saving using localStorage
- Today progress card
- Reset Today button
- Shopping progress count
- Hide completed shopping items
- Reset shopping list


## App Logo Assets

The app now uses the fork/leaf logo as the main PWA/home-screen icon and header logo.

### Active logo files

- `icon-192.png` — PWA icon
- `icon-512.png` — PWA icon
- `apple-touch-icon.png` — iPhone/iPad home-screen icon
- `favicon-32.png` and `favicon-16.png` — browser tab icons
- `assets/logo-primary.png` — header logo and main source logo

### Logo repository for future use

The extra icon concepts are stored in the repo for later design use:

- `assets/logo-secondary.png`
- `assets/logo-mark-primary.png`
- `assets/logo-mark-infinity.png`
- `assets/logo-mark-plate.png`

To change the active app icon later, replace `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, and `assets/logo-primary.png` with the new logo files.


## Design Cleanup Update

This version simplifies the mobile UI:

- Removes the in-app logo/title header.
- Removes the Week chip from the header.
- Removes the top protein/calorie stat chips because the Today Progress card already shows them.
- Makes the Gyaan/Mehak toggle compact and sticky.
- Changes the Today heading to a compact date format such as `Mon · Apr 27`.
- Adds a compact sticky progress strip while scrolling through meals.
- Hides the large selected day total once meal selections exist, reducing duplicate progress information.

Upload all files except `icon.svg` if you do not want to keep the old SVG source icon.
