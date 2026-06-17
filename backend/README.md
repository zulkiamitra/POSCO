# Backend (Express + TypeScript)

## Setup
1) Install dependencies
   npm install

2) Copy env file
   copy .env.example .env

   Update DATABASE_URL for your PostgreSQL instance.

3) Prisma generate
   npm run prisma:generate

4) Ensure the database exists (e.g. create `posco` in PostgreSQL)

5) Create database schema
   npm run prisma:migrate

## Run
- Dev: npm run dev
- Build: npm run build
- Start: npm run start

## Endpoints
- GET /health
- POST /auth/register
- POST /auth/login
- GET /auth/me
- CRUD /users
- CRUD /posyandus
- CRUD /children
- CRUD /pregnancies
- CRUD /sessions
- CRUD /referrals

All CRUD endpoints require `Authorization: Bearer <token>`.
