# Docs Folder
# CampusCare — Smart Facility Management System

A mobile application that bridges the gap between the university community and the Facility Management Team, designed to digitize the maintenance workflow and make campus smarter, safer, and more efficient.

**Technologies:** React Native (Mobile) · Node.js (Backend) · Supabase (Database & Storage)

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Supabase Setup](#supabase-setup)
- [Frontend Setup](#frontend-setup)
- [Find Your IP Address](#find-your-ip-address)
- [Test Accounts](#test-accounts)
- [Full Workflow Testing](#full-workflow-testing)
- [Common Issues](#common-issues)
- [Run Commands Summary](#run-commands-summary)

---

## Overview

CampusCare consists of two main parts:

| Component | Technology |
|---|---|
| Backend API | Node.js + Express |
| Mobile Application | React Native + Expo |

The system uses:
- **Supabase PostgreSQL** — database
- **Supabase Storage** — cloud image uploads
- **JWT Authentication** — security

---

## Prerequisites

Before running the project, install the following:

| Software | Purpose |
|---|---|
| Node.js (v18+) | Run backend and frontend |
| npm | Install dependencies |
| VS Code | Code editor |
| Expo Go | Run app on mobile device |
| Git | Version control |
| Supabase Account | Database and storage |

Check installed versions:

```bash
node -v
npm -v
```

---

## Project Structure

```
campuscare-project/
├── backend/
└── mobile/
```

---

## Backend Setup

**Step 1: Open backend folder**

```bash
cd backend
```

**Step 2: Install dependencies**

```bash
npm install
```

**Step 3: Create `.env` file**

Create a file named `.env` in the backend folder and add:

```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=campuscare_secret
```

**Step 4: Run the backend**

```bash
npm run dev
```

Expected output:
```
Server running on port 3000
```

---

## Supabase Setup

**Step 1: Create a Supabase project**

Create a project named `CampusCare` at [supabase.com](https://supabase.com).

**Step 2: Create the following tables**

- `users`
- `issues`
- `comments`
- `issue_photos`

**Step 3: Create a storage bucket**

Go to **Storage → New Bucket**, create a bucket named:

```
issue-photos
```

Set the bucket to **public**.

---

## Frontend Setup

**Step 1: Open mobile folder**

```bash
cd mobile
```

**Step 2: Install dependencies**

```bash
npm install
```

**Step 3: Configure API URL**

Open `mobile/src/api/api.js` and set your backend URL:

```javascript
baseURL: "http://YOUR_IP:3000/api"
```

Example:

```javascript
baseURL: "http://192.168.1.206:3000/api"
```

**Step 4: Run Expo**

```bash
npx expo start -c
```

Scan the QR code using the **Expo Go** app on your phone.

---

## Find Your IP Address

Run the following command on your laptop:

```bash
ipconfig
```

Copy the **IPv4 Address** (e.g. `192.168.1.206`) and paste it into `api.js`.

> The phone and laptop must be connected to the **same Wi-Fi network**.

---

## Test Accounts

| Role | Email | Password |
|---|---|---|
| Community Member | testuser@gmail.com | 123456 |
| Manager | manager1@gmail.com | 123456 |
| Worker | worker1@giu.edu.eg | 123456 |

---

## Full Workflow Testing

**Community Member**
- [ ] Login
- [ ] Submit issue
- [ ] Upload issue photo
- [ ] View submitted issues

**Facility Manager**
- [ ] View all issues
- [ ] Assign worker
- [ ] Update issue status

**Worker**
- [ ] View assigned issues
- [ ] Add completion comment
- [ ] Upload completion photo
- [ ] Mark issue resolved

---

## Common Issues

| Problem | Solution |
|---|---|
| App cannot connect | Update IP address in `api.js` |
| 401 Unauthorized | Login again and use a valid JWT token |
| 403 Forbidden | User role not allowed for this action |
| Image upload fails | Check Supabase bucket name and credentials |
| No workers found | Ensure users with role `worker` exist in the database |

---

## Run Commands Summary

**Backend**

```bash
cd backend
npm run dev
```

**Frontend**

```bash
cd mobile
npx expo start -c
```

---

## Clone the Repository

```bash
git clone https://github.com/salwakhaledmetwally0726-glitch/campuscareproject.git
```

---

*Built by Team LogicLab — German International University*
