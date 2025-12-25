---
description: Repository Information Overview
alwaysApply: true
---

# EverPure Organics Product Review Form Information

## Summary
A modern, responsive product review collection form for **EverPure Organics**. The project is designed to collect feedback on the "SereNova Bath Salts" and "PureNest Soaps" product samples. It features an organic, nature-inspired aesthetic with rich green tones and smooth animations. The application uses **Netlify Functions** as a serverless backend to store review data in a **Neon PostgreSQL** database.

## Structure
The project follows a modern serverless structure:
- **Root Directory**:
  - `index.html`: Main UI structure and brand headers.
  - `styles.css`: Nature-inspired theme and responsive layouts.
  - `script.js`: Frontend logic, validation, and API communication.
  - `package.json`: Dependency management for serverless functions.
  - `schema.sql`: Database schema for Neon DB.
  - `.env.example`: Template for required environment variables.
- **netlify/functions/**:
  - `submit-review.js`: Serverless function handling form submissions and DB insertion.
- **.zencoder/**: Repository rules and metadata.

## Language & Runtime
**Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6)  
**Backend**: Node.js (Netlify Functions)  
**Database**: PostgreSQL (Neon)  
**Package Manager**: npm

## Dependencies
**Backend**:
- `@neondatabase/serverless`: Neon database driver for serverless environments.

## Build & Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up the database:
   - Run the SQL in `schema.sql` in your Neon console.
3. Configure environment variables:
   - Copy `.env.example` to `.env`.
   - Add your `DATABASE_URL` from Neon.
4. Run locally (using Netlify CLI):
   ```bash
   netlify dev
   ```

## Main Files & Resources
- **index.html**: Defines the form fields and 5-Star Rating System.
- **script.js**: Communicates with `/.netlify/functions/submit-review`.
- **netlify/functions/submit-review.js**: Validates requests and persists data to Neon.
- **schema.sql**: Defines the `reviews` table structure.

## Testing & Validation
**Frontend Validation**:
- Required fields: Name, Email, Product, Review.
- Email format: Regex validation.
**Backend Validation**:
- Method check: Only allows `POST`.
- Presence check: Ensures all required fields are provided before DB insertion.
**Error Handling**:
- Provides user feedback on submission failure.
- Logs database errors to Netlify function logs.
