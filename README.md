# SCREENSHOTS

# FlashDeck Frontend

FlashDeck is a responsive spaced-repetition flashcard app built with React and Vite. It lets users organise study decks, create flashcards, review due cards, and track progress.

## Features

- Register and log in with JWT authentication
- Protected application routes
- Dashboard and study statistics
- Deck creation, editing, searching, filtering, and deletion
- Flashcard creation, editing, searching, and deletion
- Study mode with hidden answers and review actions
- Loading, empty, and error states
- Responsive layout

## Technology Stack

- React 18
- Vite
- React Router v6
- Axios
- CSS

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-NAME-flashdeck-frontend.git
cd YOUR-NAME-flashdeck-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API URL

Copy `.env.example` to `.env`.

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Make sure the Django backend is running and allows requests from the Vite development origin.

### 4. Start the frontend

```bash
npm run dev
```

Open the local URL shown by Vite, normally `http://localhost:5173/`.

## Routes

| Route              | Access    | Purpose                 |
| ------------------ | --------- | ----------------------- |
| `/login`         | Public    | Sign in                 |
| `/register`      | Public    | Create an account       |
| `/dashboard`     | Protected | View study statistics   |
| `/decks`         | Protected | Browse and manage decks |
| `/decks/:deckId` | Protected | Manage cards in a deck  |
| `/study`         | Protected | Review due flashcards   |

## Screenshots

Add screenshots to the `screenshots/` directory and embed them below.

### Dashboard

![FlashDeck dashboard](screenshots/dashboard.png)

### Decks

![FlashDeck decks](screenshots/decks.png)

### Deck detail and flashcards

![FlashDeck deck detail](screenshots/deck-detail.png)

### Study mode

![FlashDeck study screen](screenshots/study.png)

## Design Direction

Describe your actual design here—for example, a clean study-focused interface with clear typography, readable flashcards, simple navigation, and responsive layouts.

## Optional Features Completed

List only optional features you actually implemented. If you did not implement any, write: “No optional features implemented; the required assignment features were prioritised.”

## What I Would Add With More Time

- A richer study history and progress chart
- Import/export of decks
- Keyboard shortcuts for reviewing cards
- Additional accessibility improvements

## Backend Repository

[github.com/ariful2017/flashdeck-backend.git](https://github.com/ariful2017/flashdeck-backend.git)

# **SCREENSHOTS**

![1792817991932](image/README/1792817991932.png)

	![1792818004354](image/README/1792818004354.png)
