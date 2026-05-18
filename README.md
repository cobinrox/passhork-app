# Passhork v2

AI-assisted password generator app that creates memorable, ergonomic passwords optimized for human memory and QWERTY typing flow.

## Features

- **Local-First AI**: Uses Transformers.js to run a lightweight LLM (TinyLlama) directly in your browser.
- **Privacy-First**: No data ever leaves your device. Password generation happens 100% offline.
- **Configurable Length**: Generate passwords from 12 to 20 characters (default 15).
- **PWA Support**: Install it on your mobile device (iOS/Android) for a native app experience.
- **Ergonomic Scoring**: Passwords are scored (0-10) based on hand alternation and finger reach.
- **Offline Fallback**: Includes 500+ pre-cached phrases for immediate use.

---

## Prerequisites

To run this app on your Windows machine, ensure you have one of the following installed:
- **Node.js (v20 or higher)** and **npm**
- **Docker Desktop** (if you prefer running via containers)

---

## Getting Started (Windows)

### Option 1: Using Node.js (Recommended for Development)

1. **Clone or Download** this directory to your machine.
2. Open **PowerShell** or **Command Prompt** in the `passhork-app` folder.
3. Install dependencies:
   ```powershell
   npm install
   ```
4. Start the development server:
   ```powershell
   npm run dev
   ```
5. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Option 2: Using Docker

1. Ensure **Docker Desktop** is running.
2. Open your terminal in the `passhork-app` folder.
3. Build and start the container:
   ```bash
   docker-compose up -d
   ```
4. Access the app at `http://localhost:8080`.

---

## Testing on Mobile

To test the PWA features on your phone:

1. **Find your Local IP Address**:
   - Open PowerShell and type `ipconfig`.
   - Look for the "IPv4 Address" (e.g., `192.168.1.50`).
2. **Access from Phone**:
   - Ensure your phone is on the **same Wi-Fi** as your Windows machine.
   - Open Safari (iOS) or Chrome (Android) and type `http://<your-ip>:5173` (or `:8080` if using Docker).
3. **Install the App**:
   - Follow the in-app onboarding instructions to "Add to Home Screen."

---

## Architecture

- **Frontend**: React (Vite) + Tailwind CSS
- **AI Engine**: Transformers.js (v3) running TinyLlama
- **PWA**: vite-plugin-pwa for offline caching and installation
- **Icons**: Lucide React

## Privacy Note

Passhork does not collect any data. The "AI Brain" is downloaded once and stored in your browser's local database. All generation happens locally.
