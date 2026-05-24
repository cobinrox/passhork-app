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
   # For production (Nginx on port 8080)
   docker-compose up -d
   
   # For development (Vite on port 5173 with hot-reload)
   docker build --target dev -t passhork:dev .
   docker run -p 5173:5173 passhork:dev
   ```
4. Access the production build at `http://localhost:8080` or dev at `http://localhost:5173`.

---

## Testing on Mobile

To test the PWA features on your phone:

1. **Configure Host Access**:
   - The app is configured to bind to `0.0.0.0` (see `vite.config.js`), allowing external access on your local network.

2. **Find your Local IP Address**:
   - Open PowerShell and type `ipconfig`.
   - Look for the "IPv4 Address" (e.g., `192.168.1.50`).

3. **Access from Phone**:
   - Ensure your phone is on the **same Wi-Fi** as your Windows machine.
   - Open Safari (iOS) or Chrome (Android) and type `http://<your-ip>:5173` (or `:8080` if using the production build).

4. **Install the App**:
   - Follow the in-app onboarding instructions to "Add to Home Screen."

---

## Troubleshooting Mobile Access

If you get an error like "The URL can't be shown" or "Connection Refused" on your phone:

1. **Check the Prefix**: Safari on iPhone requires `http://` at the start. Use `http://192.168.1.50:5173` (replace with your IP).
2. **Windows Firewall**: By default, Windows blocks incoming connections on port 5173.
 - Go to **Windows Search** > "Windows Defender Firewall with Advanced Security".
 - Click **Inbound Rules** > **New Rule**.
 - Select **Port** > **Next**.
 - Select **TCP** and enter `5173` in "Specific local ports".
 - Select **Allow the connection** > **Next**.
 - Ensure "Private" is checked (and "Public" if needed) > **Next**.
 - Name it "Passhork Dev" and click **Finish**.
3. **Same Network**: Ensure both devices are on the same Wi-Fi. Guest Wi-Fi networks often block device-to-device communication.

---

## Architecture

- **Frontend**: React (Vite) + Tailwind CSS
- **AI Engine**: Transformers.js (v3) running TinyLlama
- **PWA**: vite-plugin-pwa for offline caching and installation
- **Icons**: Lucide React

## Passhork v3 (Flask + React + Gemini)

The `v3/` directory contains the new architecture using a Python Flask backend and a React frontend.

### Running v3 with Docker

1. Ensure you have a `GOOGLE_API_KEY` set in your environment.
2. Navigate to the `v3` folder.
3. Run:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend at `http://localhost:5173`.
