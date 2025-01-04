# Chat App

https://realtime-chat-mtes.onrender.com/
<br/>
<br/>
(If you encounter a blank screen, kindly wait for it to load as Render spins down due to inactivity.)
<br/>
<br/>
A full-stack real-time chat application built with the React + TypeScript, Postgres (NeonDB + Prisma), Tailwind and Socket.io.

![Screenshot 2025-01-04 at 16-44-24 Chat App](https://github.com/user-attachments/assets/bc899dc2-c211-4cb1-ad48-e21056a06e70)
<br/>

## Features

- Real-time messaging
- User authentication
- Online status indicators
- Message history
- Responsive design
- Search functionality
- Gender-based avatar generation

## Tech Stack

### Frontend
- React with TypeScript
- Zustand for state management
- Socket.IO client for real-time communication
- TailwindCSS & DaisyUI for styling
- React Router for navigation
- React Hot Toast for notifications

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with Prisma ORM
- Socket.IO for real-time functionality
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pern-chat-app
```
2. Install dependencies
```bash
npm i
cd frontend
npm i
```
3. Create .env file in root directory of your project
```bash
DATABASE_URL=your_postgresql_url //NEON DB LINK
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5005
```   
4. Setup DB
 ```bash
 npx prisma generate
 npx prisma db push
 ```
5. Run App
```bash
npm run dev
```
## Database Design
```bash
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// cuid (collision resistant ids), takes up less space than uuid
//cuid 25 chars, uuid 36 char string
model User{ 
  id String @id @default(cuid())
  username String @unique
  fullName String 
  password String
  gender  Gender
  profilePic String
  createdAt DateTime @default(now()) //member since
  updatedAt DateTime @updatedAt
  conversationsIds String[] //araay of strings
  conversations Conversation[]
  message Message[]
}

model Conversation{
  id String @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  participantIds String[]
  participants User[]
  messageId String[]
  messages Message[]
}
model Message{
  id String @id @default(cuid())
  conversationId String
  conversation Conversation @relation(fields: [conversationId], references: [id])

  senderId String
  sender User @relation(fields: [senderId], references: [id]) //fk

  body String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Gender{
  male 
  female
}
```
## Auth with JWT and Realtime communication with Socket.io

![diagram-export-4-1-2025-5_11_52-pm](https://github.com/user-attachments/assets/ef919785-0d9c-4796-9525-abb9f3c8ffcf)
<br/>
<br/>
![diagram-export-4-1-2025-5_08_51-pm](https://github.com/user-attachments/assets/c5c784eb-2cca-4226-865b-ad1ecc437b2a)

