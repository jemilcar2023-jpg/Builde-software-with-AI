# 🍲 Recipe Box

Recipe Box is a simple web app for saving, organizing and finding your favorite recipes. Each user creates an account and gets a private recipe collection stored in a cloud database. Only the owner can see or change their recipes.

Built for the Hootcamp "Build Software with AI" assignment, using AI tools to write almost all of the code.

## Links

- **Live app:** _coming soon — Netlify link_
- **Demo video (YouTube, unlisted):** _coming soon_

## What the app does

- **User accounts:** register, log in and log out. You stay logged in between visits until you log out.
- **Recipes (full CRUD):**
  - **Create:** add a recipe with a title, category, prep time, servings, ingredients and instructions
  - **Read:** browse your recipes as cards and open one to see the full recipe
  - **Update:** edit any recipe
  - **Delete:** remove a recipe (after a confirmation)
- **Favorites:** star recipes and filter to show only favorites
- **Search and filter:** search by title or ingredient, and filter by category
- **Privacy:** recipes are protected with per-user permissions (ACLs) in the database, so other users can't read or edit them
- **Works on phones:** the layout adapts to small screens

## Technologies used

| Part | Technology |
| --- | --- |
| Frontend | [React 19](https://react.dev) + [Vite](https://vite.dev) |
| Backend / database | [Back4App](https://www.back4app.com) (hosted Parse Server) |
| Authentication | Back4App / Parse built-in users (`_User` class) |
| Backend SDK | [Parse JavaScript SDK](https://docs.parseplatform.org/js/guide/) |
| Hosting | [Netlify](https://www.netlify.com) |
| CI | GitHub Actions (lint and build on every push) |
| AI tooling | Claude Code |

## Database

Back4App stores two classes (tables):

**`_User`** (built in): `username`, `email`, `password` (hashed by Back4App)

**`Recipe`**

| Field | Type | Description |
| --- | --- | --- |
| `title` | String | Recipe name |
| `category` | String | Breakfast, Lunch, Dinner, Dessert, Snack, Drink or Other |
| `prepTime` | Number | Minutes |
| `servings` | Number | How many people it serves |
| `ingredients` | Array | One string per ingredient |
| `instructions` | String | Step-by-step directions |
| `favorite` | Boolean | Starred by the user |
| `owner` | Pointer → `_User` | Who created the recipe |
| `ACL` | ACL | Read/write allowed for the owner only |

The `Recipe` class is created automatically the first time a recipe is saved.

## Project structure

```
build_Ai/
├── index.html                  # Page shell
├── netlify.toml                # Netlify build settings
├── .env.example                # Template for the Back4App keys
├── .github/workflows/ci.yml    # GitHub Actions: lint + build
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Shows the login screen or the app, based on the user
    ├── index.css               # All styles
    ├── constants.js            # Recipe categories
    ├── lib/
    │   └── parse.js            # Connects to Back4App with the keys from .env
    ├── services/               # All backend calls live here
    │   ├── auth.js             # register, login, logout, getCurrentUser
    │   └── recipes.js          # listRecipes, createRecipe, updateRecipe, deleteRecipe, setFavorite
    └── components/             # UI
        ├── AuthForm.jsx        # Log in / Create account form
        ├── Header.jsx          # Top bar with username and Log out
        ├── RecipesPage.jsx     # Main screen: list, search, filters, and which view is shown
        ├── RecipeCard.jsx      # One recipe tile in the grid
        ├── RecipeDetail.jsx    # Full recipe with Edit / Delete
        └── RecipeForm.jsx      # Add / edit form with validation
```

**Design decisions**

- **Services are kept separate from UI.** Components never talk to Back4App directly. They call functions in `src/services/`, which keeps database code in one place and makes the components easier to read.
- **Security is enforced in the database, not only in the UI.** Every recipe is saved with an ACL that allows only its owner, so even a direct API request can't read or change another user's recipes.
- **No router.** The app has a few screens, so `RecipesPage` switches between list, detail and form views with React state. That keeps it simple and needs no extra Netlify redirect setup.

## Setup instructions (run locally)

**Requirements:** [Node.js](https://nodejs.org) 20 or newer, and a free [Back4App](https://www.back4app.com) account.

1. **Clone the repository**
   ```bash
   git clone https://github.com/jemilcar2023-jpg/Builde-software-with-AI.git
   cd Builde-software-with-AI
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Create a Back4App app.** In Back4App, choose **Build new app → Backend as a Service**, then open **App Settings → Security & Keys**.
4. **Add your keys.** Copy `.env.example` to `.env` and fill in your **Application ID** and **JavaScript Key**:
   ```bash
   cp .env.example .env
   ```
   ```
   VITE_PARSE_APP_ID=your-application-id
   VITE_PARSE_JS_KEY=your-javascript-key
   VITE_PARSE_SERVER_URL=https://parseapi.back4app.com
   ```
5. **Start the app**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173, create an account and add a recipe.

**Other commands**

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the code with ESLint |

## Deploying to Netlify

1. In Netlify, choose **Add new site → Import an existing project** and pick this GitHub repository. The build settings are read from `netlify.toml` (`npm run build`, publish `dist`).
2. Under **Site configuration → Environment variables**, add `VITE_PARSE_APP_ID`, `VITE_PARSE_JS_KEY` and `VITE_PARSE_SERVER_URL` with the same values as your `.env`.
3. Deploy the site.

> The Application ID and JavaScript Key are client keys. They end up in the browser either way, which is expected for Parse apps. Data is protected by the per-user ACLs. **Never** put the Back4App **Master Key** in this project.
