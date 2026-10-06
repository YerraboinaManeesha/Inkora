# Inkora

**Ideas worth reading. Conversations worth joining.**

A full-stack, editorial-style blog platform built with React, Node.js/Express, and
MongoDB. Warm ivory, deep plum, and rose color palette; light/dark mode; JWT
authentication with role-based access for users and admins.

## Stack

- **Frontend:** React 18 + Vite, React Router, plain CSS (custom design system, no UI kit)
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT + bcrypt-hashed passwords, single login endpoint, backend-determined roles

## Project structure

```
inkora/
├── backend/          Express API
│   ├── config/       MongoDB connection
│   ├── models/       User, Article, Category, Like, Comment, Reply
│   ├── middleware/   JWT auth + admin guard
│   ├── routes/       auth, articles, categories, likes, comments, users, admin
│   └── utils/        token helper, seed script
└── frontend/         React app
    └── src/
        ├── pages/         Public pages (landing, auth, articles, about, profile…)
        ├── pages/admin/   Admin dashboard (overview, articles, categories, users…)
        ├── components/    Navbar, Footer, ArticleCard, CommentSection, route guards
        ├── context/       Auth + theme (light/dark) context
        └── styles/        Design tokens (theme.css)
```

## Getting started

### 1. Backend

```bash
cd backend
cp .env.example .env     # edit MONGO_URI / JWT_SECRET as needed
npm install
npm run seed              # creates the first admin account + sample articles
npm run dev                # starts the API on http://localhost:5000
```

The seed script creates an admin using the `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD` values in `.env` (defaults: `admin@inkora.com` /
`ChangeMe123!`). **Change the password after first login.** There is no public
way to create an admin account — this script (or an existing admin manually
promoting a user in the database) is the only path.

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # point VITE_API_URL at your backend if not localhost
npm install
npm run dev                 # starts the app on http://localhost:5173
```

### 3. Log in

- Visit `http://localhost:5173`, click **Get Started**, and either sign up as a
  reader or sign in with the seeded admin credentials.
- The same login form is used for both — the backend looks up the account's
  role and the frontend redirects to `/articles` (readers) or `/admin` (admins)
  accordingly. There's no role picker anywhere in the UI.

## Notes on the design

- Public signup can only ever create a `role: "user"` account — the signup
  route never accepts a role field, so there is no way to create an admin
  through the UI.
- Articles, likes, comments, and replies live in their own MongoDB
  collections, as specified. Deleting an article cascades to its likes and
  comments; deleting a comment cascades to its reply.
- A user can like an article only once — enforced by a unique compound index
  on `(article, user)` in the `Like` collection, in addition to the API logic.
- Reading full articles, browsing/searching, liking, and commenting all
  require a signed-in account, matching the "User Features — after login"
  requirement in the brief. The landing page itself is public and shows
  featured/latest article previews to unauthenticated visitors.
