---
description: Repository Information Overview
alwaysApply: true
---

# EverPure Organics Product Review Form Information

## Summary
A modern, responsive product review collection form for **EverPure Organics**. It features a nature-inspired aesthetic with rich earthy greens and smooth animations. The application is built as a serverless web app, utilizing **Netlify Functions** for the backend logic and **Neon PostgreSQL** for data persistence.

## Structure
The project is organized with a clear separation between frontend assets, backend logic, and database configuration:
- `public/`: Contains all frontend assets served by the web server.
  - `index.html`: Main entry point containing the form structure and brand headers.
  - `css/styles.css`: Comprehensive styling with nature-inspired gradients, animations, and responsive layouts.
  - `js/script.js`: Client-side logic for form validation, interactive rating, and serverless API communication.
- `netlify/functions/`: Contains serverless backend logic.
  - `submit-review.js`: Handles form submission, validation, and database insertion using `@neondatabase/serverless`.
- `db/`: Database related files.
  - `schema.sql`: Database schema definitions (table structure and custom types).
- `package.json`: Project metadata and dependencies.
- `netlify.toml`: Netlify configuration specifying the publish directory and function path.
- `.env.example`: Template for required environment variables (`DATABASE_URL`).
- `.gitignore`: Standard exclusion rules for node_modules, env files, and build artifacts.

## Language & Runtime
**Frontend**: HTML5, CSS3, JavaScript (ES6+)  
**Backend**: Node.js (via Netlify Functions)  
**Database**: PostgreSQL (Neon Serverless)  
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- `@neondatabase/serverless`: Neon database driver optimized for serverless environments.

## Build & Installation
```bash
# Install dependencies
npm install

# Run locally with hot-reloading
npm run dev
```

## Main Files & Resources
- **public/index.html**: Defines fields for Name, Email, Product selection, Rating, and Review.
- **public/css/styles.css**: Implements a "Nature Spa" aesthetic using gradients, glassmorphism, and organic floating animations.
- **public/js/script.js**: Manages the `FormManager` object, handling UI state, client-side validation, and POST requests to `/.netlify/functions/submit-review`.
- **netlify/functions/submit-review.js**: A Node.js serverless function that parses form data and uses the Neon driver to insert records into the `feedback` table.
- **db/schema.sql**: Creates the `feedback` table and a `productType` enum for structured product data.
- **netlify.toml**: Configures Netlify to serve the `public/` directory and locate functions in `netlify/functions/`.

## Testing & Validation
**Validation**:
- **Frontend**: Presence check for all required fields and Regex-based email validation.
- **Backend**: Method restriction (POST only) and server-side presence check.

**Testing**:
- Local testing is performed using the `netlify dev` command, which proxies function calls and serves the frontend from the `public/` directory.

**Run Command**:
```bash
npm run dev
```
