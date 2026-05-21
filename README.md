# 🔐 SafetheLock — Vault: Realistic Secure Manager

A modern, browser-based password manager and secure vault built with React, TypeScript, and Firebase — deployed at [safethelock.vercel.app](https://safethelock.vercel.app).

---

## 🌟 Features

- **Secure Password Storage** — Store and manage credentials encrypted with `crypto-js`
- **Firebase Backend** — Real-time database and authentication via Firebase v10
- **Smooth UI Animations** — Polished transitions powered by Framer Motion
- **Responsive Design** — Mobile-friendly layout using Tailwind CSS v4
- **Icon-Rich Interface** — Clean icons from Lucide React and React Icons
- **Date Utilities** — Credential timestamps and sorting via `date-fns`

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Backend / Auth | Firebase 10 |
| Encryption | crypto-js |
| Animations | Framer Motion |
| Icons | Lucide React, React Icons |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dharanigovardhan2008/Safethelock.git
cd Safethelock

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Starts the local dev server. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🔧 Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** and **Firestore** (or Realtime Database)
3. Copy your Firebase config and add it to your environment variables or a config file in `src/`

---

## 📁 Project Structure

```
Safethelock/
├── public/           # Static assets
├── src/              # Application source code
│   ├── components/   # UI components
│   ├── pages/        # Route-level views
│   └── ...
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🌐 Live Demo

👉 [https://safethelock.vercel.app](https://safethelock.vercel.app)

---

## 📄 License

This project is private. All rights reserved.

---

## 👤 Author

**Dharani Govardhan**
GitHub: [@dharanigovardhan2008](https://github.com/dharanigovardhan2008)
