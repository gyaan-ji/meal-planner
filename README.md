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
