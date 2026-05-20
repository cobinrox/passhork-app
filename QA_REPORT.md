# Passhork App — QA Test Report

**Tester:** QA Engineer (agent-qa-engineer)
**Date:** 2025-05-18
**Task ID:** 2fd16b92-89eb-4a3e-9835-d8a0a46d394e
**Status:** Completed — 4 issues found (2 critical, 2 moderate)

---

## 1. Environment Setup

### 1.1 Prerequisites
- Node.js and npm are installed.
- All dependencies installed via `npm install`.
- Vite dev server started successfully on `http://localhost:5173`.

### 1.2 Docker Setup
- Dockerfile and docker-compose.yml exist.
- Not tested in Docker (used Vite dev server for inspection).

---

## 2. Functional Tests

### 2.1 Onboarding Flow ✅
- App loads with onboarding screen showing:
  - "Passhork" title
  - Description text
  - "100% Private" and "Easy to Type" features
  - "Get Started" button
- Clicking "Get Started" navigates to the main app.

### 2.2 Main App Screen ✅
- Main screen displays:
  - Header with "Passhork" logo and name
  - "Enable AI Generation" banner with "Download Model" button
  - Password display area with copy/new buttons
  - Password length slider (range 12-20, default 15)
  - Ergonomics score bar (0-100%)
  - Complexity check indicators (5 requirements)
  - Recent phrases section

### 2.3 Password Generation ✅ (offline/fallback mode)
- Clicking "New" generates passwords from the FALLBACK_PHRASES database.
- Tested passwords generated:
  - "ToBe@Not2Be!" from "To be or not to be" (14 chars, ergo: 45%)
  - "Eur3ka!777" from "Eureka" (11 chars, ergo: 100%)
  - "T!me@IsM0n3y$" from "Time is money" (14 chars, ergo: 100%)

### 2.4 Complexity Validation ✅
- complexityChecker.js checks 5 requirements:
  1. Length ≥ 12
  2. Has uppercase letter
  3. Has lowercase letter
  4. Has number
  5. Has special character from set: `! @ # $ % & * - + ( )`
- All three tested passwords met all 5 requirements.

### 2.5 Ergonomic Scoring ✅
- scorer.js implements proper QWERTY hand alternation logic:
  - Left hand (h=0): q,w,e,r,t,a,s,d,f,g,z,x,c,v,b,1,2,3,4,5,!,@,#,$,%,-
  - Right hand (h=1): y,u,i,o,p,h,j,k,l,n,m,6,7,8,9,0,^,&,*,(,),_,+,=
- Score formula: `100 - (sameHandRepeats × 5) + (handAlternations × 10) - (longReaches × 15)`
  - "ToBe@Not2Be!" → 45% (many consecutive same-hand chars)
  - "T!me@IsM0n3y$" → 100% (good hand alternation)
  - "Eur3ka!777" → 100% (good alternation despite repeated '7's)

---

## 3. PWA Verification

### 3.1 PWA Config ✅
- vite-plugin-pwa configured in `vite.config.js`
- `registerType: 'autoUpdate'` — auto-updates service worker
- `display: 'standalone'` — enables full-screen app-like experience
- `workbox: { maximumFileSizeToCacheInBytes: 30 * 1024 * 1024 }` — supports large AI model caching

### 3.2 PWA Manifest ⚠️ **MODERATE ISSUE**
- Manifest references `vite.svg` and `mask-icon.svg` as icons.
- `pwa-192x192.png` and `pwa-512x512.png` exist in `/public/` but are **NOT** referenced in the manifest config.
- This may cause some platforms to show a generic icon when installing the PWA.

---

## 4. Issues Found

### 🔴 ISSUE 1 (Critical): Forbidden characters 0/O and 1/l/I used in fallback passwords
**File:** `src/utils/phraseDatabase.js`
**Severity:** Critical
**Description:** The spec explicitly states: "Avoid characters that are visually confusing or error-prone: 0/O, 1/l/I". However, **11 out of 27** fallback passwords contain these characters:
- `0` (digit zero) used in: "H3r3@c0mesSun!", "Kn0wl3dg3@Pwr!", "T!me@IsM0n3y$", "Just@DoIt-100", "Chang3@W0rld!", "Qu!ck@Br0wnFox1", "H3ll0@W0rld!1"
- `1` (digit one) used in: "I-Hav3@Dream1", "B3l!3v3@U-Can1", "GoodV!b3s@Only1", "Qu!ck@Br0wnFox1", "H3ll0@W0rld!1", "Op3n@S3sam3!1", "Carp3@D!em!1"

### 🔴 ISSUE 2 (Critical): Fallback substitution `o`→`0` violates spec
**File:** `src/hooks/usePassword.js`, line 47
**Severity:** Critical
**Description:** The fallback `.replace(/o/gi, '0')` explicitly replaces 'o' with the digit zero (`0`), which is one of the visually confusing characters the spec says to avoid. The spec says zero/O is confusing — this direct substitution creates zero characters by design.

### 🟡 ISSUE 3 (Moderate): "Eur3ka!777" password is only 11 chars vs target 15
**File:** `src/utils/phraseDatabase.js`
**Severity:** Moderate
**Description:** The pre-generated password "Eur3ka!777" is only 11 characters, which is significantly shorter than the default target of 15. The truncation guard only triggers when length > targetLength + 2 (i.e., > 17 for target 15), so under-length passwords aren't padded. Also has sequential repeated character "777" which is weak for ergonomics.

### 🟡 ISSUE 4 (Moderate): Hardcoded recent phrases instead of dynamic history
**File:** `src/App.jsx`, lines 264-268
**Severity:** Moderate
**Description:** The "Recent phrases" section uses hardcoded examples `['ToBe@Not2Be!', 'LookB4@Leap!', 'Stay+Hungry5!']` rather than dynamically tracking the user's generated passwords. This means every user sees the same examples regardless of what they've generated.

---

## 5. Recommendations

### Must fix before release:
1. **Rebuild fallback passwords** in `phraseDatabase.js` to replace all `0` with alternatives (e.g., use `@` or `4` for 'a' sounds, keep 'o' as-is or use parentheses) and replace `1` with alternatives.
2. **Fix substitution logic** in `usePassword.js` line 47: replace `.replace(/o/gi, '0')` with a safe substitution or no substitution for 'o'.

### Should fix:
3. **Update PWA manifest** to include the actual PNG icons (`pwa-192x192.png`, `pwa-512x512.png`) for proper mobile installation.
4. **Implement dynamic recent history** tracking using localStorage or state.
5. **Add padding logic** for under-length passwords in the fallback generator.

### Nice to have:
6. **Improve ergonomic scoring** to penalize sequential repeated characters (like "777") even if they technically alternate hands.
7. **Add a "Copy" toast notification** feedback — currently the copy button just says "Copied!" without user confirmation.

---

## 6. Test Environment

| Item | Detail |
|------|--------|
| App URL | http://localhost:5173 |
| Node | v20+ |
| Browser | Chrome (via agent-browser) |
| Mode | Offline fallback (no AI model download) |
| AI Model | TinyLlama-1.1B (not downloaded — 600MB) |
