-- SQL for creating the feedback table in Neon DB
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    product TEXT,
    rating TEXT,
    review TEXT,
    subscribe BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
