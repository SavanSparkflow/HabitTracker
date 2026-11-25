# Sharpen The Saw — Monthly Habit Tracker (૭મી આદત)

A full-stack MERN (**MongoDB + Express + React + Tailwind CSS**) implementation of the **7th Habit (Sharpen the Saw)** holistic habit tracker covering **Body**, **Mind**, **Heart**, and **Soul**.

## Features

- **15 Pre-seeded Habits** from the PDF across Body (4), Mind (4), Heart (3), and Soul (4) with custom monthly day targets (`20`, `25`, `26`, `28`, `30`).
- **Dual Views:**
  - **Monthly Matrix Grid:** Sticky Dimension/Habit columns, dynamic `1–28/29/30/31` day cells, live row & column totals.
  - **Daily Focus View:** Mobile-friendly cards for checking off any selected date.
- **Weekly, Monthly & Quarterly Review Checklists:**
  - Weekly W1–W4 toggles for all 4 dimensions.
  - Monthly `હા / બાકી` (`Done / Pending`) toggles.
  - Quarterly review synced across the 3 months of each quarter (`Q1–Q4`).
- **End-of-Month Self-Reflection:** Save the 3 reflection prompts per month.
- **Bilingual (`ગુજરાતી` / `English`)** toggle + **Print / Export PDF** styling.
- **Habit Manager Modal:** Add custom habits, adjust monthly targets, or restore the 15 PDF defaults.

## Running Locally

### 1. Start the Backend (`server/`)
```bash
cd server
npm run dev
```
By default it connects to `mongodb://127.0.0.1:27017/sharpen-the-saw-habit-tracker` on port `5000` (configured in `server/.env`).

### 2. Start the Frontend (`client/`)
```bash
cd client
npm run dev
```
Open `http://localhost:5173` in your browser.
