# Telegram Cloud Drive

A Google Drive–style file manager that stores file bytes on **Telegram** (via a bot and channel) and keeps metadata in **MongoDB**. Register, upload, organize in folders, preview, share links, and restore from trash.

**Live demo:** [https://telegram-cloud-drive-2.onrender.com/](https://telegram-cloud-drive-2.onrender.com/)

## Features

- Email/password auth (JWT)
- Drag-and-drop and multi-file upload (up to 1 GB per file)
- Large files split into ~45 MB chunks and uploaded to Telegram
- Nested folders, rename, star, categories (documents, archives, and more)
- Grid and list views, recent files, trash (soft delete / restore / permanent delete)
- File preview and download
- Public share links (view + download) with revoke
- Light / dark / system theme
- Storage usage in the sidebar

## Tech stack

| Layer | Stack |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, Axios |
| Backend | Node.js, Express 5, Mongoose, Multer (memory), JWT, bcrypt |
| Storage | Telegram Bot API (`node-telegram-bot-api`) + MongoDB |

## How it works

1. The API accepts an upload into memory (no disk writes).
2. Files over ~45 MB are split; each part is sent as a document to your Telegram channel.
3. MongoDB stores name, size, MIME type, folder, owner, Telegram `file_id` / `message_id` (and chunk list).
4. Download and share reconstruct the file from Telegram using those IDs.

You need a Telegram bot (BotFather) and a channel the bot can post to.

## Project structure

```
Telegram-Cloud-Drive/
├── Frontend/          # Vite + React app
├── Backend/           # Express API
└── package.json       # Production start (API)
```

## Prerequisites

- Node.js 18+
- MongoDB (Atlas or local)
- Telegram bot token and channel ID (bot must be an admin of the channel)

## Setup

### Backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/telegram-cloud-drive
JWT_SECRET=replace-with-a-long-random-string
TELEGRAM_BOT_TOKEN=123456:ABC-your-bot-token
TELEGRAM_CHANNEL_ID=-100xxxxxxxxxx
```

```bash
npm run dev
```

API defaults to `http://localhost:5000` (`GET /api/health` for a health check).

### Frontend

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

App defaults to `http://localhost:5173`.

## API overview

| Prefix | Auth | Purpose |
| --- | --- | --- |
| `/api/auth` | public register/login; `/me` protected | Accounts |
| `/api/files` | JWT | Upload, list, download, rename, star, trash, storage stats |
| `/api/folders` | JWT | Create, list, rename, delete |
| `/api/share` | public get/download by token; create/revoke JWT | Share links |

## Scripts

**Root (typical Render/API deploy):** `npm start` → `node Backend/server.js`

**Frontend:** `npm run dev` · `npm run build` · `npm run preview`

## Notes

- Telegram Bot API file size limits still apply per document; chunking is how larger uploads get through.
- Uploads live in RAM during processing, so very large files need enough server memory.
- Keep `.env` files out of git (they are gitignored).
